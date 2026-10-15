"use client";
import { useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import { NavigationForm, useNavigationPending } from "@/components/navigation-form";
import { PremiumSelect } from "@/components/premium-select";
import { PremiumDateInput } from "@/components/premium-date-picker";
import { PremiumInput } from "@/components/premium-fields";
import type { AdminDictionary } from "@/app/i18n/admin";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";

function Submit({ label, search = false }: { label: string; search?: boolean }) {
  const pending = useNavigationPending();
  return <button type="submit" className="admin-button" disabled={pending} aria-busy={pending}>{pending ? <span className="ui-spinner" /> : search ? <Search size={16} /> : null}{label}</button>;
}
export function DashboardPeriod({ locale, text, value, start, end, today }: { locale: Locale; text: AdminDictionary["dashboard"]; value: string; start: string; end: string; today: string }) {
  const [period, setPeriod] = useState(value);
  return <NavigationForm action={`/${locale}/admin`} className="admin-period-form" scroll={false}>
    <div className="admin-period-select"><CalendarDays size={16} /><PremiumSelect aria-label={text.period} name="period" value={period} onValueChange={setPeriod} options={[{ value: "1", label: text.today }, { value: "7", label: text.days7 }, { value: "30", label: text.days30 }, { value: "90", label: text.days90 }, { value: "365", label: text.year }, { value: "custom", label: text.custom }]} /></div>
    {period === "custom" && <div className="admin-custom-range"><PremiumDateInput label={text.from} name="from" defaultValue={start} min="1970-01-01" max={today} required /><span>—</span><PremiumDateInput label={text.to} name="to" defaultValue={end} min="1970-01-01" max={today} required /></div>}
    <Submit label={text.apply} />
  </NavigationForm>;
}
export function DashboardTableFilters({ locale, text, common, q, status, period, start, end }: { locale: Locale; text: AdminDictionary["dashboard"]; common: CommonDictionary; q: string; status: string; period: string; start: string; end: string }) {
  return <NavigationForm action={`/${locale}/admin`} className="admin-table-filters" scroll={false}>
    <input type="hidden" name="period" value={period} />{period === "custom" && <><input type="hidden" name="from" value={start} /><input type="hidden" name="to" value={end} /></>}
    <label className="admin-table-search"><Search size={17} /><PremiumInput name="q" type="search" aria-label={text.tableSearch} placeholder={text.tableSearch} defaultValue={q} maxLength={100} /></label>
    <PremiumSelect name="status" aria-label={text.status} defaultValue={status} options={[{ value: "", label: text.allStatuses }, ...["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"].map(value => ({ value, label: common.statuses[value as keyof typeof common.statuses] }))]} />
    <Submit label={text.search} search />
  </NavigationForm>;
}
