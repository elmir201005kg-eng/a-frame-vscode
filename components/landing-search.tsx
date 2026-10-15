"use client";

import { useId } from "react";
import type { Locale } from "@/app/i18n/config";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { NavigationForm } from "@/components/navigation-form";
import { SubmitButton } from "@/components/pending-button";
import { PremiumSelect } from "@/components/premium-select";
import { PremiumDatePicker } from "@/components/premium-date-picker";
import { GuestSelector } from "@/components/guest-selector";
import { Icon } from "@/components/icon";

export function LandingSearch({ locale, search, regions, disabled }: {
  locale: Locale; search: LandingDictionary["search"]; regions: { slug: string; name: string }[]; disabled: boolean;
}) {
  const regionId = useId();
  return <NavigationForm className="search-form" action={`/${locale}/catalog`} aria-label={search.ariaLabel}>
    <div className="search-field">
      <label className="field-label" htmlFor={regionId}><Icon name="pin" size={17} />{search.destination}</label>
      <PremiumSelect id={regionId} name="region" defaultValue="" disabled={disabled}
        options={[{ value: "", label: search.destinationPlaceholder }, ...regions.map(region => ({ value: region.slug, label: region.name }))]} />
    </div>
    <PremiumDatePicker disabled={disabled} className="search-date-fields" labels={{ checkIn: search.checkIn, checkOut: search.checkOut }} />
    <GuestSelector disabled={disabled} label={search.guests} placeholder={search.guestsPlaceholder} maxGuests={50} />
    <SubmitButton className="button button-primary search-submit" disabled={disabled}><Icon name="search" size={19} />{search.submit}</SubmitButton>
  </NavigationForm>;
}
