import { isAdminRole } from "@/lib/roles";
import "server-only";
import { cache } from "react";
import { cookies } from "@/server/context";
import { redirect } from "@/server/navigation";
import { createHash, randomBytes } from "node:crypto";
import type { Locale } from "@/app/i18n/config";
import { db } from "@/lib/db";
import { fail, safeNext } from "@/lib/validation";
export { throttle } from "@/lib/throttle";

const cookieName = "a-frame-session";
const digest = (token: string) => createHash("sha256").update(token).digest("hex");
export const getUser = cache(async () => {
  // Session expiry must be evaluated for this request, including partial prefetches.

  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db.session.findUnique({
    where: { id: digest(token) },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          isActive: true,
          preferredLocale: true,
          avatarUrl: true,
          passwordHash: true,
          googleAccount: { select: { id: true } },
          ownerProfile: { select: { id: true, verificationStatus: true, businessName: true } },
        },
      },
    },
  });
  if (!session || session.expiresAt <= new Date() || !session.user.isActive ||
    (isAdminRole(session.user.role) && !session.adminVerifiedAt)) return null;
  const { passwordHash, googleAccount, ...user } = session.user;
  return { ...user, hasPassword: Boolean(passwordHash), googleConnected: Boolean(googleAccount) };
});
export async function requireUser(locale: Locale, next = `/${locale}/account`) {
  const user = await getUser();
  if (!user) redirect(`/${locale}/login?next=${encodeURIComponent(safeNext(next, locale))}`);
  return user;
}
export async function requireOwner(locale: Locale) {
  const user = await requireUser(locale, `/${locale}/owner`);
  if (user.role !== "OWNER" || !user.ownerProfile) fail("forbidden");
  return { ...user, ownerProfile: user.ownerProfile };
}
export async function requireAdmin(locale: Locale) {
  const user = await getUser();
  if (!user) redirect(`/${locale}/admin-login?next=${encodeURIComponent(`/${locale}/admin`)}`);
  if (!isAdminRole(user.role)) redirect(`/${locale}/${user.role === "OWNER" ? "owner" : "account"}`);
  return user;
}
export async function createSession(userId: bigint) {
  const user = await db.user.findUnique({ where: { id: userId }, select: { role: true, isActive: true } });
  if (!user?.isActive) fail("invalidCredentials");
  // Administrator sessions are minted atomically by OTP redemption, never password login.
  if (isAdminRole(user.role)) fail("adminCodeRequired");
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 14 * 86400000);
  await db.session.create({ data: { id: digest(token), userId, expiresAt } });
  // Rotate the browser's previous session so signing in cannot preserve a fixed token.
  await destroySession();
  await setSessionCookie(token, expiresAt);
}
export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}
export async function destroySession() {
  const store = await cookies();
  const token = store.get(cookieName)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token))
    await db.session.deleteMany({ where: { id: digest(token) } });
  store.delete(cookieName);
}
