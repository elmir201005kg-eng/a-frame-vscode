import { isAdminRole } from "@/lib/roles";
import { ResourceUnavailable } from "@/components/resource-unavailable";
import Link from "@/components/navigation-link";
import { redirect } from "next/navigation";
import { routeLocale } from "@/lib/route";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { isDemoBooking } from "@/lib/demo";
import type { SearchParams } from "@/lib/catalog";
import { single } from "@/lib/catalog";
import { pageDictionaries } from "@/app/i18n/platform";
import {
  PageHeading,
  PageTabs,
  EmptyState,
  StatusBadge,
  Money,
  SelectField,
  Field,
  TextAreaField,
} from "@/components/product-ui";
import { ActionForm } from "@/components/action-form";
import { becomeOwnerAction, ownerBookingAction, ownerProfileAction } from "@/app/actions/owner";

export const instant = false;
export default async function OwnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const locale = await routeLocale(params),
    query = await searchParams,
    user = await requireUser(locale, `/${locale}/owner`),
    { common, text } = await pageDictionaries(locale, "owner");
  if (isAdminRole(user.role)) redirect(`/${locale}/admin`);
  if (user.role === "USER")
    return (
      <>
        <PageHeading text={text} />
        <section className="product-panel narrow-panel">
          <p>{common.labels.ownerRegistration}</p>
          <ActionForm
            action={becomeOwnerAction}
            locale={locale}
            common={common}
            submitLabel={common.labels.becomeOwner}
          />
        </section>
      </>
    );
  if (!user.ownerProfile) return <ResourceUnavailable locale={locale} />;
  const owner = user.ownerProfile.id,
    tabs = ["dashboard", "cabins", "bookings", "profile"],
    tab = tabs.includes(single(query, "tab")) ? single(query, "tab") : "dashboard";
  let content;
  if (tab === "dashboard") {
    const [cabins, published, active, income] = await Promise.all([
      db.cabin.count({ where: { ownerId: owner } }),
      db.cabin.count({ where: { ownerId: owner, status: "PUBLISHED" } }),
      db.booking.count({
        where: { cabin: { ownerId: owner }, status: { in: ["PENDING", "CONFIRMED"] } },
      }),
      db.payment.aggregate({
        where: { booking: { cabin: { ownerId: owner } }, status: "PAID" },
        _sum: { amount: true },
      }),
    ]);
    content = (
      <>
        <p className="form-hint">{common.labels.statistics}</p>
        <div className="stat-grid">
          {[
            [common.nav.cabins, cabins],
            [common.labels.published, published],
            [common.labels.activeBookings, active],
          ].map(([label, value]) => (
            <article className="stat-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
          <article className="stat-card">
            <span>{common.labels.income}</span>
            <strong>
              <Money
                amount={income._sum.amount?.toString() || "0"}
                locale={locale}
                common={common}
              />
            </strong>
          </article>
        </div>
        <Link className="button button-primary" href={`/${locale}/owner/cabins/new`}>
          {common.labels.addCabin}
        </Link>
      </>
    );
  } else if (tab === "cabins") {
    const rows = await db.cabin.findMany({
      where: { ownerId: owner },
      include: { location: { include: { region: true } } },
      orderBy: { createdAt: "desc" },
    });
    content = rows.length ? (
      <div className="booking-list">
        {rows.map((row) => (
          <Link
            className="booking-list-card"
            key={row.id.toString()}
            href={`/${locale}/owner/cabins/${row.id}`}
          >
            <div>
              <h2>{row.title}</h2>
              <p>
                {row.location.region.name} · {row.location.address}
              </p>
            </div>
            <div>
              <StatusBadge status={row.status} common={common} />
              <strong>
                <Money amount={row.pricePerNight.toString()} locale={locale} common={common} />
              </strong>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <EmptyState common={common}>
        <Link className="button button-primary" href={`/${locale}/owner/cabins/new`}>
          {common.labels.addCabin}
        </Link>
      </EmptyState>
    );
  } else if (tab === "bookings") {
    const rows = await db.booking.findMany({
      where: { cabin: { ownerId: owner } },
      include: { cabin: { select: { title: true, isDemo: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    content = (
      <>
        <p className="product-notice">{common.labels.ownerStatusHint}</p>
        {rows.length ? (
          <div className="booking-list">
            {rows.map((row) => {
              const options =
                isDemoBooking(row) ? [] : row.status === "PENDING"
                  ? ["CONFIRMED", "REJECTED"]
                  : row.status === "CONFIRMED" && row.checkOut <= new Date()
                    ? ["COMPLETED"]
                    : [];
              return (
                <article className="booking-list-card" key={row.id.toString()}>
                  <div>
                    <p className="eyebrow">{row.bookingNumber}</p>
                    <h2>{row.cabin.title}</h2>
                    <p>
                      {row.guestName} · {row.checkIn.toISOString().slice(0, 10)} —{" "}
                      {row.checkOut.toISOString().slice(0, 10)}
                    </p>
                    <Link className="text-link" href={`/${locale}/bookings/${row.id}`}>
                      {common.labels.details}
                    </Link>
                  </div>
                  <div>
                    <StatusBadge status={row.status} common={common} demo={isDemoBooking(row)} />
                    <Money amount={row.totalAmount.toString()} locale={locale} common={common} />
                    {options.length > 0 && (
                      <ActionForm
                        action={ownerBookingAction}
                        locale={locale}
                        common={common}
                        className="compact-action"
                      >
                        <input name="bookingId" value={row.id.toString()} type="hidden" />
                        <SelectField label={common.labels.status} name="status">
                          {options.map((status) => (
                            <option key={status} value={status}>
                              {common.statuses[status as keyof typeof common.statuses]}
                            </option>
                          ))}
                        </SelectField>
                      </ActionForm>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState common={common} />
        )}
      </>
    );
  } else {
    const profile = await db.ownerProfile.findUniqueOrThrow({ where: { id: owner } });
    content = (
      <section className="product-panel narrow-panel">
        <h2>{common.labels.ownerInfo}</h2>
        <StatusBadge status={profile.verificationStatus} common={common} />
        <ActionForm action={ownerProfileAction} locale={locale} common={common}>
          <Field
            label={common.labels.businessName}
            name="businessName"
            maxLength={255}
            defaultValue={profile.businessName || ""}
          />
          <TextAreaField
            label={common.labels.ownerDescription}
            name="description"
            defaultValue={profile.description || ""}
            maxLength={5000}
          />
          <Field
            label={common.labels.ownerPhone}
            name="contactPhone"
            type="tel"
            maxLength={30}
            defaultValue={profile.contactPhone || ""}
          />
        </ActionForm>
      </section>
    );
  }
  return (
    <>
      <PageHeading text={text}>
        <Link className="button button-primary" href={`/${locale}/owner/cabins/new`}>
          {common.labels.addCabin}
        </Link>
      </PageHeading>
      {user.ownerProfile.verificationStatus !== "VERIFIED" && (
        <p className="product-notice">{common.labels.ownerPending}</p>
      )}
      <PageTabs locale={locale} base="owner" items={tabs} active={tab} common={common} />
      {content}
    </>
  );
}
