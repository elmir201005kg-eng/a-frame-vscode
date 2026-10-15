"use client";

import Image from "next/image";
import { FavoriteButton } from "@/components/favorite-button";
import { Icon } from "@/components/icon";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { formatNumber, interpolate, pluralize } from "@/app/i18n/format";
import type { Cabin, CabinId } from "@/lib/landing-data";

type LocalizedCabin = Cabin & LandingDictionary["cabins"][CabinId];

export function CabinCard({ cabin, locale, dictionary, favorite, onToggleFavorite, onOpen }: {
  cabin: LocalizedCabin;
  locale: Locale;
  dictionary: LandingDictionary;
  favorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) {
  const { catalog, counts } = dictionary;
  const favoriteLabel = interpolate(favorite ? catalog.removeFavoriteAria : catalog.addFavoriteAria, { title: cabin.title });

  return (
    <article className="cabin-card">
      <div className="cabin-media">
        <button className="cabin-image-button" type="button" aria-label={interpolate(catalog.detailsAria, { title: cabin.title })} onClick={onOpen}>
          <Image src={cabin.image} alt={cabin.imageAlt} fill sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1099px) 46vw, (max-width: 1439px) 30vw, 410px" />
        </button>
        <span className="cabin-badge">{cabin.badge}</span>
        <span className="cabin-photo-label">{catalog.photoLabel}</span>
        <FavoriteButton active={favorite} label={favoriteLabel} onClick={onToggleFavorite} />
      </div>
      <div className="cabin-content">
        <p className="cabin-location"><Icon name="pin" size={14} />{cabin.location}</p>
        <div className="cabin-title-row">
          <button className="cabin-title" type="button" onClick={onOpen}>{cabin.title}</button>
          {cabin.ratingVerified && <span className="cabin-rating"><Icon name="star" size={14} />{formatNumber(cabin.rating, locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</span>}
        </div>
        <div className="cabin-meta">
          <span><Icon name="users" size={16} />{interpolate(catalog.maxGuests, { count: formatNumber(cabin.maxGuests, locale) })}</span>
          <span><Icon name="bed" size={17} />{pluralize(cabin.bedrooms, locale, counts.bedrooms)}</span>
        </div>
        <div className="cabin-footer">
          <p className="cabin-price"><strong>{formatNumber(cabin.pricePerNight, locale)} <span>{catalog.currency}</span></strong><span>{catalog.perNight}</span></p>
          <button className="card-details" type="button" aria-label={interpolate(catalog.openAria, { title: cabin.title })} onClick={onOpen}>{catalog.detailsAction}<Icon name="arrow-up-right" size={18} /></button>
        </div>
      </div>
    </article>
  );
}
