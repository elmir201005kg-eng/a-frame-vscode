import Link from "@/components/navigation-link";
import Image from "next/image";
import { Icon } from "@/components/icon";
import { PropertyCard } from "@/components/property-card";
import { EmptyState } from "@/components/product-ui";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { baseDictionary, translated, type CommonDictionary } from "@/app/i18n/platform";
import { LandingSearch } from "@/components/landing-search";
import { references, featuredCabins } from "@/lib/catalog";
import { getUser } from "@/lib/auth";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { destinations } from "@/lib/landing-data";
import { pwaText } from "@/lib/pwa";

export async function LandingExplorer({
  locale,
  dictionary,
  offline = false,
}: {
  locale: Locale;
  dictionary: LandingDictionary;
  offline?: boolean;
}) {
  const common = offline ? await baseDictionary(locale, "common") as CommonDictionary : await translated<CommonDictionary>(locale, "common");
  let data: {
    refs: Awaited<ReturnType<typeof references>>;
    results: Awaited<ReturnType<typeof featuredCabins>>;
  } | null = null;
  if (!offline) try {
    const [results, refs] = await Promise.all([getUser().then(user => featuredCabins(locale, user?.id)), references(locale)]);
    data = { refs, results };
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    console.warn(`[landing] Cabins unavailable (${error.code}). Check DATABASE_URL and database connectivity.`);
  }
  const search = dictionary.search,
    catalog = dictionary.catalog;
  return (
    <>
      <div className="section-shell search-wrap">
        <div className="search-panel" id="search">
          <p className="search-heading">{search.heading}</p>
          <LandingSearch locale={locale} search={search} regions={data?.refs.regions ?? []} disabled={!data} />
        </div>
        <div className="reassurance-row">
          {dictionary.reassurance.map((item, index) => (
            <div className="reassurance-item" key={item.title}>
              <Icon
                className="reassurance-icon"
                name={(["leaf", "sun", "compass"] as const)[index]}
                size={26}
              />
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="section-shell cabins-section" id="cabins" aria-labelledby="cabins-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{catalog.eyebrow}</p>
            <h2 id="cabins-title">{catalog.title}</h2>
            <p>{catalog.description}</p>
          </div>
          <Link className="text-link" href={`/${locale}/catalog`}>
            {catalog.viewAll}
            <Icon name="arrow-up-right" size={19} />
          </Link>
        </div>
        {offline ? (
          <p className="offline-catalog-note"><Icon name="wifi" size={22} />{pwaText[locale].catalog}</p>
        ) : !data ? (
          <EmptyState common={common} title={common.errors.serverError} />
        ) : data.results.cabins.length ? (
          <div className="cabin-grid">
            {data.results.cabins.slice(0, 6).map((cabin) => (
              <PropertyCard key={cabin.id} cabin={cabin} locale={locale} common={common} />
            ))}
          </div>
        ) : (
          <EmptyState common={common}>
            <p>{common.labels.emptyCatalog}</p>
            <Link className="button button-outline" href={`/${locale}/owner`}>
              {common.labels.addCabin}
            </Link>
          </EmptyState>
        )}
        <div className="catalog-more">
          <Link className="button button-outline" href={`/${locale}/catalog`}>
            {catalog.loadMore}
            <Icon name="arrow-right" size={17} />
          </Link>
        </div>
      </section>
      <section
        className="section-shell destinations-section"
        id="destinations"
        aria-labelledby="destinations-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">{dictionary.destinationsSection.eyebrow}</p>
            <h2 id="destinations-title">{dictionary.destinationsSection.title}</h2>
            <p>{dictionary.destinationsSection.description}</p>
          </div>
        </div>
        <div className="destination-grid">
          {destinations.map((destination) => {
            const content = dictionary.destinations[destination.id];
            return (
              <Link
                className="destination-card"
                href={`/${locale}/catalog?region=${destination.id}`}
                key={destination.id}
              >
                <Image
                  unoptimized={offline}
                  src={destination.image}
                  alt={content.imageAlt}
                  fill
                  sizes="(max-width:374px) 92vw, (max-width:767px) 44vw, (max-width:1392px) 30vw, 410px"
                />
                <span className="destination-overlay" />
                <span className="destination-content">
                  <h3>{content.title}</h3>
                  <p>{content.subtitle}</p>
                </span>
                <span className="destination-arrow">
                  <Icon name="arrow-up-right" size={19} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
export default LandingExplorer;
