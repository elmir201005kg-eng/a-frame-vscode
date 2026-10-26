import Image from "@/components/image";
import Link from "@/components/navigation-link";
import { Icon } from "@/components/icon";
import { PropertyFavorite } from "@/components/property-favorite";
import type { CabinSummary } from "@/lib/catalog";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { Locale } from "@/app/i18n/config";
import { formatNumber } from "@/app/i18n/format";

export function PropertyCard({
  cabin,
  locale,
  common,
  next,
  authenticated = true,
  stay,
  eager = false,
}: {
  cabin: CabinSummary;
  locale: Locale;
  common: CommonDictionary;
  next?: string;
  authenticated?: boolean;
  stay?: { checkIn: string; checkOut: string; guests: string };
  eager?: boolean;
}) {
  const query = new URLSearchParams();
  if (stay) for (const [key, value] of Object.entries(stay)) if (value) query.set(key, value);
  const href = `/${locale}/cabins/${cabin.slug}${query.size ? `?${query}` : ""}`;
  return (
    <article className="cabin-card">
      <div className="cabin-media">
        <Link
          href={href}
          className="cabin-image-button"
          aria-label={`${common.labels.details}: ${cabin.title}`}
        >
          {cabin.images[0] ? (
            <Image
              src={cabin.images[0].src}
              alt={cabin.images[0].alt}
              fill
              loading={eager ? "eager" : "lazy"}
              sizes="(max-width:767px) 92vw, (max-width:1099px) 44vw, 410px"
            />
          ) : (
            <span className="property-photo-empty">
              <Icon name="home" size={36} />
              {common.labels.noPhoto}
            </span>
          )}
        </Link>
        {cabin.isDemo && <span className="cabin-photo-label">{common.labels.demo}</span>}
        <PropertyFavorite
          cabinId={cabin.id}
          active={cabin.favorite}
          locale={locale}
          common={common}
          next={next || href}
          authenticated={authenticated}
        />
      </div>
      <div className="cabin-content">
        <p className="cabin-location">
          <Icon name="pin" size={14} />
          {cabin.location}
        </p>
        <div className="cabin-title-row">
          <h3>
            <Link className="cabin-title" href={href}>
              {cabin.title}
            </Link>
          </h3>
          {cabin.reviewsCount > 0 && (
            <span className="cabin-rating">
              <Icon name="star" size={14} />
              {formatNumber(cabin.rating, locale, { maximumFractionDigits: 1 })}
            </span>
          )}
        </div>
        <p className="cabin-description">{cabin.description}</p>
        <div className="cabin-meta">
          <span>
            <Icon name="users" size={16} />
            {common.labels.guests}: {formatNumber(cabin.maxGuests, locale)}
          </span>
          <span>
            <Icon name="bed" size={17} />
            {common.labels.bedrooms}: {formatNumber(cabin.bedrooms, locale)}
          </span>
        </div>
        <ul className="cabin-amenity-list" aria-label={common.nav.amenities}>
          {cabin.amenities.slice(0, 3).map((amenity) => (
            <li key={amenity.id}>
              <Icon name={amenity.slug === "wifi" ? "wifi" : amenity.slug === "parking" ? "parking" : amenity.slug === "heating" ? "sun" : amenity.slug === "terrace" ? "leaf" : "home"} size={14} />
              <span>{amenity.name}</span>
            </li>
          ))}
        </ul>
        <div className="cabin-footer">
          <p className="cabin-price">
            <strong>
              {formatNumber(cabin.price, locale)} <span>{common.labels.currency}</span>
            </strong>
            <span>{common.labels.perNight}</span>
          </p>
          <Link className="card-details" href={href}>
            {common.labels.details}
            <Icon name="arrow-up-right" size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
