import "server-only";
import { Prisma } from "@/generated/prisma/client";
import { db, databaseTable } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { adminPage, adminPeriod, type AdminQuery } from "@/lib/admin-period";
import type { Locale } from "@/app/i18n/config";
import { addDays } from "@/lib/stay-dates";

const liveBooking: Prisma.BookingWhereInput = { cabin: { isDemo: false }, NOT: { bookingNumber: { startsWith: "DEMO-" } } };
// Only payments confirmed by the provider count as received income.
const trustedPayment: Prisma.PaymentWhereInput = {
  status: "PAID", currency: "KGS", paidAt: { not: null }, transactionId: { not: null },
  paymentMethod: { not: "AWAITING_CONFIGURATION" }, booking: liveBooking,
};
export async function adminDashboard(locale: Locale, query: AdminQuery, analytics = false) {
  await requireAdmin(locale); // Pages and the DAL each enforce authorization.
  const range = adminPeriod(query), requestedPage = adminPage(query), take = 6;
  const q = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"] as const;
  const status = allowed.find(value => value === query.status);
  const periodWhere: Prisma.BookingWhereInput = { ...liveBooking, createdAt: { gte: range.from, lt: range.until } };
  const recentWhere: Prisma.BookingWhereInput = { ...periodWhere, ...(status ? { status } : {}),
    ...(q ? { OR: [{ bookingNumber: { contains: q, mode: "insensitive" } }, { guestName: { contains: q, mode: "insensitive" } }, { cabin: { title: { contains: q, mode: "insensitive" } } }] } : {}) };
  const [cabinGroups, moderation, users, owners, bookings, bookingGroups, active, pending, income, seriesBookings, seriesPayments, regions, popular, recentCount] = await Promise.all([
    analytics ? db.cabin.groupBy({ by: ["status"], where: { isDemo: false }, _count: true }) : Promise.resolve([]),
    analytics ? Promise.resolve(0) : db.cabin.count({ where: { isDemo: false, status: "PENDING" } }),
    analytics ? db.user.count() : Promise.resolve(0), analytics ? db.ownerProfile.count() : Promise.resolve(0),
    analytics ? Promise.resolve(0) : db.booking.count({ where: periodWhere }),
    analytics ? db.booking.groupBy({ by: ["status"], where: periodWhere, _count: true }) : Promise.resolve([]),
    analytics ? db.booking.count({ where: { ...liveBooking, status: "CONFIRMED", checkOut: { gt: new Date(`${range.today}T00:00:00Z`) } } }) : Promise.resolve(0),
    db.booking.count({ where: { ...liveBooking, status: "PENDING" } }),
    db.payment.aggregate({ where: { ...trustedPayment, paidAt: { gte: range.from, lt: range.until } }, _sum: { amount: true }, _count: true }),
    analytics ? db.$queryRaw<{ day: string; value: bigint }[]>`
      SELECT to_char(b.created_at AT TIME ZONE 'Asia/Bishkek', 'YYYY-MM-DD') AS day, count(*) AS value
      FROM ${databaseTable("bookings")} b JOIN ${databaseTable("cabins")} c ON c.id=b.cabin_id
      WHERE NOT c.is_demo AND b.booking_number NOT LIKE 'DEMO-%' AND b.created_at >= ${range.from} AND b.created_at < ${range.until}
      GROUP BY day ORDER BY day` : Promise.resolve([]),
    analytics ? db.$queryRaw<{ day: string; value: Prisma.Decimal }[]>`
      SELECT to_char(p.paid_at AT TIME ZONE 'Asia/Bishkek', 'YYYY-MM-DD') AS day, sum(p.amount) AS value
      FROM ${databaseTable("payments")} p JOIN ${databaseTable("bookings")} b ON b.id=p.booking_id JOIN ${databaseTable("cabins")} c ON c.id=b.cabin_id
      WHERE p.status='PAID' AND p.currency='KGS' AND p.transaction_id IS NOT NULL AND p.payment_method <> 'AWAITING_CONFIGURATION'
        AND NOT c.is_demo AND b.booking_number NOT LIKE 'DEMO-%' AND p.paid_at >= ${range.from} AND p.paid_at < ${range.until}
      GROUP BY day ORDER BY day` : Promise.resolve([]),
    analytics ? db.$queryRaw<{ id: number; name: string; nameKg: string | null; nameEn: string | null; value: bigint }[]>`
      SELECT r.id, r.name, r.name_kg AS "nameKg", r.name_en AS "nameEn", count(*) AS value
      FROM ${databaseTable("bookings")} b JOIN ${databaseTable("cabins")} c ON c.id=b.cabin_id
      JOIN ${databaseTable("locations")} l ON l.id=c.location_id JOIN ${databaseTable("regions")} r ON r.id=l.region_id
      WHERE NOT c.is_demo AND b.booking_number NOT LIKE 'DEMO-%' AND b.created_at >= ${range.from} AND b.created_at < ${range.until}
      GROUP BY r.id ORDER BY value DESC, r.id LIMIT 5` : Promise.resolve([]),
    analytics ? db.booking.groupBy({ by: ["cabinId"], where: periodWhere, _count: true, orderBy: [{ _count: { cabinId: "desc" } }, { cabinId: "asc" }], take: 5 }) : Promise.resolve([]),
    analytics ? Promise.resolve(0) : db.booking.count({ where: recentWhere }),
  ]);
  const page = Math.min(requestedPage, Math.max(1, Math.ceil(recentCount / take)));
  const [popularCabins, recent] = await Promise.all([
    popular.length ? db.cabin.findMany({ where: { id: { in: popular.map(row => row.cabinId) } },
      select: { id: true, title: true, titleKg: true, titleEn: true, images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }], take: 1, select: { imageUrl: true } } } }) : Promise.resolve([]),
    analytics ? Promise.resolve([]) : db.booking.findMany({ where: recentWhere, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take, skip: (page - 1) * take,
      select: { id: true, bookingNumber: true, guestName: true, checkIn: true, checkOut: true, totalAmount: true, status: true,
        cabin: { select: { title: true, titleKg: true, titleEn: true } } } }),
  ]);
  const bookingByDay = new Map(seriesBookings.map(row => [row.day, Number(row.value)]));
  const paymentsByDay = new Map(seriesPayments.map(row => [row.day, Number(row.value)]));
  const series: { day: string; bookings: number; revenue: number }[] = [];
  if (analytics) for (let day = range.start; day <= range.end; day = addDays(day, 1))
    series.push({ day, bookings: bookingByDay.get(day) ?? 0, revenue: paymentsByDay.get(day) ?? 0 });
  return { range, page, take, q, status: status ?? "", recentCount, recent,
    stats: { cabins: cabinGroups.reduce((sum, row) => sum + row._count, 0), published: cabinGroups.find(row => row.status === "PUBLISHED")?._count ?? 0,
      moderation: analytics ? cabinGroups.find(row => row.status === "PENDING")?._count ?? 0 : moderation, users, owners,
      bookings: analytics ? bookingGroups.reduce((sum, row) => sum + row._count, 0) : bookings, active, pending, paid: income._count, revenue: income._sum.amount?.toString() ?? "0" },
    series, bookingGroups, regions: regions.map(row => ({ ...row, value: Number(row.value) })),
    popular: popular.map(row => ({ count: row._count, cabin: popularCabins.find(cabin => cabin.id === row.cabinId)! })) };
}
