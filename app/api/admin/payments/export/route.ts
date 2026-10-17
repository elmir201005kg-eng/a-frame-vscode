import { getUser, throttle } from "@/lib/auth";
import { isAdminRole } from "@/lib/roles";
import { db } from "@/lib/db";
import { csvRow } from "@/lib/csv";
import { paymentFilters, adminDateFilter } from "@/lib/admin-filters";
import { isLocale } from "@/app/i18n/config";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import type { AdminDictionary } from "@/app/i18n/admin";
import { InputError } from "@/lib/validation";

export async function GET(request: Request) {
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" };
  const user = await getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401, headers });
  if (!isAdminRole(user.role)) return Response.json({ error: "forbidden" }, { status: 403, headers });
  try {
    await throttle(`admin-export:${user.id}`, 12);
    const params = new URL(request.url).searchParams, locale = params.get("locale") || "ru";
    if (!isLocale(locale)) return Response.json({ error: "invalidFields" }, { status: 400, headers });
    const query = Object.fromEntries(params), where = paymentFilters(query);
    if (adminDateFilter(query).invalid) return Response.json({ error: "invalidDates" }, { status: 400, headers });
    const [common, text, last] = await Promise.all([translated<CommonDictionary>(locale, "common"), translated<AdminDictionary>(locale, "admin"), db.payment.findFirst({ where, orderBy: { id: "desc" }, select: { id: true } })]);
    await db.auditLog.create({ data: { userId: user.id, action: "payment.exported", entityType: "payment", entityId: BigInt(0), newData: { status: params.get("status"), from: params.get("from"), to: params.get("to"), actorRole: user.role } } });
    const encoder = new TextEncoder();
    let cursor = BigInt(0), first = true, complete = false;
    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        if (complete) { controller.close(); return; }
        if (first) {
          first = false;
          controller.enqueue(encoder.encode("\uFEFF" + csvRow([text.manage.transaction, common.labels.name, common.labels.email, common.labels.bookingNumber, common.nav.cabins, common.labels.total, text.manage.currency, text.manage.date, text.manage.paidDate, common.labels.paymentMethod, text.manage.paymentStatus])));
          return;
        }
        if (!last) { complete = true; controller.close(); return; }
        try {
          const rows = await db.payment.findMany({ where: { AND: [where, { id: { gt: cursor, lte: last.id } }] }, orderBy: { id: "asc" }, take: 500,
            select: { id: true, transactionId: true, providerPaymentId: true, amount: true, currency: true, createdAt: true, paidAt: true, paymentMethod: true, status: true, user: { select: { firstName: true, email: true } }, booking: { select: { bookingNumber: true, cabin: { select: { title: true, titleKg: true, titleEn: true } } } } } });
          if (!rows.length) { complete = true; controller.close(); return; }
          cursor = rows[rows.length - 1].id;
          controller.enqueue(encoder.encode(rows.map(row => csvRow([row.transactionId || row.providerPaymentId || String(row.id), row.user.firstName, row.user.email, row.booking.bookingNumber, (locale === "kg" ? row.booking.cabin.titleKg : locale === "en" ? row.booking.cabin.titleEn : null) || row.booking.cabin.title, row.amount.toString(), row.currency, row.createdAt.toISOString(), row.paidAt?.toISOString(), row.paymentMethod, common.paymentStatuses[row.status]])).join("")));
        } catch (error) { controller.error(error); }
      },
    });
    return new Response(stream, { headers: { ...headers, "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="a-frame-payments.csv"' } });
  } catch (error) {
    return Response.json({ error: error instanceof InputError ? error.code : "serverError" }, { status: error instanceof InputError ? 429 : 503, headers });
  }
}
