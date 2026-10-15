import type { ReactNode } from "react";
import Link from "@/components/navigation-link";
import { Icon } from "@/components/icon";
import type { CommonDictionary, PageDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";
import { formatNumber, interpolate } from "@/app/i18n/format";

export { Field, SelectField, TextAreaField } from "@/components/premium-fields";
export function PageHeading({ text, children }: { text: PageDictionary; children?: ReactNode }) {
  return (
    <div className="product-page-heading">
      <div>
        {text.eyebrow && <p className="eyebrow">{text.eyebrow}</p>}
        <h1>{text.title}</h1>
        {text.description && <p>{text.description}</p>}
      </div>
      {children}
    </div>
  );
}
export function StatusBadge({
  status,
  common,
  kind = "booking",
  demo = false,
}: {
  status: string;
  common: CommonDictionary;
  kind?: "booking" | "payment";
  demo?: boolean;
}) {
  const labels = kind === "payment" ? common.paymentStatuses : common.statuses;
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      {demo && status === "PENDING" ? common.labels.demoBooking : labels[status as keyof typeof labels] || status}
    </span>
  );
}
export function EmptyState({
  common,
  children,
  title,
}: {
  common: CommonDictionary;
  children?: ReactNode;
  title?: string;
}) {
  return (
    <div className="product-empty">
      <Icon name="compass" size={34} />
      <h2>{title || common.labels.empty}</h2>
      {children}
    </div>
  );
}
export function Money({
  amount,
  locale,
  common,
}: {
  amount: number | string;
  locale: Locale;
  common: CommonDictionary;
}) {
  return (
    <>
      {formatNumber(Number(amount), locale)} {common.labels.currency}
    </>
  );
}
export function PageTabs({
  locale,
  base,
  items,
  active,
  common,
}: {
  locale: Locale;
  base: string;
  items: string[];
  active: string;
  common: CommonDictionary;
}) {
  return (
    <nav className="product-tabs" aria-label={common.nav.account}>
      {items.map((tab) => (
        <Link
          className={active === tab ? "is-active" : ""}
          key={tab}
          href={`/${locale}/${base}${tab === "dashboard" ? "" : "?tab=" + tab}`}
        >
          {common.nav[tab as keyof typeof common.nav]}
        </Link>
      ))}
    </nav>
  );
}
export function Pager({
  locale,
  path,
  params,
  page,
  pages,
  common,
}: {
  locale: Locale;
  path: string;
  params: Record<string, string | string[] | undefined>;
  page: number;
  pages: number;
  common: CommonDictionary;
}) {
  if (pages <= 1) return null;

  const href = (number: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (key === "page" || !value) continue;
      for (const entry of Array.isArray(value) ? value : [value]) query.append(key, entry);
    }
    query.set("page", String(number));
    return `/${locale}/${path}?${query}`;
  };
  return (
    <nav className="product-pagination" aria-label={common.labels.page}>
      {page > 1 ? (
        <Link className="button button-outline" href={href(page - 1)}>
          {common.labels.previous}
        </Link>
      ) : (
        <span />
      )}
      <span>{interpolate(common.labels.page, { page: String(page), pages: String(pages) })}</span>
      {page < pages ? (
        <Link className="button button-outline" href={href(page + 1)}>
          {common.labels.next}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
