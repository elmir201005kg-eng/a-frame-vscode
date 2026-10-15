import "server-only";
import type notFound from "./locales/ru/not-found.json";
import type { Locale } from "./config";

export type NotFoundDictionary = typeof notFound;

const dictionaries: Record<Locale, () => Promise<NotFoundDictionary>> = {
  kg: () => import("./locales/kg/not-found.json").then((module) => module.default),
  ru: () => import("./locales/ru/not-found.json").then((module) => module.default),
  en: () => import("./locales/en/not-found.json").then((module) => module.default),
};

export function getNotFoundDictionary(locale: Locale) {
  return dictionaries[locale]();
}
