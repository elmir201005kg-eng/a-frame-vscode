"use client";
import { useState } from "react";
import dynamic from "@/components/lazy-component";
import { NavigationForm } from "@/components/navigation-form";
import { PendingButton, SubmitButton, Spinner } from "@/components/pending-button";
import { useAvailability } from "@/components/use-availability";
import { useSafeAction } from "@/components/use-safe-action";
import { demoBookingAction } from "@/app/actions/traveler";
import { FINIK_PAYMENT_AMOUNT } from "@/lib/finik-config";
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
  requestKey,
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
  requestKey: string;
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
  const [state, action, pending] = useSafeAction(demoBookingAction, {});
  const { quote, code, checking, reset, check } = useAvailability();
  function update(name: string, value: string) {
    reset();
    setValues((previous) => ({ ...previous, [name]: value }));
  }
  const labels = common.labels;
  const errorCode = code || state.code;
  const errorMessage = errorCode === "paymentProviderUnavailable" ? labels.paymentProviderUnavailable
    : common.errors[errorCode as keyof typeof common.errors] || common.errors.serverError;
  const fields = (
    <>
        <input name="cabin" value={slug} type="hidden" />
        <PremiumDatePicker locale={locale} value={values} required disabled={pending} today={today} blocked={blocked} maxDate={addDays(today, 365)}
          labels={{ checkIn: labels.checkIn, checkOut: labels.checkOut }}
          onValueChange={(range) => { reset(); setValues(previous => ({ ...previous, ...range })); }} />
        <GuestSelector locale={locale} label={labels.guests} required disabled={pending} value={values.guests} maxGuests={maxGuests} onValueChange={value => update("guests", value)} />
        <PendingButton className="button button-outline" type="button" disabled={pending} pending={checking} onClick={() => check({ cabinId, ...values })}>
          {checking ? labels.checking : labels.confirmAvailability}
        </PendingButton>
        {errorCode && !pending && (
          <p className="form-message form-error" role="alert">
            {errorMessage}
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
        {demo ? <>
          <p className="form-hint">{labels.demoPaymentHint.replace("{amount}", String(FINIK_PAYMENT_AMOUNT))}</p>
          <PendingButton className="button button-primary" type="submit" pending={pending} disabled={checking}>
            {pending ? labels.paymentCreating : labels.demoBook}
          </PendingButton>
        </> : <SubmitButton className="button button-primary">{labels.book}</SubmitButton>}
    </>
  );
  return (
    <aside className="stay-selector product-panel">
      <p className="stay-price">
        <strong>
          {formatNumber(price, locale)} {labels.currency}
        </strong>
        <span>{labels.perNight}</span>
      </p>
      {demo ? <form action={action} className="product-form" aria-busy={pending}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="cabinId" value={cabinId} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="requestKey" value={requestKey} />
        {fields}
      </form> : <NavigationForm action={`/${locale}/booking`} className="product-form">{fields}</NavigationForm>}
      <details className="stay-calendar" onToggle={(event) => setCalendarOpen(event.currentTarget.open)}>
        <summary>{labels.availability}</summary>
        {calendarOpen && <AvailabilityCalendar
          locale={locale}
          today={today}
          months={months}
          weekdays={weekdays}
          blocked={blocked}
          common={common}
          checkIn={values.checkIn}
          checkOut={values.checkOut}
          maxDate={addDays(today, 365)}
          onDay={(day) => {
            if (pending) return;
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
