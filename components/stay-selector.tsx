"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { NavigationForm } from "@/components/navigation-form";
import { PendingButton, SubmitButton, Spinner } from "@/components/pending-button";
import { useAvailability } from "@/components/use-availability";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import { formatNumber } from "@/app/i18n/format";
import { PremiumDatePicker } from "@/components/premium-date-picker";
import { GuestSelector } from "@/components/guest-selector";
import { addDays, validStay } from "@/lib/stay-dates";
const AvailabilityCalendar = dynamic(() => import("@/components/availability-calendar").then(module => module.AvailabilityCalendar), {
  loading: () => <div className="calendar-loading" aria-busy="true"><Spinner /></div>,
});

export function StaySelector({
  cabinId,
  slug,
  price,
  maxGuests,
  locale,
  common,
  demo = false,
  today,
  months,
  weekdays,
  blocked,
  initial,
}: {
  cabinId: string;
  slug: string;
  price: number;
  maxGuests: number;
  locale: Locale;
  common: CommonDictionary;
  demo?: boolean;
  today: string;
  months: string[];
  weekdays: string[];
  blocked: string[];
  initial: { checkIn: string; checkOut: string; guests: string };
}) {
  const [values, setValues] = useState(initial);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const { quote, code, checking, reset, check } = useAvailability();
  function update(name: string, value: string) {
    reset();
    setValues((previous) => ({ ...previous, [name]: value }));
  }
  const labels = common.labels;
  return (
    <aside className="stay-selector product-panel">
      <p className="stay-price">
        <strong>
          {formatNumber(price, locale)} {labels.currency}
        </strong>
        <span>{labels.perNight}</span>
      </p>
      <NavigationForm action={`/${locale}/booking`} className="product-form">
        <input name="cabin" value={slug} type="hidden" />
        <PremiumDatePicker value={values} required today={today} blocked={blocked} maxDate={addDays(today, 365)}
          labels={{ checkIn: labels.checkIn, checkOut: labels.checkOut }}
          onValueChange={(range) => { reset(); setValues(previous => ({ ...previous, ...range })); }} />
        <GuestSelector label={labels.guests} required value={values.guests} maxGuests={maxGuests} onValueChange={value => update("guests", value)} />
        <PendingButton className="button button-outline" type="button" pending={checking} onClick={() => check({ cabinId, ...values })}>
          {checking ? labels.checking : labels.confirmAvailability}
        </PendingButton>
        {code && (
          <p className="form-message form-error" role="alert">
            {common.errors[code as keyof typeof common.errors] || common.errors.serverError}
          </p>
        )}
        {quote && (
          <p className="stay-total" role="status">
            <span>
              {labels.total} · {labels.nightCount.replace("{count}", String(quote.nights))}
            </span>
            <strong>
              {formatNumber(Number(quote.total), locale)} {labels.currency}
            </strong>
          </p>
        )}
        <SubmitButton className="button button-primary">
          {demo ? labels.demoBook : labels.book}
        </SubmitButton>
      </NavigationForm>
      <details className="stay-calendar" onToggle={(event) => setCalendarOpen(event.currentTarget.open)}>
        <summary>{labels.availability}</summary>
        {calendarOpen && <AvailabilityCalendar
          today={today}
          months={months}
          weekdays={weekdays}
          blocked={blocked}
          common={common}
          checkIn={values.checkIn}
          checkOut={values.checkOut}
          maxDate={addDays(today, 365)}
          onDay={(day) => {
            if (!values.checkIn || values.checkOut || day <= values.checkIn) {
              reset();
              setValues((previous) => ({ ...previous, checkIn: day, checkOut: "" }));
            } else if (validStay(values.checkIn, day, today, blocked)) update("checkOut", day);
          }}
        />}
      </details>
      <p className="form-hint">{demo ? labels.demoBookingHint : labels.paymentPending}</p>
    </aside>
  );
}
