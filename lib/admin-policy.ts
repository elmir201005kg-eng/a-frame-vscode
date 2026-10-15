import "server-only";
import { requireUser, throttle } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";
import { fail, InputError } from "@/lib/validation";
import type { Locale } from "@/app/i18n/config";
import type { Prisma } from "@/generated/prisma/client";

export async function adminActor(locale: Locale) {
  const user = await requireUser(locale, `/${locale}/admin`);
  if (!isAdminRole(user.role)) fail("forbidden");
  await throttle(`admin-mutation:${user.id}`, 100);
  return user;
}
export function adminError(error: unknown) {
  if (error instanceof InputError) return { code: error.code };
  const code = error && typeof error === "object" && "code" in error ? error.code : "";
  return { code: code === "P2002" ? "duplicateRecord" : code === "P2003" ? "recordInUse" : "serverError" };
}
export async function adminAudit(tx: Prisma.TransactionClient, userId: bigint, action: string, entityType: string, entityId: bigint, newData?: Prisma.InputJsonObject, oldData?: Prisma.InputJsonObject) {
  await tx.auditLog.create({ data: { userId, action, entityType, entityId, newData, oldData } });
}
