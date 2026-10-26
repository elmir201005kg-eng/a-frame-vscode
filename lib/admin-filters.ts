import type { Prisma } from "@/generated/prisma/client";
import type { AdminQuery } from "@/lib/admin-period";
import { addDays, isDateOnly } from "@/lib/stay-dates";

export const queryString = (q: AdminQuery, key: string) => typeof q[key] === "string" ? q[key].trim().slice(0, 150) : "";
export function adminDateFilter(query: AdminQuery) {
  const from = queryString(query, "from"), to = queryString(query, "to");
  const upper = to && isDateOnly(to) ? addDays(to, 1) : "";
  const invalid = Boolean((from && !isDateOnly(from)) || (to && !upper) || (from && to && from > to));
  return { invalid, from, to, where: invalid ? undefined : {
    ...(from ? { gte: new Date(`${from}T00:00:00+06:00`) } : {}),
    ...(to ? { lt: new Date(`${upper}T00:00:00+06:00`) } : {}),
  } };
}
export function paymentFilters(query: AdminQuery): Prisma.PaymentWhereInput {
  const q = queryString(query, "q"), status = queryString(query, "status"), range = adminDateFilter(query);
  return {
    ...(["PENDING", "PAID", "FAILED", "REFUNDED"].includes(status) ? { status: status as Prisma.EnumPaymentStatusFilter["equals"] } : {}),
    ...(range.where ? { createdAt: range.where } : {}),
    ...(q ? { OR: [
      { transactionId: { contains: q, mode: "insensitive" } }, { providerPaymentId: { contains: q, mode: "insensitive" } },
      { booking: { bookingNumber: { contains: q, mode: "insensitive" } } }, { booking: { cabin: { title: { contains: q, mode: "insensitive" } } } },
      { user: { email: { contains: q, mode: "insensitive" } } }, { user: { firstName: { contains: q, mode: "insensitive" } } },
    ] } : {}),
  };
}
export function bookingFilters(query: AdminQuery): Prisma.BookingWhereInput {
  const q = queryString(query, "q"), status = queryString(query, "status"), payment = queryString(query, "payment"), range = adminDateFilter(query);
  const userId = queryString(query, "userId"), bookingId = queryString(query, "bookingId");
  return {
    ...(/^[1-9]\d{0,17}$/.test(userId) ? { userId: BigInt(userId) } : {}),
    ...(/^[1-9]\d{0,17}$/.test(bookingId) ? { id: BigInt(bookingId) } : {}),
    ...(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "REJECTED"].includes(status) ? { status: status as Prisma.EnumBookingStatusFilter["equals"] } : {}),
    ...(range.where ? { createdAt: range.where } : {}),
    ...(["PENDING", "PAID", "FAILED", "REFUNDED"].includes(payment) ? { payments: { some: { status: payment as Prisma.EnumPaymentStatusFilter["equals"] } } } : {}),
    ...(q ? { OR: [{ bookingNumber: { contains: q, mode: "insensitive" } }, { guestName: { contains: q, mode: "insensitive" } }, { guestEmail: { contains: q, mode: "insensitive" } }, { cabin: { title: { contains: q, mode: "insensitive" } } }] } : {}),
  };
}
