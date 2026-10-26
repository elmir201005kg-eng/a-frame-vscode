import type { ReactNode } from "react";
import { Database, Inbox, Search } from "lucide-react";
import Link from "@/components/navigation-link";
import { NavigationForm } from "@/components/navigation-form";
import { Field, SelectField, Pager } from "@/components/product-ui";
import { queryString, adminDateFilter } from "@/lib/admin-filters";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { AdminDictionary } from "@/app/i18n/admin";
import type { AdminQuery } from "@/lib/admin-period";
import type { requireAdmin } from "@/lib/auth";

export type AdminContext = { locale: Locale; common: CommonDictionary; text: AdminDictionary; query: AdminQuery; user: Awaited<ReturnType<typeof requireAdmin>> };
export const hidden = (name: string, value: string | number | bigint) => <input type="hidden" name={name} value={String(value)} />;
export function AdminPageHeading({ ctx, section, children }: { ctx: AdminContext; section: keyof CommonDictionary["nav"] | "support"; children?: ReactNode }) {
  const title = section === "support" ? ctx.text.shell.support : ctx.common.nav[section];
  return <div className="admin-page-heading admin-section-heading"><div><p className="admin-eyebrow">A-FRAME KG · {ctx.text.manage.workspace}</p><h1>{title}</h1><p>{ctx.text.manage.manageDescription}</p></div>{children || <span className="admin-live-label"><Database size={12} />{ctx.text.dashboard.live}</span>}</div>;
}
export function AdminFilters({ ctx, section, statuses = [], dates = false, children }: { ctx: AdminContext; section: string; statuses?: string[]; dates?: boolean; children?: ReactNode }) {
  const { text: { manage: t }, common, query, locale } = ctx;
  return <>
    <NavigationForm action={`/${locale}/admin/${section}`} className="admin-filters">
      {section === "bookings" && /^[1-9]\d{0,17}$/.test(queryString(query, "userId")) && hidden("userId", queryString(query, "userId"))}
      {section === "bookings" && /^[1-9]\d{0,17}$/.test(queryString(query, "bookingId")) && hidden("bookingId", queryString(query, "bookingId"))}
      <div className="admin-filter-search"><Search size={17} /><Field label={t.search} name="q" type="search" maxLength={150} defaultValue={queryString(query, "q")} /></div>
      {statuses.length > 0 && <SelectField label={common.labels.status} name="status" defaultValue={queryString(query, "status")}><option value="">{t.all}</option>{statuses.map(value => <option key={value} value={value}>{(section === "payments" ? common.paymentStatuses[value as keyof typeof common.paymentStatuses] : common.statuses[value as keyof typeof common.statuses]) || value}</option>)}</SelectField>}
      {dates && <><Field label={t.periodFrom} type="date" name="from" min="1970-01-01" defaultValue={queryString(query, "from")} /><Field label={t.periodTo} type="date" name="to" min="1970-01-01" defaultValue={queryString(query, "to")} /></>}
      {children}
      <button type="submit" className="admin-button admin-button-gold">{t.filters}</button><Link className="admin-button" href={`/${locale}/admin/${section}`}>{t.reset}</Link>
    </NavigationForm>
    {dates && adminDateFilter(query).invalid && <p className="form-error" role="alert">{common.errors.invalidDates}</p>}
  </>;
}
export function AdminTable({ headings, children, empty, caption }: { headings: string[]; children: ReactNode; empty: boolean; caption: string }) {
  return <div className="admin-panel"><div className="admin-table-scroll" role="region" aria-label={caption} tabIndex={0}><table className="admin-data-table"><caption className="sr-only">{caption}</caption><thead><tr>{headings.map((value, index) => <th key={index} scope="col">{value}</th>)}</tr></thead><tbody>{children}</tbody></table></div>{empty && <div className="admin-table-empty"><Inbox size={28} /><p>{caption}</p></div>}</div>;
}
export function AdminPagination({ ctx, section, count, page, take = 20 }: { ctx: AdminContext; section: string; count: number; page: number; take?: number }) {
  return <div className="admin-pagination"><p>{count} {ctx.text.dashboard.records}</p><Pager locale={ctx.locale} path={`admin/${section}`} params={ctx.query} page={page} pages={Math.max(1, Math.ceil(count / take))} common={ctx.common} /></div>;
}
export function adminDate(value: Date, locale: Locale, dateOnly = false) {
  return new Intl.DateTimeFormat(locale === "kg" ? "ky-KG" : locale === "ru" ? "ru-RU" : "en-GB", { timeZone: dateOnly ? "UTC" : "Asia/Bishkek", day: "2-digit", month: "short", year: "numeric", ...(!dateOnly ? { hour: "2-digit", minute: "2-digit" } as const : {}) }).format(value);
}
export function localizedTitle(row: { title: string; titleKg?: string | null; titleEn?: string | null }, locale: Locale) {
  return (locale === "kg" ? row.titleKg : locale === "en" ? row.titleEn : null) || row.title;
}
