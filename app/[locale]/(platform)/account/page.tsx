import { isAdminRole } from "@/lib/roles";
import Link from "@/components/navigation-link";
import { routeLocale } from "@/lib/route";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isDemoBooking } from "@/lib/demo";
import type { SearchParams } from "@/lib/catalog";
import { single, cabinCardDto, cabinCardSelect, publicCabinWhere } from "@/lib/catalog";
import { pageDictionaries } from "@/app/i18n/platform";
import {
  PageHeading,
  PageTabs,
  Field,
  EmptyState,
  StatusBadge,
  Money,
} from "@/components/product-ui";
import { ActionForm } from "@/components/action-form";
import { PropertyCard } from "@/components/property-card";
import { profileAction, passwordAction } from "@/app/actions/auth";
import { LogoutForm } from "@/components/logout-form";
import { notificationAction } from "@/app/actions/traveler";
import { becomeOwnerAction } from "@/app/actions/owner";
import { LanguageSwitcher } from "@/components/language-switcher";
import { getLandingDictionary } from "@/app/i18n/dictionaries";
import { GoogleButton } from "@/components/google-button";

export const instant = false;
export default async function AccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const locale = await routeLocale(params),
    query = await searchParams,
    user = await requireUser(
      locale,
      `/${locale}/account?tab=${encodeURIComponent(single(query, "tab"))}`,
    ),
    { common, text } = await pageDictionaries(locale, "account");
  const tabs = ["bookings", "profile", "favorites", "payments", "settings", "notifications"],
    tab = tabs.includes(single(query, "tab")) ? single(query, "tab") : "bookings";
  let content;
  if (tab === "bookings") {
    const rows = await db.booking.findMany({
      where: { userId: user.id },
      include: { cabin: { select: { title: true, slug: true, isDemo: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    content = rows.length ? (
      <div className="booking-list">
        {rows.map((row) => (
          <Link
            className="booking-list-card"
            key={row.id.toString()}
            href={`/${locale}/bookings/${row.id}`}
          >
            <div>
              <p className="eyebrow">{row.bookingNumber}</p>
              <h2>{row.cabin.title}</h2>
              <p>
                {row.checkIn.toISOString().slice(0, 10)} — {row.checkOut.toISOString().slice(0, 10)}
              </p>
            </div>
            <div>
              <StatusBadge status={row.status} common={common} demo={isDemoBooking(row)} />
              <strong>
                <Money amount={row.totalAmount.toString()} locale={locale} common={common} />
              </strong>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <EmptyState common={common}>
        <Link className="button button-primary" href={`/${locale}/catalog`}>
          {common.labels.search}
        </Link>
      </EmptyState>
    );
  } else if (tab === "profile")
    content = (
      <section className="product-panel narrow-panel">
        <ActionForm action={profileAction} locale={locale} common={common}>
          <Field
            label={common.labels.name}
            name="firstName"
            defaultValue={user.firstName}
            required
            maxLength={100}
          />
          <Field
            label={common.labels.lastName}
            name="lastName"
            defaultValue={user.lastName || ""}
            maxLength={100}
          />
          <Field label={common.labels.email} type="email" value={user.email ?? ""} readOnly />
          <Field
            label={common.labels.phone}
            name="phone"
            type="tel"
            defaultValue={user.phone || ""}
            required
            maxLength={30}
          />
        </ActionForm>
      </section>
    );
  else if (tab === "favorites") {
    const rows = await db.favorite.findMany({
      where: {
        userId: user.id,
        cabin: publicCabinWhere(),
      },
      include: { cabin: { select: cabinCardSelect } },
      orderBy: { createdAt: "desc" },
    });
    content = rows.length ? (
      <div className="cabin-grid">
        {rows.map((row) => (
          <PropertyCard
            key={row.id.toString()}
            cabin={cabinCardDto(row.cabin, locale, [row.cabinId.toString()])}
            locale={locale}
            common={common}
            next={`/${locale}/account?tab=favorites`}
          />
        ))}
      </div>
    ) : (
      <EmptyState common={common}>
        <Link className="button button-outline" href={`/${locale}/catalog`}>
          {common.labels.search}
        </Link>
      </EmptyState>
    );
  } else if (tab === "payments") {
    const rows = await db.payment.findMany({
      where: { userId: user.id },
      include: { booking: { select: { bookingNumber: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    content = (
      <>
        <p className="product-notice">{common.labels.paymentPending}</p>
        {rows.length ? (
          <div className="records-table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  <th>{common.labels.bookingNumber}</th>
                  <th>{common.labels.amount}</th>
                  <th>{common.labels.status}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id.toString()}>
                    <td>
                      <Link href={`/${locale}/bookings/${row.bookingId}`}>
                        {row.booking.bookingNumber}
                      </Link>
                    </td>
                    <td>
                      <Money amount={row.amount.toString()} locale={locale} common={common} />
                    </td>
                    <td>
                      <StatusBadge status={row.status} kind="payment" common={common} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState common={common} />
        )}
      </>
    );
  } else if (tab === "notifications") {
    const rows = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    content = rows.length ? (
      <div className="notification-list">
        {rows.map((row) => {
          const key = row.type.replace(/\.(\w)/g, (_, letter: string) => letter.toUpperCase());
          return (
            <article
              className={`notification-card${row.isRead ? " is-read" : ""}`}
              key={row.id.toString()}
            >
              <div>
                <h2>{common.events[key as keyof typeof common.events] || row.title}</h2>
                <p>{common.statuses[row.message as keyof typeof common.statuses] || row.message}</p>
                {row.bookingId && (
                  <Link className="text-link" href={`/${locale}/bookings/${row.bookingId}`}>
                    {common.labels.details}
                  </Link>
                )}
              </div>
              {!row.isRead && (
                <ActionForm
                  action={notificationAction}
                  locale={locale}
                  common={common}
                  submitLabel={common.labels.notificationRead}
                  className="compact-action"
                >
                  <input name="notificationId" value={row.id.toString()} type="hidden" />
                </ActionForm>
              )}
            </article>
          );
        })}
      </div>
    ) : (
      <EmptyState common={common} />
    );
  } else {
    const landing = await getLandingDictionary(locale);
    content = (
      <div className="settings-grid">
        <section className="product-panel">
          <h2>{user.hasPassword ? common.labels.updatePassword : common.auth.setPassword}</h2>
          <ActionForm action={passwordAction} locale={locale} common={common}>
            {user.hasPassword && <Field
              label={common.labels.currentPassword}
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              maxLength={128}
            />}
            <Field
              label={common.labels.newPassword}
              name="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
            <Field
              label={common.labels.confirmPassword}
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={10}
              maxLength={128}
              required
            />
          </ActionForm>
        </section>
        <section className="product-panel">
          <h2>{common.labels.language}</h2>
          <LanguageSwitcher locale={locale} labels={landing.language} />
          {!isAdminRole(user.role) && <div className="account-google-settings">
            <h3>{common.auth.googleAccount}</h3>
            {single(query, "error") && <p className="form-message form-error" role="alert">
              {Object.hasOwn(common.errors, single(query, "error")) ? common.errors[single(query, "error") as keyof typeof common.errors] : common.errors.googleFailed}
            </p>}
            {user.googleConnected ? <p className="form-hint" role="status">{common.auth.googleConnected}</p> :
              <GoogleButton locale={locale} label={common.auth.googleLink} next={`/${locale}/account?tab=settings`} linking />}
          </div>}
          <p className="form-hint">{common.labels.integrationsPending}</p>
          {user.role === "USER" && (
            <ActionForm
              action={becomeOwnerAction}
              locale={locale}
              common={common}
              submitLabel={common.labels.becomeOwner}
            />
          )}
          <LogoutForm locale={locale} label={common.nav.logout} errorLabel={common.errors.serverError} buttonClassName="button button-outline" />
        </section>
      </div>
    );
  }
  return (
    <>
      <PageHeading text={text}>
        <p className="account-greeting">{user.firstName}</p>
      </PageHeading>
      <PageTabs locale={locale} base="account" items={tabs} active={tab} common={common} />
      {content}
    </>
  );
}
