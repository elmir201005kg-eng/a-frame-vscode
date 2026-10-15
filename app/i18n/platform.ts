import "server-only";
import { cache } from "react";
import { cacheLife, cacheTag } from "next/cache";
import type common from "./locales/ru/common.json";
import type page from "./locales/ru/catalog.json";
import type { Locale } from "./config";
import { db } from "@/lib/db";
import { isDatabaseUnavailable } from "@/lib/db-errors";

export type CommonDictionary = typeof common;
export type PageDictionary = typeof page;
export const namespaces = [
  "common",
  "landing",
  "catalog",
  "cabin",
  "booking",
  "login",
  "admin-login",
  "register",
  "account",
  "booking-details",
  "owner",
  "owner-cabin",
  "admin",
  "privacy",
  "terms",
] as const;
export type Namespace = (typeof namespaces)[number];
async function localeOverrides(locale: Locale) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  cacheTag("translations", `translations:${locale}`);
  return db.translation.findMany({ where: { locale }, select: { namespace: true, key: true, value: true } });
}
const overridesFor = cache(async (locale: Locale) => {
  try {
    return await localeOverrides(locale);
  } catch (error) {
    // Database overrides are optional; the versioned JSON dictionaries remain usable.
    // Schema, validation and programming errors must still reach the error boundary.
    if (!isDatabaseUnavailable(error)) throw error;
    console.warn(`[i18n] Database overrides unavailable (${error.code}); using ${locale} JSON dictionaries. Check database connectivity.`);
    return [];
  }
});
export async function baseDictionary(
  locale: Locale,
  namespace: Namespace,
): Promise<Record<string, unknown>> {
  return (await import(`./locales/${locale}/${namespace}.json`)).default;
}
export function leaf(object: Record<string, unknown>, key: string): unknown {
  if (key.split(".").some((part) => ["__proto__", "prototype", "constructor"].includes(part)))
    return undefined;
  return key
    .split(".")
    .reduce<unknown>(
      (value, part) =>
        value && typeof value === "object" ? (value as Record<string, unknown>)[part] : undefined,
      object,
    );
}
export async function translated<T>(locale: Locale, namespace: Namespace): Promise<T> {
  const [source, overrides] = await Promise.all([baseDictionary(locale, namespace), overridesFor(locale)]);
  const base = structuredClone(source);
  for (const override of overrides) {
    if (override.namespace !== namespace) continue;
    if (typeof leaf(base, override.key) !== "string") continue;
    const parts = override.key.split(".");
    const parent = parts
      .slice(0, -1)
      .reduce<Record<string, unknown>>(
        (value, part) => value[part] as Record<string, unknown>,
        base,
      );
    parent[parts[parts.length - 1]] = override.value;
  }
  return base as T;
}
export async function pageDictionaries(
  locale: Locale,
  page: Exclude<Namespace, "common" | "landing">,
) {
  const [common, text] = await Promise.all([
    translated<CommonDictionary>(locale, "common"),
    translated<PageDictionary>(locale, page),
  ]);
  return { common, text };
}
