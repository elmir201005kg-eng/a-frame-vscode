"use server";
import { redirect, redirectExternal } from "@/server/navigation";
import { revalidatePath } from "@/server/cache";
import { headers } from "@/server/context";
import { db } from "@/lib/db";
import { publicCabinWhere } from "@/lib/catalog";
import { requireUser } from "@/lib/auth";
import { cancelBooking, createBooking } from "@/lib/booking";
import { notifyAdministrators } from "@/lib/admin-events";
import { finikConfiguration, finikRequestUrl } from "@/lib/finik";
import { startFinikPayment } from "@/lib/finik-payments";
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

async function checkoutRequestUrl() {
  const incoming = await headers();
  let requestUrl: string | null = null;
  try {
    requestUrl = finikRequestUrl(new Request(new URL("/api/finik/create-payment", incoming.get("origin") || ""), { headers: incoming }));
  } catch { /* Invalid origins are rejected below. */ }
  if (!requestUrl) fail("forbidden");
  // Check before saving a demo request so missing configuration does not reserve dates.
  try { finikConfiguration(requestUrl); }
  catch { fail("paymentProviderUnavailable"); }
  return requestUrl;
}

export async function demoBookingAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form);
  const stayQuery = new URLSearchParams();
  for (const key of ["checkIn", "checkOut", "guests"])
    stayQuery.set(key, String(form.get(key) || ""));
  const user = await requireUser(locale, `/${locale}/cabins/${encodeURIComponent(String(form.get("slug") || ""))}?${stayQuery}`);
  let destination: string;
  let savedBookingId: bigint | null = null;
  try {
    const cabinId = id(form.get("cabinId"));
    const requestKey = text(form, "requestKey", 36, 36);
    if (!/^[a-f0-9-]{36}$/.test(requestKey)) fail("invalidFields");
    const cabin = await db.cabin.findFirst({ where: publicCabinWhere({ id: cabinId, isDemo: true }), select: { id: true } });
    if (!cabin) fail("cabinUnavailable");
    const requestUrl = await checkoutRequestUrl();
    const booking = await createBooking({
      userId: user.id,
      cabinId,
      checkIn: text(form, "checkIn", 10, 10),
      checkOut: text(form, "checkOut", 10, 10),
      guests: numberField(form, "guests", 1, 50),
      guestName: [user.firstName, user.lastName].filter(Boolean).join(" "),
      guestPhone: user.phone || "",
      guestEmail: user.email,
      requestKey,
    });
    savedBookingId = booking.id;
    destination = await startFinikPayment({ userId: user.id, bookingId: booking.id, locale, requestUrl });
  } catch (error) {
    if (savedBookingId === null) return errorState(error);
    destination = `/${locale}/bookings/${savedBookingId}?payment=failed`;
  }
  revalidatePath(`/${locale}`, "layout");
  if (destination.startsWith("https://")) redirectExternal(destination);
  redirect(destination);
}

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
  let destination: string;
  let savedBookingId: bigint | null = null;
  try {
    const requestKey = text(form, "requestKey", 36, 36);
    if (!/^[a-f0-9-]{36}$/.test(requestKey)) fail("invalidFields");
    const cabinId = id(form.get("cabinId"));
    const cabin = await db.cabin.findFirst({ where: publicCabinWhere({ id: cabinId }), select: { isDemo: true } });
    if (!cabin) fail("cabinUnavailable");
    const requestUrl = cabin.isDemo ? await checkoutRequestUrl() : null;
    const booking = await createBooking({
      userId: user.id,
      cabinId,
      checkIn: text(form, "checkIn", 10, 10),
      checkOut: text(form, "checkOut", 10, 10),
      guests: numberField(form, "guests", 1, 50),
      guestName: text(form, "guestName", 1, 200),
      guestPhone: phone(text(form, "guestPhone", 7, 30)),
      guestEmail: email(text(form, "guestEmail", 1, 255)),
      requestKey,
      promoCode: typeof form.get("promoCode") === "string" ? text(form, "promoCode", 0, 40) : "",
    });
    destination = `/${locale}/bookings/${booking.id}`;
    if (requestUrl) {
      savedBookingId = booking.id;
      destination = await startFinikPayment({ userId: user.id, bookingId: booking.id, locale, requestUrl });
    }
  } catch (error) {
    if (savedBookingId === null) return errorState(error);
    destination = `/${locale}/bookings/${savedBookingId}?payment=failed`;
  }
  revalidatePath(`/${locale}`, "layout");
  if (destination.startsWith("https://")) redirectExternal(destination);
  redirect(destination);
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
