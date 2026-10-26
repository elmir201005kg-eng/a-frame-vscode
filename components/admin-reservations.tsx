import Link from "@/components/navigation-link";
import { Download } from "lucide-react";
import { db } from "@/lib/db";
import { adminPage } from "@/lib/admin-period";
import { bookingFilters, paymentFilters } from "@/lib/admin-filters";
import { bookingAdminAction } from "@/app/actions/admin";
import { cancelBookingAdminAction } from "@/app/actions/admin-workspace";
import { AdminActionForm } from "@/components/admin-action-form";
import { Field, SelectField, Money, StatusBadge } from "@/components/product-ui";
import { AdminPageHeading, AdminFilters, AdminTable, AdminPagination, adminDate, localizedTitle, hidden, type AdminContext } from "@/components/admin-workspace-ui";

export async function AdminReservations({ ctx, payments = false }: { ctx: AdminContext; payments?: boolean }) {
  const { locale, common, query, text: { manage: t } } = ctx, labels = common.labels;
  const where = bookingFilters(query), payWhere = paymentFilters(query), section = payments ? "payments" : "bookings";
  const count = payments ? await db.payment.count({ where: payWhere }) : await db.booking.count({ where });
  const page = Math.min(adminPage(query), Math.max(1, Math.ceil(count / 20))), skip = (page - 1) * 20;
  const exportParams = new URLSearchParams({ locale });
  for (const key of ["q", "status", "from", "to"]) if (typeof query[key] === "string") exportParams.set(key, query[key]);
  const formProps = { locale, common, text: t };
  const paymentRows = payments ? await db.payment.findMany({ where: payWhere, skip, take: 20, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    select: { id: true, transactionId: true, providerPaymentId: true, bookingId: true, amount: true, currency: true, createdAt: true, paidAt: true, paymentMethod: true, status: true, user: { select: { firstName: true, email: true } }, booking: { select: { bookingNumber: true, cabin: { select: { title: true, titleKg: true, titleEn: true } } } } } }) : [];
  const rows = !payments ? await db.booking.findMany({ where, skip, take: 20, orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    include: { cabin: { select: { title: true, titleKg: true, titleEn: true, isDemo: true } }, payments: { select: { status: true }, orderBy: { createdAt: "desc" } } } }) : [];
  const history = rows.length ? await db.auditLog.findMany({ where: { entityType: "booking", entityId: { in: rows.map(row => row.id) } }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 200, include: { user: { select: { firstName: true } } } }) : [];
  return <><AdminPageHeading ctx={ctx} section={section}>{payments && <a className="admin-button admin-button-gold" href={`/api/admin/payments/export?${exportParams}`}><Download size={16} />{t.export}</a>}</AdminPageHeading>
    {payments && <p className="product-notice">{t.revenueNote}</p>}
    <AdminFilters ctx={ctx} section={section} statuses={payments ? ["PENDING", "PAID", "FAILED", "REFUNDED"] : ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"]} dates>
      {!payments && <SelectField label={t.paymentStatus} name="payment" defaultValue={typeof query.payment === "string" ? query.payment : ""}><option value="">{t.all}</option>{["PENDING", "PAID", "FAILED", "REFUNDED"].map(value => <option key={value} value={value}>{common.paymentStatuses[value as keyof typeof common.paymentStatuses]}</option>)}</SelectField>}
    </AdminFilters>
    {payments ? <AdminTable headings={[t.transaction, labels.name, labels.bookingNumber, common.nav.cabins, labels.total, t.date, labels.paymentMethod, t.paymentStatus]} empty={!paymentRows.length} caption={labels.empty}>
        {paymentRows.map(row => <tr key={String(row.id)}><td className="admin-mono">{row.transactionId || row.providerPaymentId || `#${row.id}`}</td><td>{row.user.firstName}<small>{row.user.email}</small></td><td><Link href={`/${locale}/admin/bookings?q=${encodeURIComponent(row.booking.bookingNumber)}`}>{row.booking.bookingNumber}</Link></td><td>{localizedTitle(row.booking.cabin, locale)}</td><td>{String(row.amount)} {row.currency}</td><td>{adminDate(row.createdAt, locale)}{row.paidAt && <small>{t.paidDate}: {adminDate(row.paidAt, locale)}</small>}</td><td>{row.paymentMethod === "AWAITING_CONFIGURATION" ? labels.paymentAwaiting : row.paymentMethod}</td><td><StatusBadge status={row.status} kind="payment" common={common} /></td></tr>)}
    </AdminTable> : <AdminTable headings={[labels.bookingNumber, labels.name, common.nav.cabins, labels.checkIn, labels.guests, labels.total, labels.status, t.paymentStatus, t.actions]} empty={!rows.length} caption={labels.empty}>
      {rows.map(row => {
        const paid = row.payments.find(p => p.status === "REFUNDED") || row.payments.find(p => p.status === "PAID") || row.payments[0];
        const canCancel = ["PENDING", "CONFIRMED"].includes(row.status) && row.cancelUntil && row.cancelUntil > new Date() && !row.payments.some(p => p.status === "PAID");
        return <tr key={String(row.id)}><td><Link href={`/${locale}/admin/bookings?bookingId=${row.id.toString()}`}>{row.bookingNumber}</Link></td><td>{row.guestName}<small>{row.guestEmail}</small></td><td>{localizedTitle(row.cabin, locale)}</td><td>{adminDate(row.checkIn, locale, true)}<small>— {adminDate(row.checkOut, locale, true)}</small></td><td>{row.guestsCount}</td><td><Money amount={String(row.totalAmount)} locale={locale} common={common} /></td><td><StatusBadge status={row.status} common={common} demo={row.cabin.isDemo || row.bookingNumber.startsWith("DEMO-")} /></td><td>{paid ? <StatusBadge status={paid.status} common={common} kind="payment" /> : "—"}</td>
          <td><details className="admin-row-details"><summary>{t.details}</summary><div className="admin-row-actions"><p>{row.guestPhone}</p>{row.cancellationReason && <p>{labels.reason}: {row.cancellationReason}</p>}
            {!row.cabin.isDemo && !row.bookingNumber.startsWith("DEMO-") && (row.status === "PENDING" || (row.status === "CONFIRMED" && row.checkOut <= new Date())) && <AdminActionForm action={bookingAdminAction} {...formProps} confirm>{hidden("bookingId", row.id)}<SelectField label={labels.status} name="status">{(row.status === "PENDING" ? ["CONFIRMED", "REJECTED"] : ["COMPLETED"]).map(value => <option key={value} value={value}>{common.statuses[value as keyof typeof common.statuses]}</option>)}</SelectField></AdminActionForm>}
            {canCancel && <AdminActionForm action={cancelBookingAdminAction} {...formProps} confirm danger submitLabel={labels.cancel}>{hidden("bookingId", row.id)}<Field label={labels.reason} name="reason" minLength={3} maxLength={1000} required /></AdminActionForm>}
            <h3>{t.history}</h3>{history.filter(log => log.entityId === row.id).map(log => <p key={String(log.id)}>{common.events[log.action.replace(/\.([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof typeof common.events] || log.action}<small>{adminDate(log.createdAt, locale)} · {log.user?.firstName || "—"}</small></p>)}
            {!history.some(log => log.entityId === row.id) && <p>{t.noHistory}</p>}
          </div></details></td></tr>;
      })}
    </AdminTable>}
    <AdminPagination ctx={ctx} section={section} count={count} page={page} />
  </>;
}
