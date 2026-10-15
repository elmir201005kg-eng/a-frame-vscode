import "server-only";
import type landing from "./locales/ru/landing.json";
import type { Locale } from "./config";

export type LandingDictionary = typeof landing;

const dictionaries: Record<Locale, () => Promise<LandingDictionary>> = {
  kg: () => import("./locales/kg/landing.json").then((module) => module.default),
  ru: () => import("./locales/ru/landing.json").then((module) => module.default),
  en: () => import("./locales/en/landing.json").then((module) => module.default),
};

export function getLandingDictionary(locale: Locale) {
  return dictionaries[locale]();
}
