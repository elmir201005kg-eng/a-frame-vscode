import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { lockCabin } from "@/lib/booking";
import { throttle } from "@/lib/throttle";
import type { Locale } from "@/app/i18n/config";
import { fail } from "@/lib/validation";
import { FINIK_PAYMENT_AMOUNT, FINIK_PAYMENT_METHOD } from "@/lib/finik-config";
import { createFinikPayment, finikConfiguration } from "@/lib/finik";
import type { FinikWebhookEvent } from "@/lib/finik";
import { notifyAdministrators } from "@/lib/admin-events";

type PaymentDatabase = Pick<typeof db, "$transaction">;

export async function prepareFinikPayment(userId: bigint, bookingId: bigint, client: PaymentDatabase = db) {
  return client.$transaction(async (tx) => {
    const original = await tx.booking.findFirst({ where: { id: bookingId, userId }, select: { cabinId: true } });
    if (!original) fail("notFound");
    await lockCabin(tx, original.cabinId);
    const booking = await tx.booking.findUniqueOrThrow({
      where: { id: bookingId },
      include: { cabin: { select: { isDemo: true } }, payments: { orderBy: { createdAt: "desc" } } },
    });
    if (!["PENDING", "CONFIRMED"].includes(booking.status) ||
        booking.payments.some((payment) => ["PAID", "REFUNDED"].includes(payment.status))) fail("paymentUnavailable");
    const pending = booking.payments.find((payment) => payment.status === "PENDING" &&
      [FINIK_PAYMENT_METHOD, "AWAITING_CONFIGURATION"].includes(payment.paymentMethod));
    if (pending?.providerPaymentId && pending.paymentUrl)
      return { payment: pending, bookingNumber: booking.bookingNumber };
    if (pending?.providerPaymentId && pending.createdAt.getTime() > Date.now() - 30000) fail("paymentProcessing");
    const data = {
      amount: FINIK_PAYMENT_AMOUNT, currency: "KGS", paymentMethod: FINIK_PAYMENT_METHOD,
      providerPaymentId: pending?.providerPaymentId || randomUUID(), createdAt: new Date(),
    };
    const payment = pending
      ? await tx.payment.update({ where: { id: pending.id }, data })
      : await tx.payment.create({ data: { ...data, bookingId, userId } });
    return { payment, bookingNumber: booking.bookingNumber };
  });
}

export async function startFinikPayment(input: {
  userId: bigint;
  bookingId: bigint;
  locale: Locale;
  requestUrl: string;
}): Promise<string> {
  // Reject missing configuration before throttling or reserving an attempt.
  finikConfiguration(input.requestUrl);
  await throttle(`finik-payment:${input.userId}`, 10);
  const { payment, bookingNumber } = await prepareFinikPayment(input.userId, input.bookingId);
  const paymentUrl = payment.paymentUrl || await createFinikPayment({
    paymentId: payment.providerPaymentId!, bookingId: input.bookingId.toString(),
    bookingNumber, userId: input.userId.toString(), locale: input.locale, requestUrl: input.requestUrl,
  });
  if (!payment.paymentUrl)
    await db.payment.update({ where: { id: payment.id }, data: { paymentUrl } });
  console.info(`[finik] Payment ${payment.providerPaymentId} created: ${FINIK_PAYMENT_AMOUNT} KGS`);
  return paymentUrl;
}

export async function applyFinikWebhook(event: FinikWebhookEvent, client: PaymentDatabase = db) {
  return client.$transaction(async (tx) => {
    const original = await tx.payment.findUnique({
      where: { providerPaymentId: event.paymentId }, select: { booking: { select: { cabinId: true } } },
    });
    if (!original) fail("notFound");
    await lockCabin(tx, original.booking.cabinId);
    const payment = await tx.payment.findUniqueOrThrow({
      where: { providerPaymentId: event.paymentId },
      include: { booking: { include: { cabin: { select: { isDemo: true, owner: { select: { userId: true } } } } } } },
    });
    if (payment.userId !== event.userId || payment.bookingId !== event.bookingId ||
        payment.paymentMethod !== FINIK_PAYMENT_METHOD || payment.currency !== "KGS" ||
        !payment.amount.equals(FINIK_PAYMENT_AMOUNT)) fail("invalidPayment");
    // A delayed failure must never downgrade an already received or refunded payment.
    if (payment.status === "PAID" || payment.status === "REFUNDED") {
      if (event.status === "SUCCEEDED" && payment.transactionId !== event.transactionId) fail("invalidPayment");
      return { duplicate: true };
    }
    if (event.status === "FAILED" && payment.status === "FAILED") return { duplicate: true };
    const succeeded = event.status === "SUCCEEDED";
    await tx.payment.update({
      where: { id: payment.id },
      data: succeeded
        ? { status: "PAID", transactionId: event.transactionId, paidAt: event.paidAt }
        : { status: "FAILED" },
    });
    // Money received after cancellation still needs to be recorded and reconciled.
    const refundRequired = succeeded && ["CANCELLED", "REJECTED"].includes(payment.booking.status);
    const type = refundRequired ? "payment.refundRequired" : succeeded ? "payment.received" : "payment.failed";
    await tx.notification.createMany({
      data: [...new Set([payment.userId, payment.booking.cabin.owner.userId])].map((userId) => ({
        userId, bookingId: payment.bookingId, type, title: type, message: payment.booking.bookingNumber,
        data: { amount: FINIK_PAYMENT_AMOUNT, currency: "KGS", transactionId: event.transactionId },
      })),
    });
    await notifyAdministrators(tx, type, payment.booking.bookingNumber, payment.bookingId);
    await tx.auditLog.create({
      data: {
        userId: payment.userId, action: type, entityType: "payment", entityId: payment.id,
        oldData: { status: payment.status },
        newData: { status: succeeded ? "PAID" : "FAILED", transactionId: event.transactionId, refundRequired },
      },
    });
    return { duplicate: false };
  });
}
