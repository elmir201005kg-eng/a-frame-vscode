import "server-only";
import { randomUUID } from "node:crypto";
import { db, databaseTable } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { fail, stay } from "@/lib/validation";
import { demoModeEnabled } from "@/lib/demo";
import { FINIK_PAYMENT_AMOUNT, FINIK_PAYMENT_METHOD } from "@/lib/finik-config";
import { notifyAdministrators } from "@/lib/admin-events";

type Transaction = Prisma.TransactionClient;
export async function blockedNights(cabinId: bigint, start: string, end: Date) {
  const from = new Date(`${start}T00:00:00Z`);
  const [calendar, bookings] = await Promise.all([
    db.cabinAvailability.findMany({
      where: { cabinId, date: { gte: from, lt: end }, status: { in: ["BLOCKED", "BOOKED"] } }, select: { date: true },
    }),
    db.booking.findMany({
      where: { cabinId, status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] }, checkOut: { gt: from }, checkIn: { lt: end } },
      select: { checkIn: true, checkOut: true },
    }),
  ]);
  const blocked = new Set(calendar.map(day => day.date.toISOString().slice(0, 10)));
  for (const booking of bookings) for (let day = Math.max(booking.checkIn.getTime(), from.getTime()); day < Math.min(booking.checkOut.getTime(), end.getTime()); day += 86400000) {
    blocked.add(new Date(day).toISOString().slice(0, 10));
  }
  return [...blocked];
}

export async function lockCabin(tx: Transaction, cabinId: bigint) {
  await tx.$queryRaw`SELECT id FROM ${databaseTable("cabins")} WHERE id = ${cabinId} FOR UPDATE`;
}
export async function quoteStay(
  cabinId: bigint,
  checkIn: string,
  checkOut: string,
  guests: number,
  tx: Transaction = db,
  promoCode = "",
) {
  const range = stay(checkIn, checkOut, guests);
  const cabin = await tx.cabin.findUnique({
    where: { id: cabinId },
    include: {
      location: { include: { region: true } },
      owner: { include: { user: { select: { isActive: true, role: true } } } },
    },
  });
  if (
    !cabin ||
    cabin.status !== "PUBLISHED" ||
    !cabin.owner.user.isActive ||
    cabin.owner.user.role !== "OWNER" ||
    cabin.owner.verificationStatus !== "VERIFIED" ||
    !cabin.location.region.isActive
  )
    fail("cabinUnavailable");
  if (!cabin.isBookable) fail("cabinNotBookable");
  if (cabin.isDemo && !demoModeEnabled()) fail("demoUnavailable");
  if (guests > cabin.maxGuests) fail("invalidGuests");
  const [collision, calendar] = await Promise.all([
    tx.booking.findFirst({
      where: {
        cabinId,
        status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
        checkIn: { lt: range.end },
        checkOut: { gt: range.start },
      },
      select: { id: true },
    }),
    tx.cabinAvailability.findMany({
      where: { cabinId, date: { gte: range.start, lt: range.end } },
    }),
  ]);
  if (collision || calendar.some((day) => day.status !== "AVAILABLE")) fail("datesUnavailable");
  const calendarByDay = new Map(calendar.map(row => [row.date.toISOString().slice(0, 10), row.price]));
  const prices = Array.from({ length: range.nights }, (_, index) => {
    const day = new Date(range.start.getTime() + index * 86400000).toISOString().slice(0, 10);
    return {
      date: day,
      price: (
        calendarByDay.get(day) ??
        cabin.pricePerNight
      ).toFixed(2),
    };
  });
  const subtotal = prices.reduce((sum, day) => sum.plus(day.price), new Prisma.Decimal(0));
  if (subtotal.gt("99999999.99")) fail("invalidPrice");
  const code = promoCode.trim().toUpperCase();
  if (code && !/^[A-Z0-9][A-Z0-9_-]{2,39}$/.test(code)) fail("invalidPromoCode");
  const promotions = await tx.promotion.findMany({ where: { cabinId, isActive: true,
    startDate: { lte: range.start }, endDate: { gte: new Date(range.end.getTime() - 86400000) },
    OR: [{ code: null }, ...(code ? [{ code }] : [])],
  }, orderBy: { id: "asc" } });
  if (code && !promotions.some(row => row.code === code)) fail("invalidPromoCode");
  let discount = new Prisma.Decimal(0), promotionId: string | null = null;
  for (const offer of promotions) {
    const candidate = Prisma.Decimal.min(subtotal, offer.discountType === "PERCENT" ? subtotal.mul(offer.discountValue).div(100).toDecimalPlaces(2) : offer.discountValue);
    if (candidate.gt(discount)) { discount = candidate; promotionId = offer.id.toString(); }
  }
  return { cabin, range, prices, subtotal, discount, promotionId, total: subtotal.minus(discount) };
}
export async function createBooking(input: {
  userId: bigint;
  cabinId: bigint;
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  requestKey: string;
  promoCode?: string;
}) {
  return db.$transaction(
    async (tx) => {
      await lockCabin(tx, input.cabinId);
      const user = await tx.user.findUnique({
        where: { id: input.userId },
        select: { isActive: true },
      });
      if (!user?.isActive) fail("forbidden");
      const setting = await tx.siteSetting.findUnique({ where: { key: "bookingsEnabled" } });
      if (setting?.value === false) fail("bookingsDisabled");
      const duplicate = await tx.booking.findUnique({ where: { requestKey: input.requestKey } });
      if (duplicate) {
        if (
          duplicate.userId !== input.userId ||
          duplicate.cabinId !== input.cabinId ||
          duplicate.checkIn.toISOString().slice(0, 10) !== input.checkIn ||
          duplicate.checkOut.toISOString().slice(0, 10) !== input.checkOut ||
          duplicate.guestsCount !== input.guests
        )
          fail("invalidFields");
        return duplicate;
      }
      const quote = await quoteStay(input.cabinId, input.checkIn, input.checkOut, input.guests, tx, input.promoCode);
      const demo = quote.cabin.isDemo;
      const cancelUntil = new Date(`${input.checkIn}T${quote.cabin.checkInTime}:00+06:00`);
      cancelUntil.setTime(cancelUntil.getTime() - quote.cabin.cancellationHours * 3600000);
      const booking = await tx.booking.create({
        data: {
          bookingNumber: `${demo ? "DEMO" : "AF"}-${randomUUID().replaceAll("-", "").slice(0, 20).toUpperCase()}`,
          requestKey: input.requestKey,
          userId: input.userId,
          cabinId: input.cabinId,
          checkIn: quote.range.start,
          checkOut: quote.range.end,
          guestsCount: input.guests,
          guestName: input.guestName,
          guestPhone: input.guestPhone,
          guestEmail: input.guestEmail,
          pricePerNight: quote.cabin.pricePerNight,
          nights: quote.range.nights,
          subtotal: quote.subtotal,
          discountAmount: quote.discount,
          totalAmount: quote.total,
          pricingDetails: quote.prices,
          cancelUntil,
          status: "PENDING",
        },
      });
      if (!demo)
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            userId: input.userId,
            amount: FINIK_PAYMENT_AMOUNT,
            paymentMethod: FINIK_PAYMENT_METHOD,
            status: "PENDING",
          },
        });
      await tx.notification.createMany({
        data: [
          {
            userId: input.userId,
            type: "booking.created",
            title: "booking.created",
            message: booking.bookingNumber,
            bookingId: booking.id,
            data: { number: booking.bookingNumber },
          },
          {
            userId: quote.cabin.owner.userId,
            type: "booking.received",
            title: "booking.received",
            message: booking.bookingNumber,
            bookingId: booking.id,
            data: { number: booking.bookingNumber },
          },
        ],
      });
      await notifyAdministrators(tx, "booking.created", booking.bookingNumber, booking.id);
      await tx.auditLog.create({
        data: {
          userId: input.userId,
          action: "booking.created",
          entityType: "booking",
          entityId: booking.id,
          newData: { status: "PENDING", number: booking.bookingNumber, demo, promotionId: quote.promotionId, discountAmount: quote.discount.toString() },
        },
      });
      return booking;
    },
    { maxWait: 10000, timeout: 20000 },
  );
}
export async function cancelBooking(userId: bigint, bookingId: bigint, reason: string) {
  return db.$transaction(
    async (tx) => {
      const original = await tx.booking.findFirst({
        where: { id: bookingId, userId },
        select: { cabinId: true },
      });
      if (!original) fail("notFound");
      await lockCabin(tx, original.cabinId);
      const booking = await tx.booking.findFirst({
        where: { id: bookingId, userId },
        include: { payments: true, cabin: { select: { owner: { select: { userId: true } } } } },
      });
      if (
        !booking ||
        !["PENDING", "CONFIRMED"].includes(booking.status) ||
        !booking.cancelUntil ||
        booking.cancelUntil <= new Date()
      )
        fail("cancellationClosed");
      if (booking.payments.some((row) => row.status === "PAID")) fail("refundRequired");
      await tx.booking.update({
        where: { id: bookingId },
        data: { status: "CANCELLED", cancellationReason: reason },
      });
      await tx.payment.updateMany({
        where: { bookingId, status: "PENDING" },
        data: { status: "FAILED" },
      });
      await tx.notification.create({
        data: {
          userId: booking.cabin.owner.userId,
          type: "booking.cancelled",
          title: "booking.cancelled",
          message: booking.bookingNumber,
          bookingId,
        },
      });
      await tx.auditLog.create({
        data: {
          userId,
          action: "booking.cancelled",
          entityType: "booking",
          entityId: bookingId,
          newData: { status: "CANCELLED" },
        },
      });
    },
    { maxWait: 10000, timeout: 20000 },
  );
}
