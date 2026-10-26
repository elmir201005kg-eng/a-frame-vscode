"use server";
import { isAdminRole } from "@/lib/roles";
import { randomBytes } from "node:crypto";
import { redirect } from "@/server/navigation";
import { revalidatePath } from "@/server/cache";
import { db } from "@/lib/db";
import { throttle } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { beginAdminLogin, confirmAdminLogin, cancelPendingAdminLogin } from "@/lib/admin-two-factor";
import { email, text, localeFrom, InputError, fail } from "@/lib/validation";
import { TelegramError } from "@/lib/telegram";

export type AdminAuthState = { code?: string; step?: "code" };
function errorCode(error: unknown) {
  return error instanceof InputError || error instanceof TelegramError ? error.code : "serverError";
}

export async function adminLoginAction(_: AdminAuthState, form: FormData): Promise<AdminAuthState> {
  try {
    const locale = localeFrom(form);
    const address = email(text(form, "email", 1, 255));
    const password = form.get("password");
    if (typeof password !== "string" || !password.length || password.length > 128) fail("invalidCredentials");
    await throttle("login:" + address);
    await throttle("auth-global", 100);
    const user = await db.user.findUnique({ where: { email: address } });
    const dummy = "scrypt-v1$00000000000000000000000000000000$" + "0".repeat(128);
    const valid = await verifyPassword(password, user?.passwordHash || dummy);
    if (!user?.isActive || !valid || !isAdminRole(user.role)) fail("invalidCredentials");
    await beginAdminLogin(user, locale);
    return { step: "code" };
  } catch (error) { return { code: errorCode(error) }; }
}

export async function verifyAdminCodeAction(_: AdminAuthState, form: FormData): Promise<AdminAuthState> {
  let destination: string;
  const locale = localeFrom(form);
  try {
    await throttle("admin-verify-global", 100);
    const code = form.get("code");
    destination = await confirmAdminLogin(typeof code === "string" ? code.trim() : "");
  } catch (error) {
    const code = errorCode(error);
    return { code, ...(code === "invalidAdminCode" || code === "serverError" ? { step: "code" as const } : {}) };
  }
  revalidatePath(`/${locale}`, "layout");
  redirect(destination);
}

export async function submitAdminAuthAction(state: AdminAuthState, form: FormData): Promise<AdminAuthState> {
  return state.step === "code" ? verifyAdminCodeAction(state, form) : adminLoginAction(state, form);
}

export async function cancelAdminLoginAction(form: FormData) {
  await cancelPendingAdminLogin();
  redirect(`/admin?locale=${localeFrom(form)}&restart=${randomBytes(8).toString("hex")}`);
}
