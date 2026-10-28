import { isAdminRole } from "@/lib/roles";
import { ResourceUnavailable } from "@/components/resource-unavailable";
import Link from "@/components/navigation-link";

import { routeLocale } from "@/lib/route";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isDemoBooking } from "@/lib/demo";
import { id } from "@/lib/validation";
import { pageDictionaries } from "@/app/i18n/platform";
import {
  PageHeading,
  StatusBadge,
  Money,
  Field,
  TextAreaField,
  SelectField,
} from "@/components/product-ui";
import { ActionForm } from "@/components/action-form";
import { cancellationAction, reviewAction } from "@/app/actions/traveler";
import { FinikPayment } from "@/components/finik-payment";
import { FINIK_PAYMENT_AMOUNT } from "@/lib/finik-config";
import { finikConfigured } from "@/lib/finik";
import { single, type SearchParams } from "@/lib/catalog";

export const instant = false;
export default async function BookingDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const locale = await routeLocale(params),
    raw = (await params).id,
    user = await requireUser(locale, `/${locale}/bookings/${raw}`),
    { common, text } = await pageDictionaries(locale, "booking-details");
  let bookingId: bigint;
  try {
    bookingId = id(raw);
  } catch {
    return <ResourceUnavailable locale={locale} />;
  }
  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      ...(isAdminRole(user.role)
        ? {}
        : {
            OR: [
              { userId: user.id },
              ...(user.role === "OWNER" && user.ownerProfile
                ? [{ cabin: { ownerId: user.ownerProfile.id } }]
                : []),
            ],
          }),
    },
    include: {
      cabin: { include: { location: { include: { region: true } }, owner: true } },
      payments: { orderBy: { createdAt: "desc" } },
      review: true,
    },
  });
  if (!booking) return <ResourceUnavailable locale={locale} />;
  const isGuest = booking.userId === user.id,
    canCancel =
      isGuest &&
      ["PENDING", "CONFIRMED"].includes(booking.status) &&
      !!booking.cancelUntil &&
      booking.cancelUntil > new Date() &&
      !booking.payments.some((row) => row.status === "PAID");
  const demo = isDemoBooking(booking);
  const paymentEligible = booking.cabin.isBookable && isGuest && ["PENDING", "CONFIRMED"].includes(booking.status) &&
    !booking.payments.some((payment) => ["PAID", "REFUNDED"].includes(payment.status));
  const canPay = finikConfigured() && paymentEligible;
  const paymentResult = single(await searchParams, "payment");
  const awaitingConfirmation = booking.cabin.isBookable && isGuest && paymentResult === "success" &&
    booking.payments.some((payment) => payment.status === "PENDING" && payment.providerPaymentId);
  return (
    <>
      <PageHeading text={text} />
      {demo && <p className="product-notice">{booking.cabin.isBookable ? common.labels.demoBookingHint : common.errors.cabinNotBookable}</p>}
      <div className="booking-details-layout">
        <section className="product-panel">
          <div className="booking-summary-heading">
            <p className="eyebrow">{booking.bookingNumber}</p>
            <StatusBadge status={booking.status} common={common} demo={demo} />
          </div>
          <Link className="booking-property-title" href={`/${locale}/cabins/${booking.cabin.slug}`}>
            {booking.cabin.title}
          </Link>
          <dl className="detail-list">
            <div>
              <dt>{common.labels.checkIn}</dt>
              <dd>
                {booking.checkIn.toISOString().slice(0, 10)} · {booking.cabin.checkInTime}
              </dd>
            </div>
            <div>
              <dt>{common.labels.checkOut}</dt>
              <dd>
                {booking.checkOut.toISOString().slice(0, 10)} · {booking.cabin.checkOutTime}
              </dd>
            </div>
            <div>
              <dt>{common.labels.guests}</dt>
              <dd>{booking.guestsCount}</dd>
            </div>
            <div>
              <dt>{common.labels.total}</dt>
              <dd>
                <Money amount={booking.totalAmount.toString()} locale={locale} common={common} />
              </dd>
            </div>
            <div>
              <dt>{common.labels.contact}</dt>
              <dd>
                {booking.guestName}
                <br />
                {booking.guestPhone}
                <br />
                {booking.guestEmail}
              </dd>
            </div>
            {booking.cabin.owner.contactPhone && (
              <div>
                <dt>{common.labels.hostContacts}</dt>
                <dd>{booking.cabin.owner.contactPhone}</dd>
              </div>
            )}
            {booking.cancelUntil && (
              <div>
                <dt>{common.labels.cancelUntil}</dt>
                <dd>{booking.cancelUntil.toISOString().replace("T", " ").slice(0, 16)} UTC</dd>
              </div>
            )}
          </dl>
          <p className="form-hint">{common.labels.phonePrivate}</p>
        </section>
        <aside className="product-panel">
          <h2>{demo ? common.labels.demoBooking : common.nav.payments}</h2>
          {(demo || canPay) && <p className="product-notice">{!booking.cabin.isBookable ? common.errors.cabinNotBookable : demo ? common.labels.demoBookingHint : common.labels.paymentPending}</p>}
          {canPay && <p className="payment-line"><span>Finik Pay</span><strong><Money amount={FINIK_PAYMENT_AMOUNT} locale={locale} common={common} /></strong></p>}
          {paymentEligible && !canPay && <p className="form-hint" role="status">{common.labels.paymentProviderUnavailable} <a className="text-link" href="#site-contact">{common.labels.contact}</a></p>}
          {isGuest && (canPay || awaitingConfirmation) && <FinikPayment bookingId={booking.id.toString()} locale={locale} common={common} canPay={canPay} awaitingConfirmation={awaitingConfirmation} initialError={paymentEligible && paymentResult === "failed" ? common.errors.paymentFailed : null} />}
          {booking.payments.map((payment) => (
            <div className="payment-line" key={payment.id.toString()}>
              <Money amount={payment.amount.toString()} locale={locale} common={common} />
              <StatusBadge status={payment.status} kind="payment" common={common} />
            </div>
          ))}
          <Link className="text-link" href={`/${locale}/account?tab=bookings`}>
            {common.nav.bookings}
          </Link>
        </aside>
      </div>
      {canCancel && (
        <section className="product-panel cancellation-panel">
          <h2>{common.labels.cancel}</h2>
          <p className="form-hint">{common.labels.cancelHint}</p>
          <ActionForm
            action={cancellationAction}
            locale={locale}
            common={common}
            submitLabel={common.labels.cancel}
          >
            <input name="bookingId" type="hidden" value={booking.id.toString()} />
            <Field
              label={common.labels.reason}
              name="reason"
              required
              minLength={3}
              maxLength={1000}
            />
          </ActionForm>
        </section>
      )}
      {!demo && isGuest && booking.status === "COMPLETED" && !booking.review && (
        <section className="product-panel cancellation-panel">
          <h2>{common.labels.review}</h2>
          <p className="form-hint">{common.labels.reviewHint}</p>
          <ActionForm
            action={reviewAction}
            locale={locale}
            common={common}
            submitLabel={common.labels.review}
          >
            <input name="bookingId" type="hidden" value={booking.id.toString()} />
            <SelectField label={common.labels.rating} name="rating">
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </SelectField>
            <TextAreaField
              label={common.labels.reviewText}
              name="review"
              required
              maxLength={5000}
            />
          </ActionForm>
        </section>
      )}
    </>
  );
}
