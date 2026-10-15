import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import Link from "@/components/navigation-link";
import { db } from "@/lib/db";
import { adminPage } from "@/lib/admin-period";
import { queryString } from "@/lib/admin-filters";
import { addDays, bishkekToday, isDateOnly } from "@/lib/stay-dates";
import { calendarAdminAction } from "@/app/actions/admin-workspace";
import { AdminActionForm } from "@/components/admin-action-form";
import { Field, SelectField, TextAreaField } from "@/components/product-ui";
import { AdminPageHeading, AdminPagination, hidden, localizedTitle, type AdminContext } from "@/components/admin-workspace-ui";
import { NavigationForm } from "@/components/navigation-form";
import type { Prisma } from "@/generated/prisma/client";

export async function AdminCalendar({ ctx }: { ctx: AdminContext }) {
  const { locale, common, query, text: { manage: t } } = ctx, today = bishkekToday(), requestedMonth = queryString(query, "month");
  const month = isDateOnly(`${requestedMonth}-01`) && requestedMonth >= "1970-01" && requestedMonth <= "2200-12" ? requestedMonth : today.slice(0, 7);
  const start = new Date(`${month}-01T00:00:00Z`), end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
  const previous = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 1, 1)).toISOString().slice(0, 7), next = end.toISOString().slice(0, 7);
  const cabinId = queryString(query, "cabinId"), q = queryString(query, "q");
  const selected = /^[1-9]\d{0,17}$/.test(cabinId) ? BigInt(cabinId) : undefined;
  const where: Prisma.CabinWhereInput = { ...(selected ? { id: selected } : {}), ...(q ? { title: { contains: q, mode: "insensitive" } } : {}) };
  const count = await db.cabin.count({ where }), page = Math.min(adminPage(query), Math.max(1, Math.ceil(count / 20)));
  const cabins = await db.cabin.findMany({ where, take: 20, skip: (page - 1) * 20, orderBy: { id: "asc" }, select: { id: true, title: true, titleKg: true, titleEn: true,
    availability: { where: { date: { gte: start, lt: end } }, select: { date: true, status: true, note: true } },
    bookings: { where: { checkIn: { lt: end }, checkOut: { gt: start }, status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] } }, select: { bookingNumber: true, checkIn: true, checkOut: true } },
  } });
  const days = Array.from({ length: Math.round((end.getTime() - start.getTime()) / 86400000) }, (_, i) => addDays(`${month}-01`, i));
  const monthUrl = (value: string) => `/${locale}/admin/calendar?${new URLSearchParams({ month: value, ...(selected ? { cabinId } : {}), ...(q ? { q } : {}) })}`;
  const initial = queryString(query, "start"), editStart = isDateOnly(initial) && initial >= today ? initial : today;
  return <><AdminPageHeading ctx={ctx} section="calendar" />
    <NavigationForm action={`/${locale}/admin/calendar`} className="admin-filters"><Field name="q" label={t.search} defaultValue={q} maxLength={150} /><Field name="month" label={t.month} type="month" defaultValue={month} min="1970-01" max="2200-12" required /><button type="submit" className="admin-button admin-button-gold">{t.filters}</button><Link href={`/${locale}/admin/calendar`} className="admin-button">{t.reset}</Link></NavigationForm>
    <section className="admin-panel admin-calendar-panel"><div className="admin-panel-heading"><h2><CalendarDays size={18} />{new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : locale === "ru" ? "ru-RU" : "en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(start)}</h2><div className="admin-inline-actions"><Link className="admin-button" href={monthUrl(previous)} aria-label={common.labels.previous}><ChevronLeft size={16} /></Link><Link className="admin-button" href={monthUrl(next)} aria-label={common.labels.next}><ChevronRight size={16} /></Link></div></div>
      <div className="admin-calendar-legend">{(["available", "booked", "blocked", "maintenance"] as const).map(key => <span key={key}><i data-state={key} />{t[key]}</span>)}</div>
      <div className="admin-table-scroll" role="region" tabIndex={0} aria-label={t.calendar}><table className="admin-calendar-table"><caption className="sr-only">{t.calendar}</caption><thead><tr><th scope="col">{common.nav.cabins}</th>{days.map(day => <th key={day} scope="col" data-today={day === today || undefined}>{Number(day.slice(8))}</th>)}</tr></thead><tbody>{cabins.map(cabin => <tr key={String(cabin.id)}><th scope="row"><Link href={`/${locale}/admin/cabins?edit=${cabin.id}`}>{localizedTitle(cabin, locale)}</Link></th>{days.map(day => {
        const booking = cabin.bookings.find(row => row.checkIn.toISOString().slice(0, 10) <= day && row.checkOut.toISOString().slice(0, 10) > day);
        const record = cabin.availability.find(row => row.date.toISOString().slice(0, 10) === day);
        const state = booking || record?.status === "BOOKED" ? "booked" : record?.status === "BLOCKED" ? record.note?.startsWith("maintenance:") ? "maintenance" : "blocked" : "available";
        return <td key={day} data-today={day === today || undefined}><Link data-state={state} title={`${day} · ${t[state]}${booking ? ` · ${booking.bookingNumber}` : record?.note ? ` · ${record.note.replace(/^maintenance:/, "")}` : ""}`} aria-label={`${localizedTitle(cabin, locale)}, ${day}: ${t[state]}`} href={booking ? `/${locale}/admin/bookings?q=${encodeURIComponent(booking.bookingNumber)}` : `/${locale}/admin/calendar?month=${month}&cabinId=${cabin.id}&start=${day}#calendar-editor`}><span className="sr-only">{t[state]}</span></Link></td>;
      })}</tr>)}</tbody></table></div>{!cabins.length && <p className="admin-table-empty">{common.labels.empty}</p>}
    </section><AdminPagination ctx={ctx} section="calendar" page={page} count={count} />
    {cabins.length > 0 && <section className="product-panel admin-calendar-editor" id="calendar-editor"><h2>{common.labels.availability}</h2><p className="form-hint">{t.calendarHint}</p><AdminActionForm key={`${selected}-${editStart}`} action={calendarAdminAction} locale={locale} common={common} text={t} confirm>
      <SelectField label={common.nav.cabins} name="cabinId" required defaultValue={selected?.toString()}>{cabins.map(cabin => <option key={String(cabin.id)} value={String(cabin.id)}>{localizedTitle(cabin, locale)}</option>)}</SelectField>
      <div className="form-grid-two"><Field name="start" label={t.start} type="date" min={today} required defaultValue={editStart} /><Field name="end" label={t.end} type="date" min={addDays(editStart, 1)} required defaultValue={addDays(editStart, 1)} /></div>
      <SelectField name="mode" label={common.labels.status}><option value="BLOCKED">{t.blocked}</option><option value="MAINTENANCE">{t.maintenance}</option><option value="AVAILABLE">{t.available}</option><option value="clear">{common.labels.resetCalendar}</option></SelectField><TextAreaField name="note" label={t.note} maxLength={500} />
    </AdminActionForm></section>}
  </>;
}
