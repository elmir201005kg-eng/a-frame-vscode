import { locale as getLocale } from "next/root-params";
import { Brand } from "@/components/brand";
import Link from "@/components/navigation-link";
import { Icon } from "@/components/icon";
import { LanguageSwitcher } from "@/components/language-switcher";
import { defaultLocale, isLocale } from "@/app/i18n/config";
import { getNotFoundDictionary } from "@/app/i18n/not-found";

export default async function NotFound() {
  const routeLocale = await getLocale();
  const locale = isLocale(routeLocale) ? routeLocale : defaultLocale;
  const dictionary = await getNotFoundDictionary(locale);

  return (
    <div className="not-found-page section-shell">
      <header className="not-found-header"><Brand href={`/${locale}`} label={dictionary.brandHome} /><LanguageSwitcher locale={locale} labels={dictionary.language} reloadDocument /></header>
      <main className="not-found-content" aria-labelledby="not-found-title">
        <Icon name="compass" size={42} aria-hidden="true" />
        <p className="not-found-code" aria-hidden="true">{dictionary.code}</p>
        <p className="eyebrow">{dictionary.eyebrow}</p>
        <h1 id="not-found-title">{dictionary.title}</h1>
        <p className="not-found-description">{dictionary.description}</p>
        <div className="not-found-actions"><Link className="button button-primary" href={`/${locale}`}>{dictionary.homeAction}<Icon name="arrow-right" size={18} /></Link></div>
      </main>
    </div>
  );
}
