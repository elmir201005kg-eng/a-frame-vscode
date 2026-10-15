export const locales = ["kg", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";
export const localeCookie = "a-frame-kg-locale";

export const localeSettings = {
  kg: { htmlLang: "ky", intl: "ky-KG", openGraph: "ky_KG" },
  ru: { htmlLang: "ru", intl: "ru-RU", openGraph: "ru_RU" },
  en: { htmlLang: "en", intl: "en-US", openGraph: "en_US" },
} satisfies Record<Locale, { htmlLang: string; intl: string; openGraph: string }>;

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export function preferredLocale(acceptLanguage: string | null): Locale {
  const preferences = (acceptLanguage ?? "")
    .split(",")
    .map((entry) => {
      const [language, ...parameters] = entry.trim().split(";");
      const quality = parameters.find((parameter) => parameter.trim().startsWith("q="));
      return { language: language.toLowerCase().split("-")[0], quality: quality ? Number(quality.trim().slice(2)) : 1 };
    })
    .filter((entry) => Number.isFinite(entry.quality) && entry.quality > 0 && entry.quality <= 1)
    .sort((first, second) => second.quality - first.quality);

  for (const { language } of preferences) {
    if (language === "ky" || language === "kg") return "kg";
    if (isLocale(language)) return language;
  }

  return defaultLocale;
}
