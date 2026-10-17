"use server";
import { isAdminRole } from "@/lib/roles";
import { revalidatePath, updateTag } from "next/cache";
import { requireUser, throttle } from "@/lib/auth";
import { db } from "@/lib/db";
import { lockCabin } from "@/lib/booking";
import { isDemoBooking } from "@/lib/demo";
import { localeFrom, id, text, numberField, email, fail, InputError } from "@/lib/validation";
import { baseDictionary, leaf, namespaces, type Namespace } from "@/app/i18n/platform";
import { isLocale } from "@/app/i18n/config";
import type { ActionState } from "./auth";
import type { Prisma } from "@/generated/prisma/client";

const errorState = (error: unknown): ActionState => ({
  code:
    error instanceof InputError
      ? error.code
      : typeof error === "object" && error !== null && "code" in error && error.code === "P2002"
        ? "slugExists"
        : "serverError",
});
type Admin = Awaited<ReturnType<typeof requireUser>>;
async function check(user: Admin) {
  if (!isAdminRole(user.role)) fail("forbidden");
  await throttle(`admin-mutation:${user.id}`, 100);
}
async function audit(
  tx: Prisma.TransactionClient,
  user: Admin,
  action: string,
  entityType: string,
  entityId: bigint,
  data?: Prisma.InputJsonObject,
) {
  await tx.auditLog.create({
    data: { userId: user.id, action, entityType, entityId, newData: { ...data, actorRole: user.role } },
  });
}

export async function referenceAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const kind = text(form, "kind", 1, 20);
    if (!["region", "amenity"].includes(kind)) fail("invalidFields");
    const recordId = form.get("recordId") ? numberField(form, "recordId", 1, 2147483647) : null;
    const name = text(form, "name", 1, 100),
      nameKg = text(form, "nameKg", 0, 100) || null,
      nameEn = text(form, "nameEn", 0, 100) || null,
      slug = text(form, "slug", 1, 100);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail("invalidFields");
    const data = { name, nameKg, nameEn, slug, isActive: form.get("isActive") === "on" };
    await db.$transaction(async (tx) => {
      const row =
        kind === "region"
          ? recordId
            ? await tx.region.update({ where: { id: recordId }, data })
            : await tx.region.create({ data })
          : recordId
            ? await tx.amenity.update({ where: { id: recordId }, data })
            : await tx.amenity.create({ data });
      await audit(tx, user, "reference.saved", kind, BigInt(row.id));
    });
    updateTag("catalog-references");
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function userAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const userId = id(form.get("userId")),
      role = text(form, "role", 1, 11),
      isActive = form.get("isActive") === "on";
    if (role !== "USER" && role !== "OWNER" && !isAdminRole(role)) fail("invalidFields");
    if (form.get("confirm") !== "yes") fail("confirmationRequired");
    await db.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('a-frame-admin-users'))::text AS lock`;
      const actor = await tx.user.findUnique({ where: { id: user.id }, select: { role: true, isActive: true } });
      if (!actor?.isActive || !isAdminRole(actor.role) || actor.role !== user.role) fail("forbidden");
      const current = await tx.user.findUnique({
        where: { id: userId },
        include: { ownerProfile: true },
      });
      if (!current) fail("notFound");
      if (user.role !== "SUPER_ADMIN" && (isAdminRole(current.role) || isAdminRole(role))) fail("forbidden");
      if (isAdminRole(role) && !current.passwordHash) fail("adminPasswordRequired");
      if (
        isAdminRole(current.role) &&
        current.isActive &&
        (!isAdminRole(role) || !isActive) &&
        (await tx.user.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] }, isActive: true } })) <= 1
      )
        fail("lastAdmin");
      if (current.role === "SUPER_ADMIN" && current.isActive && (role !== "SUPER_ADMIN" || !isActive) &&
        (await tx.user.count({ where: { role: "SUPER_ADMIN", isActive: true } })) <= 1) fail("lastAdmin");
      if (current.role === "OWNER" && role !== "OWNER" && current.ownerProfile) {
        if (
          await tx.booking.count({
            where: {
              cabin: { ownerId: current.ownerProfile.id },
              status: { in: ["PENDING", "CONFIRMED"] },
            },
          })
        )
          fail("invalidStatus");
        await tx.cabin.updateMany({
          where: { ownerId: current.ownerProfile.id },
          data: { status: "ARCHIVED" },
        });
      }
      await tx.user.update({ where: { id: userId }, data: { role, isActive } });
      if (role === "OWNER")
        await tx.ownerProfile.upsert({ where: { userId }, create: { userId }, update: {} });
      if (!isActive || role !== current.role) {
        await tx.session.deleteMany({ where: { userId } });
        await tx.adminLoginChallenge.deleteMany({ where: { userId } });
      }
      await tx.auditLog.create({ data: { userId: user.id, action: "user.updated", entityType: "user", entityId: userId,
        oldData: { role: current.role, isActive: current.isActive }, newData: { role, isActive, actorRole: user.role } } });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function ownerAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const ownerId = id(form.get("ownerId")),
      status = text(form, "status", 1, 20);
    if (status !== "VERIFIED" && status !== "REJECTED" && status !== "PENDING")
      fail("invalidStatus");
    await db.$transaction(async (tx) => {
      const owner = await tx.ownerProfile.update({
        where: { id: ownerId },
        data: { verificationStatus: status },
      });
      await tx.notification.create({
        data: {
          userId: owner.userId,
          type: status === "VERIFIED" ? "owner.verified" : "owner.updated",
          title: "owner.updated",
          message: status,
        },
      });
      await audit(tx, user, "owner.updated", "owner", ownerId, { status });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function cabinAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const cabinId = id(form.get("cabinId")),
      status = text(form, "status", 1, 20);
    if (
      status !== "PUBLISHED" &&
      status !== "BLOCKED" &&
      status !== "ARCHIVED" &&
      status !== "DRAFT" &&
      status !== "PENDING"
    )
      fail("invalidStatus");
    await db.$transaction(async (tx) => {
      await lockCabin(tx, cabinId);
      const cabin = await tx.cabin.findUnique({
        where: { id: cabinId },
        include: {
          images: true,
          location: { include: { region: true } },
          owner: { include: { user: true } },
        },
      });
      if (!cabin) fail("notFound");
      if (status === "PUBLISHED") {
        if (
          cabin.owner.verificationStatus !== "VERIFIED" ||
          !cabin.owner.user.isActive ||
          cabin.owner.user.role !== "OWNER"
        )
          fail("ownerUnverified");
        if (!cabin.images.length) fail("photosRequired");
        if (!cabin.location.region.isActive || cabin.description.length < 30) fail("invalidFields");
      }
      await tx.cabin.update({ where: { id: cabinId }, data: { status } });
      await tx.notification.create({
        data: {
          userId: cabin.owner.userId,
          type: status === "PUBLISHED" ? "cabin.published" : "cabin.updated",
          title: "cabin.updated",
          message: cabin.title,
        },
      });
      await audit(tx, user, "cabin.moderated", "cabin", cabinId, { status });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function bookingAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const bookingId = id(form.get("bookingId")),
      status = text(form, "status", 1, 20);
    if (status !== "CONFIRMED" && status !== "REJECTED" && status !== "COMPLETED")
      fail("invalidStatus");
    await db.$transaction(async (tx) => {
      const original = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { cabinId: true },
      });
      if (!original) fail("notFound");
      await lockCabin(tx, original.cabinId);
      const booking = await tx.booking.findUniqueOrThrow({
        where: { id: bookingId },
        include: { payments: true, cabin: { select: { isDemo: true } } },
      });
      if (
        (status === "COMPLETED" &&
          (booking.status !== "CONFIRMED" || booking.checkOut > new Date())) ||
        (status !== "COMPLETED" && booking.status !== "PENDING")
      )
        fail("invalidStatus");
      if (isDemoBooking(booking) && status !== "REJECTED") fail("demoConfirmationForbidden");
      if (status === "CONFIRMED" && await tx.cabinAvailability.count({ where: { cabinId: booking.cabinId,
        date: { gte: booking.checkIn, lt: booking.checkOut }, status: { not: "AVAILABLE" } } })) fail("datesUnavailable");
      if (status === "REJECTED" && booking.payments.some((row) => row.status === "PAID"))
        fail("refundRequired");
      await tx.booking.update({ where: { id: bookingId }, data: { status } });
      if (status === "REJECTED")
        await tx.payment.updateMany({
          where: { bookingId, status: "PENDING" },
          data: { status: "FAILED" },
        });
      const type = "booking." + status.toLowerCase();
      await tx.notification.create({
        data: {
          userId: booking.userId,
          type,
          title: type,
          message: booking.bookingNumber,
          bookingId,
        },
      });
      await audit(tx, user, type, "booking", bookingId, { status });
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function reviewAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const reviewId = id(form.get("reviewId")),
      status = text(form, "status", 1, 20);
    if (status !== "PUBLISHED" && status !== "HIDDEN" && status !== "PENDING")
      fail("invalidStatus");
    await db.$transaction(async (tx) => {
      const review = await tx.review.findUnique({ where: { id: reviewId } });
      if (!review) fail("notFound");
      await lockCabin(tx, review.cabinId);
      await tx.review.update({ where: { id: reviewId }, data: { status } });
      const stats = await tx.review.aggregate({
        where: { cabinId: review.cabinId, status: "PUBLISHED" },
        _count: true,
        _avg: { rating: true },
      });
      await tx.cabin.update({
        where: { id: review.cabinId },
        data: { reviewsCount: stats._count, rating: stats._avg.rating || 0 },
      });
      await audit(tx, user, "review.moderated", "review", reviewId, { status });
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function translationAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const language = text(form, "language", 2, 2),
      namespace = text(form, "namespace", 1, 100),
      key = text(form, "key", 1, 255);
    if (!isLocale(language) || !namespaces.includes(namespace as Namespace))
      fail("invalidTranslation");
    const original = leaf(await baseDictionary(language, namespace as Namespace), key);
    if (typeof original !== "string") fail("invalidTranslation");
    await db.$transaction(async (tx) => {
      if (form.get("remove") === "yes")
        await tx.translation.deleteMany({ where: { locale: language, namespace, key } });
      else {
        const value = text(form, "value", 1, 10000),
          tokens = (source: string) =>
            [...source.matchAll(/\{([a-zA-Z0-9_]+)\}/g)]
              .map((match) => match[1])
              .sort()
              .join(",");
        if (tokens(original) !== tokens(value)) fail("invalidTranslation");
        await tx.translation.upsert({
          where: { locale_namespace_key: { locale: language, namespace, key } },
          create: { locale: language, namespace, key, value },
          update: { value },
        });
      }
      await audit(tx, user, "translation.saved", "translation", BigInt(0), {
        locale: language,
        namespace,
        key,
      });
    });
    updateTag(`translations:${language}`);
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function settingsAdminAction(_: ActionState, form: FormData): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const support = text(form, "supportEmail", 0, 255),
      supportEmail = support ? email(support) : "",
      bookingsEnabled = form.get("bookingsEnabled") === "on";
    const supportPhone = text(form, "supportPhone", 0, 30), address = text(form, "address", 0, 500);
    if (supportPhone && !/^\+?[\d\s()-]{7,30}$/.test(supportPhone)) fail("invalidPhone");
    const adminNotifications = form.get("adminNotifications") === "on";
    await db.$transaction(async (tx) => {
      for (const [key, value] of Object.entries({ supportEmail, supportPhone, address, bookingsEnabled, adminNotifications }))
        await tx.siteSetting.upsert({ where: { key }, create: { key, value }, update: { value } });
      await audit(tx, user, "settings.saved", "settings", BigInt(0), {
        supportEmail,
        bookingsEnabled,
        supportPhone, address, adminNotifications,
      });
    });
    updateTag("public-settings");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
export async function notificationAdminAction(
  _: ActionState,
  form: FormData,
): Promise<ActionState> {
  const locale = localeFrom(form),
    user = await requireUser(locale);
  try {
    await check(user);
    const userId = id(form.get("userId")),
      title = text(form, "title", 1, 255),
      message = text(form, "message", 1, 5000);
    await db.$transaction(async (tx) => {
      if (
        !(await tx.user.findFirst({ where: { id: userId, isActive: true }, select: { id: true } }))
      )
        fail("notFound");
      const notification = await tx.notification.create({
        data: { userId, type: "admin.message", title, message },
      });
      await audit(tx, user, "notification.sent", "notification", notification.id);
    });
    revalidatePath(`/${locale}`, "layout");
    return { success: true };
  } catch (error) {
    return errorState(error);
  }
}
