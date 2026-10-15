import { ResourceUnavailable } from "@/components/resource-unavailable";

import Link from "@/components/navigation-link";
import { io } from "next/cache";
import { routeLocale } from "@/lib/route";
import { db } from "@/lib/db";
import { cabinInclude, cabinDto, cabinCardSelect, cabinCardDto, favoriteIds, single, publicCabinWhere } from "@/lib/catalog";
import type { SearchParams } from "@/lib/catalog";
import { getUser } from "@/lib/auth";
import { pageDictionaries } from "@/app/i18n/platform";

import { today } from "@/lib/validation";
import { Icon } from "@/components/icon";
import { CabinGallery } from "@/components/cabin-gallery";
import { PropertyCard } from "@/components/property-card";
import { PropertyFavorite } from "@/components/property-favorite";
import { StaySelector } from "@/components/stay-selector";
import { blockedNights } from "@/lib/booking";
import { formatNumber, interpolate } from "@/app/i18n/format";

export const instant = false;
export default async function CabinPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const locale = await routeLocale(params),
    { slug } = await params,
    query = await searchParams;
  await io();
  const [record, { common }, user] = await Promise.all([
    db.cabin.findFirst({
      where: publicCabinWhere({ slug }),
      include: cabinInclude,
    }),
    pageDictionaries(locale, "cabin"),
    getUser(),
  ]);
  if (!record) return <ResourceUnavailable locale={locale} />;
  const start = today();
  const end = new Date(start + "T00:00:00Z");
  end.setUTCFullYear(end.getUTCFullYear() + 1);
  const [blocked, reviews, saved, relatedRecords] = await Promise.all([
    blockedNights(record.id, start, end),
    db.review.findMany({
      where: { cabinId: record.id, status: "PUBLISHED" },
      include: { user: { select: { firstName: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    favoriteIds(user?.id),
    (async () => {
      const nearby = await db.cabin.findMany({
        where: publicCabinWhere({
          id: { not: record.id },
          location: { regionId: record.location.regionId },
        }),
        select: cabinCardSelect,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 3,
      });
      if (nearby.length === 3) return nearby;
      const elsewhere = await db.cabin.findMany({
        where: publicCabinWhere({
          id: { not: record.id },
          location: { regionId: { not: record.location.regionId } },
        }),
        select: cabinCardSelect,
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        take: 3 - nearby.length,
      });
      return [...nearby, ...elsewhere];
    })(),
  ]);
  const cabin = cabinDto(record, locale, saved);
  const related = relatedRecords.map((row) => cabinCardDto(row, locale, saved));
  const requestedStay = {
    checkIn: single(query, "checkIn"),
    checkOut: single(query, "checkOut"),
    guests: single(query, "guests"),
  };
  const stayQuery = new URLSearchParams();
  for (const [key, value] of Object.entries(requestedStay))
    if (value) stayQuery.set(key, value);
  const currentHref = `/${locale}/cabins/${slug}${stayQuery.size ? `?${stayQuery}` : ""}`;
  return (
    <>
      <Link className="text-link" href={`/${locale}/catalog`}>
        <Icon name="arrow-left" size={18} />
        {common.labels.backCatalog}
      </Link>
      <div className="property-heading">
        <div>
          <p className="cabin-location">
            <Icon name="pin" size={17} />
            {cabin.location}
          </p>
          <div className="property-title-row">
            <h1>{cabin.title}</h1>
            {cabin.reviewsCount > 0 && (
              <a className="property-title-rating" href="#cabin-reviews">
                <Icon name="star" size={17} />
                <strong>{formatNumber(cabin.rating, locale, { maximumFractionDigits: 1 })}</strong>
                <span>{common.nav.reviews}: {formatNumber(cabin.reviewsCount, locale)}</span>
              </a>
            )}
          </div>
        </div>
        <PropertyFavorite
          cabinId={cabin.id}
          active={cabin.favorite}
          locale={locale}
          common={common}
          next={currentHref}
        />
      </div>
      <CabinGallery images={cabin.images} common={common} demo={cabin.isDemo} />
      {cabin.isDemo && <p className="product-notice">{common.labels.demoHint}</p>}
      <div className="property-detail-layout">
        <div className="property-detail-content">
          <div className="property-facts">
            <span>
              <Icon name="users" />
              {common.labels.guests}: {formatNumber(cabin.maxGuests, locale)}
            </span>
            <span>
              <Icon name="bed" />
              {common.labels.bedrooms}: {formatNumber(cabin.bedrooms, locale)}
            </span>
            <span>
              <Icon name="bath" />
              {common.labels.bathrooms}: {formatNumber(cabin.bathrooms, locale)}
            </span>
          </div>
          <section className="property-detail-section">
            <h2>{common.labels.aboutCabin}</h2>
            <p className="property-description">{cabin.description}</p>
            <p className="property-address">
              <Icon name="pin" size={17} />
              {cabin.address}
            </p>
          </section>
          <section className="property-detail-section">
            <h2>{common.nav.amenities}</h2>
            <div className="property-amenities">
              {cabin.amenities.map((amenity) => (
                <span key={amenity.id}>
                  <Icon name={amenity.slug === "wifi" ? "wifi" : "check"} />
                  {amenity.name}
                </span>
              ))}
            </div>
          </section>
          <section className="property-detail-section">
            <h2>{common.labels.rules}</h2>
            <div className="property-rule-times">
              <div><span>{common.labels.checkIn}</span><strong>{cabin.checkInTime}</strong></div>
              <div><span>{common.labels.checkOut}</span><strong>{cabin.checkOutTime}</strong></div>
            </div>
            <p>
              {interpolate(common.labels.cancellationPolicy, {
                hours: String(cabin.cancellationHours),
              })}
            </p>
            {cabin.rules.length > 0 && (
              <ul className="property-rules">
                {cabin.rules.map((rule) => (
                  <li key={rule.title}>
                    {rule.title}
                    {rule.description && <p>{rule.description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="property-detail-section">
            <h2>{common.labels.ownerInfo}</h2>
            <div className="host-card">
              <span className="host-avatar">
                <Icon name="user" size={28} />
              </span>
              <div>
                <strong>{cabin.owner.name}</strong>
                {cabin.owner.verified && (
                  <p>
                    <Icon name="check" size={15} />
                    {common.labels.verified}
                  </p>
                )}
              </div>
            </div>
            {cabin.owner.description && <p>{cabin.owner.description}</p>}
          </section>
          <section className="property-detail-section" id="cabin-reviews">
            <h2>
              {common.nav.reviews}
              {cabin.reviewsCount > 0 && ` · ${formatNumber(cabin.rating, locale, { maximumFractionDigits: 1 })} (${formatNumber(cabin.reviewsCount, locale)})`}
            </h2>
            {reviews.length ? (
              reviews.map((review) => (
                <article className="review-card" key={review.id.toString()}>
                  <div>
                    <strong>{review.user.firstName}</strong>
                    <span>
                      <Icon name="star" size={15} />
                      {review.rating}
                    </span>
                  </div>
                  <p>{review.text}</p>
                </article>
              ))
            ) : (
              <p>{common.labels.reviewEmpty}</p>
            )}
          </section>
        </div>
        <StaySelector
          cabinId={cabin.id}
          slug={slug}
          price={cabin.price}
          maxGuests={cabin.maxGuests}
          locale={locale}
          common={common}
          demo={cabin.isDemo}
          today={start}
          months={common.calendar.months}
          weekdays={common.calendar.weekdays}
          blocked={blocked}
          initial={{
            ...requestedStay,
            guests: requestedStay.guests || "1",
          }}
        />
      </div>
      {related.length > 0 && (
        <section className="similar-cabins" aria-labelledby="similar-cabins-title">
          <div className="section-heading">
            <div>
              <h2 id="similar-cabins-title">{common.labels.relatedTitle}</h2>
              <p>{common.labels.relatedDescription}</p>
            </div>
            <Link className="text-link" href={`/${locale}/catalog`}>
              {common.nav.catalog}
              <Icon name="arrow-up-right" size={18} />
            </Link>
          </div>
          <div className="cabin-grid">
            {related.map((item) => (
              <PropertyCard
                key={item.id}
                cabin={item}
                locale={locale}
                common={common}
                next={currentHref}
                stay={requestedStay}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
