import { isAdminRole } from "@/lib/roles";
import "server-only";
import { cookies } from "@/server/context";
import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import type { Locale } from "@/app/i18n/config";
import { baseDictionary } from "@/app/i18n/platform";
import { db, databaseTable } from "@/lib/db";
import { fail, safeNext } from "@/lib/validation";
import { sendAdminTelegramMessage, telegramAdminChat, TelegramError } from "@/lib/telegram";
import { setSessionCookie } from "@/lib/auth";

const cookieName = "a-frame-admin-login";
const lifetime = 5 * 60 * 1000;
const attemptLimit = 5;
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
function otpSecret() {
  const secret = process.env.ADMIN_OTP_SECRET || "";
  if (!/^[a-f0-9]{64}$/i.test(secret)) fail("telegramNotConfigured");
  return Buffer.from(secret, "hex");
}
function hashCode(id: string, code: string) {
  return createHmac("sha256", otpSecret()).update(`${id}:${code}`).digest("hex");
}
async function challengeId() {
  const token = (await cookies()).get(cookieName)?.value;
  return token && /^[a-f0-9]{64}$/.test(token) ? digest(token) : null;
}

export async function getPendingAdminLogin() {

  const id = await challengeId();
  if (!id) return false;
  const challenge = await db.adminLoginChallenge.findUnique({ where: { id }, include: { user: true } });
  return Boolean(challenge && challenge.deliveredAt && challenge.expiresAt > new Date() &&
    challenge.attempts < attemptLimit && challenge.user.isActive && isAdminRole(challenge.user.role) &&
    challenge.user.passwordHash && challenge.credentialVersion === digest(challenge.user.passwordHash));
}

export async function beginAdminLogin(
  verifiedUser: { id: bigint; passwordHash: string | null },
  locale: Locale,
  next?: string,
) {
  telegramAdminChat();
  otpSecret();
  const token = randomBytes(32).toString("hex");
  const id = digest(token), code = String(randomInt(0, 1000000)).padStart(6, "0");
  const expiresAt = new Date(Date.now() + lifetime);
  const dictionary = await baseDictionary(locale, "admin-login");
  if (typeof dictionary.telegramMessage !== "string" || !dictionary.telegramMessage.includes("{code}"))
    fail("serverError");
  await db.$transaction(async (tx) => {
    // Same lock order as password/role updates: user, then pending challenge.
    await tx.$queryRaw`SELECT id FROM ${databaseTable("users")} WHERE id = ${verifiedUser.id} FOR UPDATE`;
    const current = await tx.user.findUnique({ where: { id: verifiedUser.id } });
    if (!current?.isActive || !isAdminRole(current.role) || !current.passwordHash || current.passwordHash !== verifiedUser.passwordHash)
      fail("invalidCredentials");
    await tx.adminLoginChallenge.deleteMany({ where: { userId: current.id } });
    await tx.adminLoginChallenge.create({ data: {
      id, userId: current.id, codeHash: hashCode(id, code),
      credentialVersion: digest(current.passwordHash), expiresAt,
      redirectTo: next ? safeNext(next, locale) : `/admin?locale=${locale}`,
    } });
  });
  try {
    await sendAdminTelegramMessage(dictionary.telegramMessage.replaceAll("{code}", code));
    const delivered = await db.adminLoginChallenge.updateMany({ where: { id }, data: { deliveredAt: new Date() } });
    if (delivered.count !== 1) fail("adminCodeExpired");
    (await cookies()).set(cookieName, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: "/", expires: expiresAt,
    });
  } catch (error) {
    await db.adminLoginChallenge.deleteMany({ where: { id } });
    if (error instanceof TelegramError) fail(error.code);
    throw error;
  }
}

export async function cancelPendingAdminLogin() {
  const id = await challengeId();
  if (id) await db.adminLoginChallenge.deleteMany({ where: { id } });
  (await cookies()).delete(cookieName);
}

export async function confirmAdminLogin(code: string) {
  const id = await challengeId();
  if (!id) fail("adminCodeExpired");
  const candidate = await db.adminLoginChallenge.findUnique({ where: { id }, select: { userId: true } });
  if (!candidate) {
    (await cookies()).delete(cookieName);
    fail("adminCodeExpired");
  }
  const result = await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM ${databaseTable("users")} WHERE id = ${candidate.userId} FOR UPDATE`;
    await tx.$queryRaw`SELECT id FROM ${databaseTable("admin_login_challenges")} WHERE id = ${id} FOR UPDATE`;
    const challenge = await tx.adminLoginChallenge.findUnique({ where: { id }, include: { user: true } });
    if (!challenge) return { ok: false as const, code: "adminCodeExpired" };
    if (!challenge.deliveredAt || challenge.expiresAt <= new Date() ||
      !challenge.user.isActive || !isAdminRole(challenge.user.role) || !challenge.user.passwordHash ||
      challenge.credentialVersion !== digest(challenge.user.passwordHash)) {
      await tx.adminLoginChallenge.delete({ where: { id } });
      return { ok: false as const, code: "adminCodeExpired" };
    }
    if (challenge.attempts >= attemptLimit) {
      await tx.adminLoginChallenge.delete({ where: { id } });
      return { ok: false as const, code: "adminCodeAttempts" };
    }
    if (!/^[0-9]{6}$/.test(code) ||
      !timingSafeEqual(Buffer.from(hashCode(id, code), "hex"), Buffer.from(challenge.codeHash, "hex"))) {
      const attempts = challenge.attempts + 1;
      if (attempts === attemptLimit) await tx.adminLoginChallenge.delete({ where: { id } });
      else await tx.adminLoginChallenge.update({ where: { id }, data: { attempts } });
      // Return instead of throwing: invalid attempts must commit.
      return { ok: false as const, code: attempts === attemptLimit ? "adminCodeAttempts" : "invalidAdminCode" };
    }
    const sessionToken = randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 14 * 86400000);
    await tx.adminLoginChallenge.delete({ where: { id } });
    await tx.session.create({ data: {
      id: digest(sessionToken), userId: challenge.userId, expiresAt: sessionExpiresAt,
      adminVerifiedAt: new Date(),
    } });
    return { ok: true as const, token: sessionToken, expiresAt: sessionExpiresAt, redirectTo: challenge.redirectTo };
  });
  if (!result.ok) {
    if (result.code !== "invalidAdminCode") (await cookies()).delete(cookieName);
    fail(result.code);
  }
  // Set an authenticated cookie only after challenge consumption and session insert commit.
  await setSessionCookie(result.token, result.expiresAt);
  (await cookies()).delete(cookieName);
  return result.redirectTo;
}
