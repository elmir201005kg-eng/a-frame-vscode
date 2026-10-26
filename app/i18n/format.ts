import { localeSettings } from "./config";
import type { Locale } from "./config";

const numberFormatters = new Map<string, Intl.NumberFormat>();
const pluralRules = new Map<Locale, Intl.PluralRules>();

export function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (placeholder, key: string) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : placeholder,
  );
}

export function formatNumber(value: number, locale: Locale, options?: Intl.NumberFormatOptions) {
  // Chrome lacks Kyrgyz number data. Use the same separators on the server and client.
  const numberLocale = locale === "kg" ? "ru-RU" : localeSettings[locale].intl;
  const key = `${numberLocale}:${JSON.stringify(options ?? {})}`;
  let formatter = numberFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(numberLocale, options);
    // Bound memory even if a new caller supplies many different option sets.
    if (numberFormatters.size >= 32) numberFormatters.clear();
    numberFormatters.set(key, formatter);
  }
  const formatted = formatter.format(value);
  return locale === "kg" ? formatted.replace(/[\u00a0\u202f]/g, " ") : formatted;
}

export function formatDate(
  value: string,
  locale: Locale,
  dictionary: { shortDate: string; months: readonly string[] },
) {
  const date = new Date(`${value}T12:00:00Z`);
  return interpolate(dictionary.shortDate, {
    day: formatNumber(date.getUTCDate(), locale),
    month: dictionary.months[date.getUTCMonth()],
  });
}

export function pluralize(
  count: number,
  locale: Locale,
  forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string },
) {
  let rules = pluralRules.get(locale);
  if (!rules) {
    rules = new Intl.PluralRules(localeSettings[locale].intl);
    pluralRules.set(locale, rules);
  }
  const rule = rules.select(count);
  return interpolate(forms[rule] ?? forms.other, { count: formatNumber(count, locale) });
}
