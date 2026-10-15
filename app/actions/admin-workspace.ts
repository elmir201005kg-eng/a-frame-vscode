"use server";

import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { adminActor, adminAudit, adminError } from "@/lib/admin-policy";
import { lockCabin } from "@/lib/booking";
import { localeFrom, id, text, numberField, date, stay, fail } from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";
import type { ActionState } from "./auth";

export async function deleteCabinAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form)), cabinId = id(form.get("cabinId"));
    if (form.get("confirm") !== "yes") fail("confirmationRequired");
    await db.$transaction(async tx => {
      await lockCabin(tx, cabinId);
      const cabin = await tx.cabin.findUnique({ where: { id: cabinId }, select: { title: true, _count: { select: { bookings: true, reviews: true } } } });
      if (!cabin) fail("notFound");
      if (cabin._count.bookings || cabin._count.reviews) fail("recordInUse");
      await tx.cabin.delete({ where: { id: cabinId } });
      await adminAudit(tx, user.id, "cabin.deleted", "cabin", cabinId, undefined, { title: cabin.title });
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}

export async function calendarAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form)), cabinId = id(form.get("cabinId"));
    const range = stay(text(form, "start", 10, 10), text(form, "end", 10, 10), 1);
    const mode = text(form, "mode", 1, 20), note = text(form, "note", 0, 500);
    if (!["AVAILABLE", "BLOCKED", "MAINTENANCE", "clear"].includes(mode)) fail("invalidFields");
    await db.$transaction(async tx => {
      await lockCabin(tx, cabinId);
      if (!(await tx.cabin.findUnique({ where: { id: cabinId }, select: { id: true } }))) fail("notFound");
      if (await tx.booking.count({ where: { cabinId, status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] }, checkIn: { lt: range.end }, checkOut: { gt: range.start } } })) fail("datesUnavailable");
      await tx.cabinAvailability.deleteMany({ where: { cabinId, date: { gte: range.start, lt: range.end } } });
      if (mode !== "clear") await tx.cabinAvailability.createMany({ data: Array.from({ length: range.nights }, (_, index) => ({
        cabinId, date: new Date(range.start.getTime() + index * 86400000), status: mode === "AVAILABLE" ? "AVAILABLE" : "BLOCKED",
        note: mode === "MAINTENANCE" ? `maintenance:${note}` : note,
      })) });
      await adminAudit(tx, user.id, "calendar.updated", "cabin", cabinId, { start: range.start.toISOString(), end: range.end.toISOString(), mode, note });
    }, { maxWait: 10000, timeout: 20000 });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}

export async function categoryAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form));
    const recordId = form.get("recordId") ? numberField(form, "recordId", 1, 2147483647) : null;
    await db.$transaction(async tx => {
      if (form.get("remove") === "yes") {
        if (!recordId || form.get("confirm") !== "yes") fail("confirmationRequired");
        if (await tx.cabinCategory.count({ where: { categoryId: recordId } })) fail("recordInUse");
        await tx.category.delete({ where: { id: recordId } });
        await adminAudit(tx, user.id, "category.deleted", "category", BigInt(recordId));
      } else {
        const slug = text(form, "slug", 1, 100);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("invalidFields");
        const data = { name: text(form, "name", 1, 100), nameKg: text(form, "nameKg", 0, 100) || null, nameEn: text(form, "nameEn", 0, 100) || null, slug, isActive: form.get("isActive") === "on" };
        const row = recordId ? await tx.category.update({ where: { id: recordId }, data }) : await tx.category.create({ data });
        await adminAudit(tx, user.id, "category.saved", "category", BigInt(row.id), data);
      }
    });
    updateTag("catalog-references");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}

export async function promotionAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form)), recordId = form.get("recordId") ? id(form.get("recordId")) : null;
    await db.$transaction(async tx => {
      if (form.get("remove") === "yes") {
        if (!recordId || form.get("confirm") !== "yes") fail("confirmationRequired");
        const row = await tx.promotion.findUnique({ where: { id: recordId } });
        if (!row) fail("notFound");
        await lockCabin(tx, row.cabinId);
        await tx.promotion.delete({ where: { id: recordId } });
        await adminAudit(tx, user.id, "promotion.deleted", "promotion", recordId);
      } else {
        const cabinId = id(form.get("cabinId")), discountType = text(form, "discountType", 1, 10);
        if (discountType !== "PERCENT" && discountType !== "FIXED") fail("invalidFields");
        const discountValue = numberField(form, "discountValue", 0.01, discountType === "PERCENT" ? 100 : 1000000, false);
        const startDate = date(form.get("startDate")), endDate = date(form.get("endDate"));
        if (endDate < startDate) fail("invalidDates");
        const code = text(form, "code", 0, 40).toUpperCase() || null;
        if (code && !/^[A-Z0-9][A-Z0-9_-]{2,39}$/.test(code)) fail("invalidFields");
        await lockCabin(tx, cabinId);
        const data = { cabinId, title: text(form, "title", 1, 255), description: text(form, "description", 0, 2000) || null, code,
          discountType, discountValue: new Prisma.Decimal(discountValue.toFixed(2)), startDate, endDate, isActive: form.get("isActive") === "on" };
        const row = recordId ? await tx.promotion.update({ where: { id: recordId }, data }) : await tx.promotion.create({ data });
        await adminAudit(tx, user.id, "promotion.saved", "promotion", row.id, { title: data.title, code, discountValue, discountType });
      }
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}

export async function cancelBookingAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form)), bookingId = id(form.get("bookingId")), reason = text(form, "reason", 3, 1000);
    if (form.get("confirm") !== "yes") fail("confirmationRequired");
    await db.$transaction(async tx => {
      const initial = await tx.booking.findUnique({ where: { id: bookingId }, select: { cabinId: true } });
      if (!initial) fail("notFound");
      await lockCabin(tx, initial.cabinId);
      const row = await tx.booking.findUniqueOrThrow({ where: { id: bookingId }, include: { payments: true } });
      if (!["PENDING", "CONFIRMED"].includes(row.status) || !row.cancelUntil || row.cancelUntil <= new Date()) fail("cancellationClosed");
      if (row.payments.some(payment => payment.status === "PAID")) fail("refundRequired");
      await tx.booking.update({ where: { id: bookingId }, data: { status: "CANCELLED", cancellationReason: reason } });
      await tx.payment.updateMany({ where: { bookingId, status: "PENDING" }, data: { status: "FAILED" } });
      await tx.notification.create({ data: { userId: row.userId, bookingId, type: "booking.cancelled", title: "booking.cancelled", message: row.bookingNumber } });
      await adminAudit(tx, user.id, "booking.cancelled", "booking", bookingId, { status: "CANCELLED", reason }, { status: row.status });
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}

export async function readAdminNotificationsAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form));
    await db.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}

export async function revokeAdminSessionsAction(_: ActionState, form: FormData): Promise<ActionState> {
  try {
    const user = await adminActor(localeFrom(form));
    if (form.get("confirm") !== "yes") fail("confirmationRequired");
    // Revocation is scoped to the current administrator, including the current browser.
    await db.$transaction(async tx => {
      await tx.session.deleteMany({ where: { userId: user.id } });
      await tx.adminLoginChallenge.deleteMany({ where: { userId: user.id } });
      await adminAudit(tx, user.id, "security.sessionsRevoked", "user", user.id);
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) { return adminError(error); }
}
