"use server";
import { isAdminRole } from "@/lib/roles";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSession, destroySession, requireUser, throttle } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { beginAdminLogin } from "@/lib/admin-two-factor";
import { TelegramError } from "@/lib/telegram";
import {
  email,
  phone,
  password,
  text,
  localeFrom,
  safeNext,
  fail,
  InputError,
} from "@/lib/validation";

export type ActionState = { code?: string; success?: boolean };
function errorState(error: unknown): ActionState {
  return {
    code:
      error instanceof InputError || error instanceof TelegramError
        ? error.code
        : typeof error === "object" && error !== null && "code" in error && error.code === "P2002"
          ? "emailExists"
          : "serverError",
  };
}
export async function registerAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form);
  let next: string;
  try {
    const address = email(text(form, "email", 1, 255));
    const firstName = text(form, "firstName", 1, 100),
      contact = phone(text(form, "phone", 7, 30));
    const secret = password(form.get("password"));
    if (secret !== form.get("confirmPassword")) fail("passwordMismatch");
    const role = form.get("role") === "OWNER" ? "OWNER" : "USER";
    await throttle("register:" + address, 5);
    await throttle("auth-global", 100);
    if (await db.user.findUnique({ where: { email: address }, select: { id: true } }))
      fail("emailExists");
    const user = await db.user.create({
      data: {
        email: address,
        firstName,
        phone: contact,
        passwordHash: await hashPassword(secret),
        role,
        preferredLocale: locale,
        ...(role === "OWNER" ? { ownerProfile: { create: {} } } : {}),
      },
    });
    await createSession(user.id);
    next = form.get("next")
      ? safeNext(form.get("next"), locale)
      : `/${locale}/${role === "OWNER" ? "owner" : "account"}`;
  } catch (error) {
    return errorState(error);
  }
  revalidatePath(`/${locale}`, "layout");
  redirect(next);
}
export async function loginAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form);
  let next: string;
  try {
    const address = email(text(form, "email", 1, 255));
    const secret = form.get("password");
    if (typeof secret !== "string" || !secret.length || secret.length > 128)
      fail("invalidCredentials");
    await throttle("login:" + address);
    await throttle("auth-global", 100);
    const user = await db.user.findUnique({ where: { email: address } });
    // Equal-cost verification prevents revealing account existence by timing.
    const dummy = "scrypt-v1$00000000000000000000000000000000$" + "0".repeat(128);
    const valid = await verifyPassword(secret, user?.passwordHash || dummy);
    if (!user || !user.isActive || !valid) fail("invalidCredentials");
    next = form.get("next")
      ? safeNext(form.get("next"), locale)
      : `/${locale}/${isAdminRole(user.role) ? "admin" : user.role === "OWNER" ? "owner" : "account"}`;
    if (isAdminRole(user.role)) {
      await beginAdminLogin(user, locale, next);
      next = `/admin?locale=${locale}`;
    } else await createSession(user.id);
  } catch (error) {
    return errorState(error);
  }
  revalidatePath(`/${locale}`, "layout");
  redirect(next);
}
export async function logoutAction(form: FormData) {
  const locale = localeFrom(form);
  await destroySession();
  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}`);
}
export async function logoutFormAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form);
  try { await destroySession(); }
  catch (error) { return errorState(error); }
  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}`);
}
export async function profileAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        firstName: text(form, "firstName", 1, 100),
        lastName: text(form, "lastName", 0, 100) || null,
        phone: phone(text(form, "phone", 7, 30)),
      },
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function passwordAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await throttle("password:" + user.id.toString(), 5);
    const stored = await db.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    if (stored.passwordHash && !(await verifyPassword(password(form.get("currentPassword")), stored.passwordHash)))
      fail("invalidCredentials");
    const next = password(form.get("newPassword"));
    if (next !== form.get("confirmPassword")) fail("passwordMismatch");
    await db.$transaction([
      db.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } }),
      db.session.deleteMany({ where: { userId: user.id } }),
      db.adminLoginChallenge.deleteMany({ where: { userId: user.id } }),
    ]);
    if (!isAdminRole(user.role)) {
      await createSession(user.id);
      revalidatePath(`/${locale}`, "layout");
      return { success: true };
    }
    await destroySession();
  } catch (error) {
    return errorState(error);
  }
  revalidatePath(`/${locale}`, "layout");
  redirect(`/admin?locale=${locale}`);
}
