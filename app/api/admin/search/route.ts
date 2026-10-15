import { isAdminRole } from "@/lib/roles";
import { getUser, throttle } from "@/lib/auth";
import { db } from "@/lib/db";
import { InputError } from "@/lib/validation";
import { isLocale } from "@/app/i18n/config";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  const user = await getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401, headers });
  if (!isAdminRole(user.role)) return Response.json({ error: "forbidden" }, { status: 403, headers });
  const params = new URL(request.url).searchParams, q = params.get("q")?.trim() ?? "", locale = params.get("locale");
  if (!isLocale(locale ?? "") || q.length < 2 || q.length > 100)
    return Response.json({ error: "invalidFields" }, { status: 400, headers });
  try {
    await throttle(`admin-search:${user.id}`, 120);
    const [cabins, bookings, users] = await Promise.all([
      db.cabin.findMany({ where: { OR: ["title", "titleKg", "titleEn"].map(key => ({ [key]: { contains: q, mode: "insensitive" } })) }, take: 5, orderBy: { id: "desc" }, select: { id: true, title: true, titleKg: true, titleEn: true } }),
      db.booking.findMany({ where: { OR: [{ bookingNumber: { contains: q, mode: "insensitive" } }, { guestName: { contains: q, mode: "insensitive" } }] }, take: 5, orderBy: { id: "desc" }, select: { id: true, bookingNumber: true } }),
      db.user.findMany({ where: { OR: [{ firstName: { contains: q, mode: "insensitive" } }, { lastName: { contains: q, mode: "insensitive" } }] }, take: 5, orderBy: { id: "desc" }, select: { id: true, firstName: true, lastName: true } }),
    ]);
    return Response.json({ results: [
      ...cabins.map(row => ({ id: `c-${row.id}`, type: "cabins", title: (locale === "kg" ? row.titleKg : locale === "en" ? row.titleEn : null) || row.title, href: `/${locale}/admin/cabins?q=${encodeURIComponent(row.title)}` })),
      ...bookings.map(row => ({ id: `b-${row.id}`, type: "bookings", title: row.bookingNumber, href: `/${locale}/bookings/${row.id}` })),
      ...users.map(row => ({ id: `u-${row.id}`, type: "users", title: [row.firstName, row.lastName].filter(Boolean).join(" "), href: `/${locale}/admin/users?q=${encodeURIComponent(row.firstName)}` })),
    ] }, { headers });
  } catch (error) {
    return Response.json({ error: error instanceof InputError ? error.code : "serverError" }, { status: error instanceof InputError && error.code === "tooManyAttempts" ? 429 : 503, headers });
  }
}
