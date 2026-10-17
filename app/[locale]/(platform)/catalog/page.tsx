import Link from "@/components/navigation-link";
import { NavigationForm } from "@/components/navigation-form";
import { SubmitButton } from "@/components/pending-button";
import { CatalogFilters } from "@/components/catalog-filters";
import { pageDictionaries } from "@/app/i18n/platform";
import { routeLocale } from "@/lib/route";
import { getUser } from "@/lib/auth";
import { references, searchCabins, single } from "@/lib/catalog";
import type { SearchParams } from "@/lib/catalog";
import { InputError } from "@/lib/validation";
import { PageHeading, Field, SelectField, EmptyState, Pager } from "@/components/product-ui";
import { PropertyCard } from "@/components/property-card";
import { interpolate } from "@/app/i18n/format";
import { PremiumDatePicker } from "@/components/premium-date-picker";
import { GuestSelector } from "@/components/guest-selector";
import { FilterDropdown } from "@/components/filter-dropdown";
import { Icon } from "@/components/icon";
import { formMessages } from "@/app/i18n/forms";
import { today } from "@/lib/validation";

export const instant = false;
export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const locale = await routeLocale(params),
    query = await searchParams;
  const [{ common, text }, refs, { result, error }] = await Promise.all([
    pageDictionaries(locale, "catalog"),
    references(locale),
    (async () => {
      const user = await getUser();
      try { return { result: await searchCabins(query, locale, user?.id), error: "" }; }
      catch (cause) {
        if (cause instanceof InputError) return { result: null, error: cause.code };
        throw cause;
      }
    })(),
  ]);
  const selected = Array.isArray(query.amenity) ? query.amenity : [single(query, "amenity")];
  const forms = formMessages[locale];
  const active: { key: string; value: string; label: string }[] = [];
  const addFilter = (key: string, label: string, display = single(query, key)) => {
    const value = single(query, key);
    if (value) active.push({ key, value, label: `${label}: ${display}` });
  };
  addFilter("q", common.labels.q);
  addFilter("region", common.labels.region, refs.regions.find(region => region.slug === single(query, "region"))?.name);
  addFilter("minPrice", common.labels.minPrice);
  addFilter("maxPrice", common.labels.maxPrice);
  addFilter("guests", common.labels.guests);
  addFilter("checkIn", common.labels.checkIn);
  addFilter("checkOut", common.labels.checkOut);
  addFilter("sort", common.labels.sort, single(query, "sort") === "priceAsc" ? common.labels.priceAsc : common.labels.priceDesc);
  if (single(query, "favorites") === "1") active.push({ key: "favorites", value: "1", label: common.nav.favorites });
  for (const amenity of refs.amenities) if (selected.includes(amenity.slug)) active.push({ key: "amenity", value: amenity.slug, label: amenity.name });
  function withoutFilter(key: string, value: string) {
    const next = new URLSearchParams();
    for (const [name, raw] of Object.entries(query)) {
      if (name === "page" || !raw || ((key === "checkIn" || key === "checkOut") && (name === "checkIn" || name === "checkOut"))) continue;
      for (const entry of Array.isArray(raw) ? raw : [raw]) if (!(name === key && entry === value)) next.append(name, entry);
    }
    return `/${locale}/catalog${next.size ? `?${next}` : ""}`;
  }
  return (
    <>
      <PageHeading text={text} />
      <div className="catalog-page-layout">
        <CatalogFilters label={common.labels.filters}>
          <NavigationForm action={`/${locale}/catalog`} className="product-form" key={JSON.stringify(query)}>
            <Field
              label={common.labels.q}
              name="q"
              type="search"
              defaultValue={single(query, "q")}
              maxLength={100}
            />
            <SelectField
              label={common.labels.region}
              name="region"
              defaultValue={single(query, "region")}
            >
              <option value="">{common.labels.allRegions}</option>
              {refs.regions.map((region) => (
                <option key={region.id} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </SelectField>
            <div className="form-grid-two">
              <Field
                label={common.labels.minPrice}
                name="minPrice"
                type="number"
                min={0}
                max={1000000}
                defaultValue={single(query, "minPrice")}
              />
              <Field
                label={common.labels.maxPrice}
                name="maxPrice"
                type="number"
                min={0}
                max={1000000}
                defaultValue={single(query, "maxPrice")}
              />
            </div>
            <GuestSelector locale={locale} label={common.labels.guests} defaultValue={single(query, "guests")} maxGuests={50} />
            <PremiumDatePicker locale={locale} today={today()} labels={{ checkIn: common.labels.checkIn, checkOut: common.labels.checkOut }}
              defaultValue={{ checkIn: single(query, "checkIn"), checkOut: single(query, "checkOut") }} />
            <FilterDropdown label={common.nav.amenities} defaultValue={selected.filter(Boolean)}
              options={refs.amenities.map(amenity => ({ value: amenity.slug, label: amenity.name }))} />
            {single(query, "favorites") === "1" && <input type="hidden" name="favorites" value="1" />}
            <SelectField
              label={common.labels.sort}
              name="sort"
              defaultValue={single(query, "sort")}
            >
              <option value="">{common.labels.newest}</option>
              <option value="priceAsc">{common.labels.priceAsc}</option>
              <option value="priceDesc">{common.labels.priceDesc}</option>
            </SelectField>
            <SubmitButton className="button button-primary">
              {common.labels.search}
            </SubmitButton>
            <Link className="text-link catalog-reset" href={`/${locale}/catalog`}>
              {common.labels.reset}
            </Link>
          </NavigationForm>
        </CatalogFilters>
        <div className="catalog-page-results">
          {active.length > 0 && <nav className="active-filter-list" aria-label={forms.activeFilters}>
            {active.map(filter => <Link key={`${filter.key}:${filter.value}`} className="active-filter-chip"
              href={withoutFilter(filter.key, filter.value)} aria-label={interpolate(forms.removeFilter, { filter: filter.label })}>
              {filter.label}<Icon name="x" size={14} />
            </Link>)}
          </nav>}
          {error && (
            <p className="form-message form-error" role="alert">
              {common.errors[error as keyof typeof common.errors]}
            </p>
          )}
          {result && (
            <>
              <p className="catalog-page-count" aria-live="polite">
                {interpolate(common.labels.results, { count: String(result.total) })}
              </p>
              {result.cabins.length ? (
                <div className="cabin-grid">
                  {result.cabins.map((cabin, index) => (
                    <PropertyCard
                      key={cabin.id}
                      cabin={cabin}
                      locale={locale}
                      common={common}
                      eager={index < 2}
                      stay={{
                        checkIn: single(query, "checkIn"),
                        checkOut: single(query, "checkOut"),
                        guests: single(query, "guests"),
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState common={common} title={common.labels.noResults}>
                  <p>{common.labels.noResultsHint}</p>
                  <Link className="button button-outline" href={`/${locale}/catalog`}>
                    {common.labels.reset}
                  </Link>
                </EmptyState>
              )}
              <Pager
                locale={locale}
                path="catalog"
                params={query}
                page={result.page}
                pages={result.pages}
                common={common}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
