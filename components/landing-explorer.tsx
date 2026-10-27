import Link from "@/components/navigation-link";
import { Icon } from "@/components/icon";
import { PropertyCard } from "@/components/property-card";
import { EmptyState } from "@/components/product-ui";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { baseDictionary, translated, type CommonDictionary } from "@/app/i18n/platform";
import { LandingSearch } from "@/components/landing-search";
import { DestinationGrid } from "@/components/landing-sections";
import { references, featuredCabins } from "@/lib/catalog";
import { getUser } from "@/lib/auth";
import { isDatabaseUnavailable } from "@/lib/db-errors";
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
    authenticated: boolean;
  } | null = null;
  if (!offline) try {
    const userPromise = getUser();
    const [user, refs, results] = await Promise.all([
      userPromise,
      references(locale),
      userPromise.then(user => featuredCabins(locale, user?.id)),
    ]);
    data = { refs, results, authenticated: Boolean(user) };
  } catch (error) {
    if (!isDatabaseUnavailable(error)) throw error;
    console.warn(`[landing] Cabins unavailable (${error.code ?? error.message}). Check DATABASE_URL and database connectivity.`);
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
              <PropertyCard key={cabin.id} cabin={cabin} locale={locale} common={common} authenticated={data.authenticated} />
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
      </section>
      {offline && <section
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
        <DestinationGrid locale={locale} dictionary={dictionary} offline />
      </section>}
    </>
  );
}
export default LandingExplorer;
