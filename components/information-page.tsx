import Link from "@/components/navigation-link";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import type information from "@/app/i18n/locales/ru/privacy.json";
import { PageHeading } from "@/components/product-ui";
import { Icon } from "@/components/icon";

export type InformationDictionary = typeof information;

export function InformationPage({
  locale,
  common,
  text,
  kind,
}: {
  locale: Locale;
  common: CommonDictionary;
  text: InformationDictionary;
  kind: "terms" | "privacy";
}) {
  const { ui } = text;
  const idPrefix = `information-${locale}-${kind}`;
  return (
    <article className="information-page">
      <Link className="information-back" href={`/${locale}`}>
        <Icon name="arrow-left" size={16} />{common.nav.home}
      </Link>
      <nav className="information-tabs" aria-label={ui.documents}>
        {(["terms", "privacy"] as const).map((document) => (
          <Link key={document} href={`/${locale}/${document}`} aria-current={kind === document ? "page" : undefined}>
            {ui[document]}
          </Link>
        ))}
      </nav>
      <PageHeading text={text}>
        <span className="information-emblem"><Icon name={kind === "privacy" ? "shield" : "home"} size={36} /></span>
      </PageHeading>
      <div className="information-layout">
        <aside className="information-sidebar">
          <nav className="information-contents" aria-labelledby={`${idPrefix}-contents-title`}>
            <h2 id={`${idPrefix}-contents-title`}>{ui.contents}</h2>
            <ol>
              {text.sections.map((section, index) => (
                <li key={section.title}>
                  <a href={`#${idPrefix}-section-${index + 1}`}>
                    <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="information-help">
            <Icon name="mail" size={22} />
            <h3>{ui.contactTitle}</h3>
            <p>{ui.contactDescription}</p>
            <a className="text-link" href="#site-contact">
              {ui.contactAction}<Icon name="arrow-up-right" size={16} />
            </a>
          </div>
        </aside>
        <div className="information-sections">
          {text.sections.map((section, index) => (
            <section
              className="information-section"
              id={`${idPrefix}-section-${index + 1}`}
              key={section.title}
              aria-labelledby={`${idPrefix}-heading-${index + 1}`}
            >
              <span className="information-section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`${idPrefix}-heading-${index + 1}`}>{section.title}</h2>
                <p>{section.text}</p>
              </div>
            </section>
          ))}
        </div>
      </div>
      <div className="information-actions">
        <Link className="button button-outline" href={`/${locale}/catalog`}>
          {common.labels.backCatalog}<Icon name="arrow-right" size={16} />
        </Link>
        <Link className="text-link" href={`/${locale}/${kind === "terms" ? "privacy" : "terms"}`}>
          {kind === "terms" ? ui.privacy : ui.terms}<Icon name="arrow-up-right" size={16} />
        </Link>
      </div>
    </article>
  );
}
