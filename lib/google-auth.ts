import { isAdminRole } from "@/lib/roles";
import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { OAuth2Client, CodeChallengeMethod } from "google-auth-library";
import { cookies } from "next/headers";
import type { Locale } from "@/app/i18n/config";
import { isLocale } from "@/app/i18n/config";
import { db } from "@/lib/db";
import { getUser, createSession, throttle } from "@/lib/auth";
import { email, fail, InputError, safeNext } from "@/lib/validation";

const flowCookie = "a-frame-google-flow";
const callbackPath = "/api/auth/callback/google";
const lifetime = 10 * 60 * 1000;
type GoogleFlow = {
  state: string; nonce: string; verifier: string; expiresAt: number;
  locale: Locale; next: string; role: "USER" | "OWNER"; redirectUri: string; linkUserId: string | null;
};

function configuration(requestUrl: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET_ID)?.trim();
  if (!clientId || !clientSecret) fail("googleNotConfigured");
  let base: URL;
  try { base = new URL(process.env.APP_URL || requestUrl); } catch { return fail("googleNotConfigured"); }
  if (!["http:", "https:"].includes(base.protocol) || base.username || base.password) fail("googleNotConfigured");
  const origin = base.origin;
  const redirectUri = new URL(callbackPath, origin).toString();
  if (process.env.NODE_ENV === "production" && !redirectUri.startsWith("https://")) fail("googleNotConfigured");
  const client = new OAuth2Client({ clientId, clientSecret, redirectUri });
  client.transporter.defaults = { ...client.transporter.defaults, timeout: 15000, retry: false };
  return { clientId, clientSecret, redirectUri, client, origin };
}

function cookieKey(secret: string) {
  return createHash("sha256").update("a-frame-google-flow-v1:").update(secret).digest();
}
function seal(flow: GoogleFlow, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", cookieKey(secret), iv);
  cipher.setAAD(Buffer.from(flowCookie));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(flow), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}
function unseal(value: string | undefined, secret: string): GoogleFlow {
  try {
    if (!value || value.length > 4000) throw new Error();
    const data = Buffer.from(value, "base64url");
    const decipher = createDecipheriv("aes-256-gcm", cookieKey(secret), data.subarray(0, 12));
    decipher.setAAD(Buffer.from(flowCookie));
    decipher.setAuthTag(data.subarray(12, 28));
    const flow = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8")) as GoogleFlow;
    if (!isLocale(flow.locale) || !Number.isFinite(flow.expiresAt) || flow.expiresAt <= Date.now() ||
      flow.expiresAt > Date.now() + lifetime || !/^[a-f0-9]{64}$/.test(flow.state) ||
      !/^[a-f0-9]{64}$/.test(flow.nonce) || typeof flow.verifier !== "string" ||
      !["USER", "OWNER"].includes(flow.role)) throw new Error();
    return flow;
  } catch { return fail("googleSessionExpired"); }
}
function equal(first: string | null, second: string) {
  if (!first || first.length !== second.length) return false;
  return timingSafeEqual(Buffer.from(first), Buffer.from(second));
}
export async function clearGoogleFlow() {
  (await cookies()).delete(flowCookie);
}
export async function startGoogleLogin(request: Request, form: FormData) {
  const config = configuration(request.url);
  // OAuth is started with an ordinary same-origin POST, never by prefetching a link.
  if (request.headers.get("origin") !== config.origin || request.headers.get("sec-fetch-site") === "cross-site") fail("forbidden");
  const rawLocale = form.get("locale");
  if (typeof rawLocale !== "string" || !isLocale(rawLocale)) fail("invalidFields");
  const user = await getUser();
  const linking = form.get("intent") === "link";
  if (linking && (!user || isAdminRole(user.role))) fail("forbidden");
  if (user && !linking) return safeNext(form.get("next"), rawLocale);
  await throttle("google-start-global", 100);
  if (user) await throttle("google-link:" + user.id, 10);
  const { codeVerifier, codeChallenge } = await config.client.generateCodeVerifierAsync();
  const flow: GoogleFlow = {
    state: randomBytes(32).toString("hex"), nonce: randomBytes(32).toString("hex"),
    verifier: codeVerifier, expiresAt: Date.now() + lifetime, locale: rawLocale,
    next: form.get("next") ? safeNext(form.get("next"), rawLocale) : "", role: form.get("role") === "OWNER" ? "OWNER" : "USER",
    redirectUri: config.redirectUri, linkUserId: linking && user ? user.id.toString() : null,
  };
  (await cookies()).set(flowCookie, seal(flow, config.clientSecret), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: lifetime / 1000,
  });
  const target = new URL(config.client.generateAuthUrl({
    scope: ["openid", "email", "profile"], state: flow.state, prompt: "select_account",
    code_challenge: codeChallenge, code_challenge_method: CodeChallengeMethod.S256,
  }));
  target.searchParams.set("nonce", flow.nonce);
  return target.toString();
}

export async function finishGoogleLogin(request: Request) {
  const config = configuration(request.url);
  const store = await cookies();
  const encrypted = store.get(flowCookie)?.value;
  await clearGoogleFlow();
  const flow = unseal(encrypted, config.clientSecret);
  const query = new URL(request.url).searchParams;
  const failurePath = flow.linkUserId ? `/${flow.locale}/account?tab=settings` : `/${flow.locale}/login?next=${encodeURIComponent(flow.next)}`;
  try {
    if (!equal(query.get("state"), flow.state) || flow.redirectUri !== config.redirectUri) fail("googleSessionExpired");
    if (query.has("error")) fail(query.get("error") === "access_denied" ? "googleCancelled" : "googleFailed");
    const code = query.get("code");
    if (!code || code.length > 4096) fail("googleFailed");
    const { tokens } = await config.client.getToken({ code, codeVerifier: flow.verifier, redirect_uri: flow.redirectUri });
    if (!tokens.id_token) fail("googleFailed");
    const ticket = await config.client.verifyIdToken({ idToken: tokens.id_token, audience: config.clientId });
    const identity = ticket.getPayload();
    const nonce = (identity as unknown as { nonce?: string })?.nonce;
    if (!identity?.sub || identity.sub.length > 255 || !identity.email || identity.email_verified !== true ||
      !equal(nonce || null, flow.nonce) || (identity.azp && identity.azp !== config.clientId)) fail("googleFailed");
    const address = email(identity.email);
    const avatarUrl = googleAvatar(identity.picture);
    const currentUser = await getUser();
    if (flow.linkUserId && (!currentUser || currentUser.id.toString() !== flow.linkUserId || isAdminRole(currentUser.role))) fail("googleSessionExpired");
    const user = await db.$transaction(async (tx) => {
      const linked = await tx.googleAccount.findUnique({ where: { subject: identity.sub }, include: { user: true } });
      if (linked) {
        if (flow.linkUserId && linked.userId.toString() !== flow.linkUserId) fail("googleAlreadyLinked");
        if (!linked.user.isActive) fail("invalidCredentials");
        if (isAdminRole(linked.user.role)) fail("googleAdminLogin");
        return tx.user.update({ where: { id: linked.userId }, data: { ...(avatarUrl ? { avatarUrl } : {}) } });
      }
      if (flow.linkUserId) {
        const owner = await tx.user.findUnique({ where: { id: BigInt(flow.linkUserId) }, include: { googleAccount: true } });
        if (!owner?.isActive || isAdminRole(owner.role)) fail("forbidden");
        if (owner.googleAccount) fail("googleAlreadyLinked");
        // Linking requires both a local session and a fresh, verified Google identity.
        if (owner.email.toLowerCase() !== address) fail("googleEmailMismatch");
        return tx.user.update({ where: { id: owner.id }, data: {
          googleAccount: { create: { subject: identity.sub } }, isVerified: true,
          ...(avatarUrl ? { avatarUrl } : {}),
        } });
      }
      const existing = await tx.user.findUnique({ where: { email: address }, select: { id: true } });
      if (existing) fail("googleLinkRequired");
      return tx.user.create({ data: {
        email: address, firstName: (identity.given_name || identity.name || address.split("@")[0]).slice(0, 100),
        lastName: identity.family_name?.slice(0, 100) || null, avatarUrl,
        isVerified: true, preferredLocale: flow.locale, role: flow.role,
        googleAccount: { create: { subject: identity.sub } },
        ...(flow.role === "OWNER" ? { ownerProfile: { create: {} } } : {}),
      } });
    });
    await createSession(user.id);
    return { path: flow.linkUserId ? `/${flow.locale}/account?tab=settings&google=connected` : flow.next || `/${flow.locale}/${user.role === "OWNER" ? "owner" : "account"}`, origin: config.origin };
  } catch (error) {
    const code = googleErrorCode(error);
    return { path: `${failurePath}&error=${encodeURIComponent(code)}`, origin: config.origin };
  }
}
export function googleErrorCode(error: unknown) {
  return error instanceof InputError ? error.code :
    typeof error === "object" && error !== null && "code" in error && error.code === "P2002" ? "googleLinkRequired" : "googleFailed";
}
export function googleAvatar(value: string | undefined) {
  try {
    const url = new URL(value || "");
    return url.protocol === "https:" && url.hostname.endsWith(".googleusercontent.com") && !url.username && !url.password ? url.toString() : null;
  } catch { return null; }
}
