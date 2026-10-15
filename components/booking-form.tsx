"use client";
import { useState } from "react";
import { useSafeAction } from "@/components/use-safe-action";
import { useAvailability } from "@/components/use-availability";
import { PendingButton } from "@/components/pending-button";
import { bookingAction } from "@/app/actions/traveler";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import { formatNumber } from "@/app/i18n/format";
import { PremiumDatePicker } from "@/components/premium-date-picker";
import { GuestSelector } from "@/components/guest-selector";
import { Field } from "@/components/premium-fields";
import { addDays } from "@/lib/stay-dates";

export function BookingForm({
  locale,
  common,
  demo = false,
  cabinId,
  maxGuests,
  today,
  requestKey,
  initial,
  contact,
  blocked = [],
}: {
  locale: Locale;
  common: CommonDictionary;
  demo?: boolean;
  cabinId: string;
  maxGuests: number;
  today: string;
  requestKey: string;
  initial: { checkIn: string; checkOut: string; guests: string };
  contact: { guestName: string; guestPhone: string; guestEmail: string };
  blocked?: string[];
}) {
  const [state, action, pending] = useSafeAction(bookingAction, {}),
    [values, setValues] = useState({ ...initial, ...contact });
  const { quote, code, checking, reset, check } = useAvailability();
  const labels = common.labels;
  function update(name: string, value: string) {
    setValues((previous) => ({ ...previous, [name]: value }));
    if (["checkIn", "checkOut", "guests"].includes(name)) {
      reset();
    }
  }
  return (
    <form action={action} className="product-form booking-form" aria-busy={pending}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="cabinId" value={cabinId} />
      <input type="hidden" name="requestKey" value={requestKey} />
      <fieldset disabled={pending}>
        <PremiumDatePicker value={values} required disabled={pending} today={today} blocked={blocked} maxDate={addDays(today, 365)}
          labels={{ checkIn: labels.checkIn, checkOut: labels.checkOut }}
          onValueChange={(range) => { reset(); setValues(previous => ({ ...previous, ...range })); }} />
        <GuestSelector label={labels.guests} required disabled={pending} value={values.guests} maxGuests={maxGuests} onValueChange={value => update("guests", value)} />
        <PendingButton className="button button-outline" type="button" pending={checking} onClick={() => check({ cabinId, checkIn: values.checkIn, checkOut: values.checkOut, guests: values.guests })}>
          {checking ? labels.checking : labels.confirmAvailability}
        </PendingButton>
        {quote && (
          <div className="booking-quote" role="status">
            <span>
              {labels.subtotal} · {labels.nightCount.replace("{count}", String(quote.nights))}
            </span>
            <strong>
              {formatNumber(Number(quote.total), locale)} {labels.currency}
            </strong>
          </div>
        )}
        <h2>{labels.contact}</h2>
        {(["guestName", "guestPhone", "guestEmail"] as const).map((name) => (
          <Field key={name}
            label={name === "guestName"
                ? labels.name
                : name === "guestPhone"
                  ? labels.phone
                  : labels.email}
              name={name}
              type={name === "guestEmail" ? "email" : name === "guestPhone" ? "tel" : "text"}
              autoComplete={name === "guestName" ? "name" : name === "guestPhone" ? "tel" : "email"}
              required
              maxLength={name === "guestName" ? 200 : name === "guestPhone" ? 30 : 255}
              value={values[name]}
              onChange={(event) => update(name, event.target.value)}
            />
        ))}
      </fieldset>
      {(code || state.code) && !pending && (
        <p className="form-message form-error" role="alert">
          {common.errors[(code || state.code) as keyof typeof common.errors] ||
            common.errors.serverError}
        </p>
      )}
      <p className={demo ? "product-notice" : "form-hint"}>{demo ? labels.demoBookingHint : labels.paymentPending}</p>
      <PendingButton className="button button-primary" type="submit" pending={pending} disabled={!quote || checking}>
        {pending ? labels.saving : demo ? labels.demoBook : labels.book}
      </PendingButton>
    </form>
  );
}
