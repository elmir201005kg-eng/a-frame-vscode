"use client";

import { useTransition } from "react";
import { PremiumSelect } from "@/components/premium-select";
import { useRouter } from "@/client/router";
import { LanguageFlag } from "@/components/language-flag";
import { isLocale, localeCookie, locales } from "@/app/i18n/config";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";

const languageCodes: Record<Locale, string> = { kg: "KG", ru: "RU", en: "ENG" };

export function LanguageSwitcher({ locale, labels, reloadDocument = false }: { locale: Locale; labels: LandingDictionary["language"]; reloadDocument?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changeLanguage(nextLocale: string) {
    if (!isLocale(nextLocale) || nextLocale === locale) return;

    document.cookie = `${localeCookie}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
    const target = new URL(window.location.href);
    const segments = target.pathname.split("/");
    if (isLocale(segments[1])) segments[1] = nextLocale;
    else segments.splice(1, 0, nextLocale);
    target.pathname = segments.join("/");
    if (reloadDocument || !navigator.onLine || document.querySelector("[data-offline-page]")) {
      window.location.assign(target.href);
      return;
    }
    startTransition(() => router.push(`${target.pathname}${target.search}${target.hash}`, { scroll: false }));
  }

  return (
    <div className="language-switcher" aria-busy={pending}>
      <PremiumSelect aria-label={labels.label} value={locale} onValueChange={changeLanguage} loading={pending}
        title={`${languageCodes[locale]} — ${labels[locale]}`}
        displayValue={<span className="language-value"><LanguageFlag locale={locale} /><span className="language-code">{languageCodes[locale]}</span></span>}
        options={locales.map(language => ({
          value: language,
          label: labels[language],
          lang: language === "kg" ? "ky" : language,
          content: <span className="language-option"><LanguageFlag locale={language} /><span className="language-code" aria-hidden="true">{languageCodes[language]}</span><span><span aria-hidden="true">— </span>{labels[language]}</span></span>,
        }))} />
    </div>
  );
}
