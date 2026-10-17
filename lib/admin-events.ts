import "server-only";
import type { Prisma } from "@/generated/prisma/client";

/** Site inbox notifications are committed with the event that created them. */
export async function notifyAdministrators(tx: Prisma.TransactionClient, type: string, message: string, bookingId?: bigint) {
  const setting = await tx.siteSetting.findUnique({ where: { key: "adminNotifications" }, select: { value: true } });
  if (setting?.value === false) return;
  const administrators = await tx.user.findMany({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] }, isActive: true }, select: { id: true } });
  if (administrators.length) await tx.notification.createMany({ data: administrators.map(user => ({ userId: user.id, type, title: type, message, bookingId })) });
}
