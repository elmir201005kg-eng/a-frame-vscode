"use server";
import { redirect } from "@/server/navigation";
import { revalidatePath } from "@/server/cache";
import type { ActionState } from "./auth";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { lockCabin } from "@/lib/booking";
import { isDemoBooking } from "@/lib/demo";
import { localeFrom, id, text, numberField, stay, fail, InputError, phone } from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";
import { isAdminRole } from "@/lib/roles";

const errorState = (error: unknown): ActionState => ({
  code:
    error instanceof InputError
      ? error.code
      : typeof error === "object" && error !== null && "code" in error && error.code === "P2002"
        ? "slugExists"
        : "serverError",
});
function ownerId(user: Awaited<ReturnType<typeof requireUser>>) {
  if (user.role !== "OWNER" || !user.ownerProfile) fail("forbidden");
  return user.ownerProfile.id;
}
export async function cabinAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale, `/${locale}/owner`);
  let resultId: string;
  try {
    const admin = isAdminRole(user.role);
    const owner = admin ? id(form.get("ownerId")) : ownerId(user),
      cabinId = form.get("cabinId") ? id(form.get("cabinId")) : null;
    const title = text(form, "title", 3, 255),
      description = text(form, "description", 30, 10000),
      slug = text(form, "slug", 2, 100);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("invalidFields");
    const regionId = numberField(form, "regionId", 1, 2147483647);
    if (!(await db.region.findFirst({ where: { id: regionId, isActive: true } })))
      fail("invalidFields");
    const checkInTime = text(form, "checkInTime", 5, 5),
      checkOutTime = text(form, "checkOutTime", 5, 5);
    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(checkInTime) ||
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(checkOutTime)
    )
      fail("invalidFields");
    const selectedAmenities = form.getAll("amenities").map((value) => Number(value));
    if (selectedAmenities.some((value) => !Number.isInteger(value) || value < 1))
      fail("invalidFields");
    const uniqueAmenities = [...new Set(selectedAmenities)];
    if (
      (await db.amenity.count({ where: { id: { in: uniqueAmenities }, isActive: true } })) !==
      uniqueAmenities.length
    )
      fail("invalidFields");
    const rules = text(form, "rules", 0, 5000)
      .split("\n")
      .map((value) => value.trim())
      .filter(Boolean)
      .slice(0, 20);
    if (rules.some((value) => value.length > 255)) fail("invalidFields");
    const data = {
      title,
      description,
      slug,
      titleKg: text(form, "titleKg", 0, 255) || null,
      titleEn: text(form, "titleEn", 0, 255) || null,
      descriptionKg: text(form, "descriptionKg", 0, 10000) || null,
      descriptionEn: text(form, "descriptionEn", 0, 10000) || null,
      pricePerNight: new Prisma.Decimal(numberField(form, "price", 1, 1000000, false).toFixed(2)),
      maxGuests: numberField(form, "maxGuests", 1, 50),
      bedrooms: numberField(form, "bedrooms", 0, 30),
      beds: numberField(form, "beds", 1, 50),
      bathrooms: numberField(form, "bathrooms", 0, 20),
      checkInTime,
      checkOutTime,
      cancellationHours: numberField(form, "cancellationHours", 0, 720),
      isDemo: form.get("isDemo") === "on",
    };
    const address = text(form, "address", 3, 1000),
      city = text(form, "city", 0, 150) || null,
      village = text(form, "village", 0, 150) || null;
    const coordinates = admin ? {
      latitude: form.get("latitude") ? numberField(form, "latitude", -90, 90, false) : null,
      longitude: form.get("longitude") ? numberField(form, "longitude", -180, 180, false) : null,
    } : {};
    const categories = admin ? [...new Set(form.getAll("categories").map(Number))] : [];
    if (categories.some(value => !Number.isSafeInteger(value) || value < 1)) fail("invalidFields");
    const cabin = await db.$transaction(
      async (tx) => {
        const active = await tx.user.findUnique({
          where: { id: user.id },
          select: { role: true, isActive: true },
        });
        if (!active?.isActive || (admin ? !isAdminRole(active.role) : active.role !== "OWNER")) fail("forbidden");
        const profile = await tx.ownerProfile.findFirst({ where: { id: owner, user: { role: "OWNER", isActive: true } } });
        if (!profile) fail("ownerUnverified");
        if (cabinId) await lockCabin(tx, cabinId);
        const existing = cabinId
          ? await tx.cabin.findFirst({
              where: { id: cabinId, ...(!admin ? { ownerId: owner } : {}) },
              select: { id: true, locationId: true, status: true, title: true, pricePerNight: true, maxGuests: true, ownerId: true },
            })
          : null;
        if (cabinId && !existing) fail("notFound");
        if (!admin && existing?.status === "BLOCKED") fail("forbidden");
        if (existing?.status === "PUBLISHED" && profile.verificationStatus !== "VERIFIED") fail("ownerUnverified");
        const sharedLocation = existing
          ? await tx.cabin.count({
              where: { locationId: existing.locationId, id: { not: existing.id } },
            })
          : 0;
        const location =
          existing && !sharedLocation
            ? await tx.location.update({
                where: { id: existing.locationId },
                data: { regionId, address, city, village, ...coordinates },
              })
            : await tx.location.create({ data: { regionId, address, city, village, ...coordinates } });
        const row = existing
          ? await tx.cabin.update({
              where: { id: existing.id },
              data: { ...data, ...(admin ? { ownerId: owner } : {}), locationId: location.id },
            })
          : await tx.cabin.create({
              data: { ...data, ownerId: owner, locationId: location.id, status: "DRAFT" },
            });
        await tx.cabinAmenity.deleteMany({ where: { cabinId: row.id } });
        if (uniqueAmenities.length)
          await tx.cabinAmenity.createMany({
            data: uniqueAmenities.map((amenityId) => ({ cabinId: row.id, amenityId })),
          });
        if (admin) {
          if ((await tx.category.count({ where: { id: { in: categories }, isActive: true } })) !== categories.length) fail("invalidFields");
          await tx.cabinCategory.deleteMany({ where: { cabinId: row.id } });
          if (categories.length) await tx.cabinCategory.createMany({ data: categories.map(categoryId => ({ cabinId: row.id, categoryId })) });
        }
        await tx.cabinRule.updateMany({ where: { cabinId: row.id }, data: { isActive: false } });
        if (rules.length)
          await tx.cabinRule.createMany({
            data: rules.map((title) => ({ cabinId: row.id, title })),
          });
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: existing ? "cabin.updated" : "cabin.created",
            entityType: "cabin",
            entityId: row.id,
            oldData: existing ? { title: existing.title, pricePerNight: existing.pricePerNight.toString(), maxGuests: existing.maxGuests, ownerId: existing.ownerId.toString() } : Prisma.JsonNull,
            newData: { title, slug, pricePerNight: data.pricePerNight.toString(), maxGuests: data.maxGuests, ownerId: owner.toString(), actorRole: user.role },
          },
        });
        return row;
      },
      { maxWait: 10000, timeout: 20000 },
    );
    resultId = cabin.id.toString();
  } catch (error) {
    return errorState(error);
  }
  revalidatePath("/", "layout");
  redirect(isAdminRole(user.role) ? `/${locale}/admin/cabins?edit=${resultId}` : `/${locale}/owner/cabins/${resultId}`);
}
export async function submitCabinAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    const owner = ownerId(user),
      cabinId = id(form.get("cabinId"));
    await db.$transaction(async (tx) => {
      await lockCabin(tx, cabinId);
      const cabin = await tx.cabin.findFirst({
        where: { id: cabinId, ownerId: owner },
        include: { images: true },
      });
      if (!cabin) fail("notFound");
      if (!["DRAFT", "ARCHIVED", "PENDING"].includes(cabin.status)) fail("invalidStatus");
      if (!cabin.images.length) fail("photosRequired");
      await tx.cabin.update({ where: { id: cabinId }, data: { status: "PENDING" } });
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: "cabin.submitted",
          entityType: "cabin",
          entityId: cabinId,
        },
      });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function archiveCabinAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    const owner = ownerId(user),
      cabinId = id(form.get("cabinId"));
    await db.$transaction(async (tx) => {
      await lockCabin(tx, cabinId);
      const row = await tx.cabin.findFirst({ where: { id: cabinId, ownerId: owner } });
      if (!row) fail("notFound");
      if (row.status === "BLOCKED") fail("forbidden");
      await tx.cabin.update({ where: { id: cabinId }, data: { status: "ARCHIVED" } });
      await tx.auditLog.create({
        data: { userId: user.id, action: "cabin.archived", entityType: "cabin", entityId: cabinId },
      });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function calendarAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    const owner = ownerId(user),
      cabinId = id(form.get("cabinId")),
      range = stay(text(form, "start", 10, 10), text(form, "end", 10, 10), 1);
    const mode = text(form, "mode", 1, 20);
    if (!["BLOCKED", "AVAILABLE", "clear"].includes(mode)) fail("invalidFields");
    const price = form.get("price")
      ? new Prisma.Decimal(numberField(form, "price", 1, 1000000, false).toFixed(2))
      : null;
    await db.$transaction(
      async (tx) => {
        await lockCabin(tx, cabinId);
        if (!(await tx.cabin.findFirst({ where: { id: cabinId, ownerId: owner } })))
          fail("notFound");
        if (
          await tx.booking.findFirst({
            where: {
              cabinId,
              status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
              checkIn: { lt: range.end },
              checkOut: { gt: range.start },
            },
          })
        )
          fail("datesUnavailable");
        await tx.cabinAvailability.deleteMany({
          where: { cabinId, date: { gte: range.start, lt: range.end } },
        });
        if (mode !== "clear")
          await tx.cabinAvailability.createMany({
            data: Array.from({ length: range.nights }, (_, index) => ({
              cabinId,
              date: new Date(range.start.getTime() + index * 86400000),
              status: mode as "BLOCKED" | "AVAILABLE",
              price,
            })),
          });
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: "calendar.updated",
            entityType: "cabin",
            entityId: cabinId,
            newData: {
              start: range.start.toISOString(),
              end: range.end.toISOString(),
              status: mode,
            },
          },
        });
      },
      { maxWait: 10000, timeout: 20000 },
    );
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function ownerBookingAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    const owner = ownerId(user),
      bookingId = id(form.get("bookingId")),
      status = text(form, "status", 1, 30);
    await db.$transaction(
      async (tx) => {
        const initial = await tx.booking.findFirst({
          where: { id: bookingId, cabin: { ownerId: owner } },
          select: { cabinId: true },
        });
        if (!initial) fail("notFound");
        await lockCabin(tx, initial.cabinId);
        const booking = await tx.booking.findFirst({
          where: { id: bookingId, cabin: { ownerId: owner } },
          include: { payments: true, cabin: { select: { isDemo: true } } },
        });
        if (!booking) fail("notFound");
        if (isDemoBooking(booking) && status !== "REJECTED") fail("demoConfirmationForbidden");
        if (!(
          (booking.status === "PENDING" && ["CONFIRMED", "REJECTED"].includes(status)) ||
          (booking.status === "CONFIRMED" &&
            status === "COMPLETED" &&
            booking.checkOut <= new Date())
        ))
          fail("invalidStatus");
        if (status === "REJECTED" && booking.payments.some((payment) => payment.status === "PAID"))
          fail("refundRequired");
        await tx.booking.update({
          where: { id: bookingId },
          data: { status: status as "CONFIRMED" | "REJECTED" | "COMPLETED" },
        });
        if (status === "REJECTED")
          await tx.payment.updateMany({
            where: { bookingId, status: "PENDING" },
            data: { status: "FAILED" },
          });
        const event = "booking." + status.toLowerCase();
        await tx.notification.create({
          data: {
            userId: booking.userId,
            type: event,
            title: event,
            message: booking.bookingNumber,
            bookingId,
          },
        });
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: event,
            entityType: "booking",
            entityId: bookingId,
            newData: { status },
          },
        });
      },
      { maxWait: 10000, timeout: 20000 },
    );
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function ownerProfileAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    const owner = ownerId(user);
    await db.ownerProfile.update({
      where: { id: owner },
      data: {
        businessName: text(form, "businessName", 0, 255) || null,
        description: text(form, "description", 0, 5000) || null,
        contactPhone: form.get("contactPhone") ? phone(text(form, "contactPhone", 7, 30)) : null,
      },
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function becomeOwnerAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    if (user.role !== "USER") fail("forbidden");
    await db.$transaction(async (tx) => {
      const changed = await tx.user.updateMany({
        where: { id: user.id, role: "USER", isActive: true },
        data: { role: "OWNER" },
      });
      if (changed.count !== 1) fail("forbidden");
      await tx.ownerProfile.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });
    });
  } catch (error) {
    return errorState(error);
  }
  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}/owner`);
}
