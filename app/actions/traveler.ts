"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { publicCabinWhere } from "@/lib/catalog";
import { requireUser } from "@/lib/auth";
import { cancelBooking, createBooking } from "@/lib/booking";
import { notifyAdministrators } from "@/lib/admin-events";
import type { ActionState } from "./auth";
import {
  InputError,
  fail,
  id,
  localeFrom,
  text,
  email,
  phone,
  numberField,
} from "@/lib/validation";

const errorState = (error: unknown): ActionState => ({
  code: error instanceof InputError ? error.code : "serverError",
});
export async function favoriteAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(
      locale,
      String(form.get("next") || `/${locale}/account?tab=favorites`),
    );
  try {
    const cabinId = id(form.get("cabinId"));
    const cabin = await db.cabin.findFirst({
      where: publicCabinWhere({ id: cabinId }),
      select: { id: true },
    });
    if (!cabin) fail("cabinUnavailable");
    // Desired state is idempotent under retries and simultaneous tabs.
    if (form.get("active") === "1")
      await db.favorite.upsert({
        where: { userId_cabinId: { userId: user.id, cabinId } },
        create: { userId: user.id, cabinId },
        update: {},
      });
    else await db.favorite.deleteMany({ where: { userId: user.id, cabinId } });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function bookingAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale, `/${locale}/booking`);
  let bookingId: string;
  try {
    const requestKey = text(form, "requestKey", 36, 36);
    if (!/^[a-f0-9-]{36}$/.test(requestKey)) fail("invalidFields");
    const booking = await createBooking({
      userId: user.id,
      cabinId: id(form.get("cabinId")),
      checkIn: text(form, "checkIn", 10, 10),
      checkOut: text(form, "checkOut", 10, 10),
      guests: numberField(form, "guests", 1, 50),
      guestName: text(form, "guestName", 1, 200),
      guestPhone: phone(text(form, "guestPhone", 7, 30)),
      guestEmail: email(text(form, "guestEmail", 1, 255)),
      requestKey,
      promoCode: typeof form.get("promoCode") === "string" ? text(form, "promoCode", 0, 40) : "",
    });
    bookingId = booking.id.toString();
  } catch (error) {
    return errorState(error);
  }
  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}/bookings/${bookingId}`);
}
export async function cancellationAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await cancelBooking(user.id, id(form.get("bookingId")), text(form, "reason", 3, 1000));
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function notificationAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await db.notification.updateMany({
      where: { id: id(form.get("notificationId")), userId: user.id },
      data: { isRead: true },
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function reviewAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    const bookingId = id(form.get("bookingId"));
    const booking = await db.booking.findFirst({
      where: { id: bookingId, userId: user.id, status: "COMPLETED", checkOut: { lte: new Date() }, cabin: { isDemo: false }, NOT: { bookingNumber: { startsWith: "DEMO-" } } },
      include: { review: true },
    });
    if (!booking || booking.review) fail("reviewUnavailable");
    await db.$transaction(async tx => {
    const review = await tx.review.create({
      data: {
        userId: user.id,
        cabinId: booking.cabinId,
        bookingId,
        rating: numberField(form, "rating", 1, 5),
        text: text(form, "review", 10, 5000),
        status: "PENDING",
      },
    });
    await notifyAdministrators(tx, "review.created", booking.bookingNumber, bookingId);
    await tx.auditLog.create({ data: { userId: user.id, action: "review.created", entityType: "review", entityId: review.id } });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
