import { isAdminRole } from "@/lib/roles";
import { ResourceUnavailable } from "@/components/resource-unavailable";
import { NavigationForm } from "@/components/navigation-form";
import { PremiumCheckbox } from "@/components/premium-fields";
import Link from "@/components/navigation-link";

import type { ReactNode } from "react";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/admin-dashboard";
import { isDemoBooking } from "@/lib/demo";
import { requireUser } from "@/lib/auth";
import type { Locale } from "@/app/i18n/config";
import type { AdminSection } from "@/lib/admin-navigation";
import { pageDictionaries, namespaces } from "@/app/i18n/platform";
import { ActionForm } from "@/components/action-form";
import {
  Field,
  SelectField,
  TextAreaField,
  StatusBadge,
  Money,
  EmptyState,
  Pager,
} from "@/components/product-ui";
import {
  referenceAction,
  userAdminAction,
  ownerAdminAction,
  cabinAdminAction,
  bookingAdminAction,
  reviewAdminAction,
  translationAdminAction,
  settingsAdminAction,
  notificationAdminAction,
} from "@/app/actions/admin";

export async function AdminContent({
  locale,
  section,
  query,
}: {
  locale: Locale;
  section: AdminSection;
  query: Record<string, string | string[] | undefined>;
}) {
  if (section === "dashboard") return <AdminDashboard locale={locale} query={query} />;
  const user = await requireUser(locale, `/${locale}/admin`);
  if (!isAdminRole(user.role)) return <ResourceUnavailable locale={locale} />;
  const { common } = await pageDictionaries(locale, "admin"),
    labels = common.labels;
  const raw = Number(typeof query.page === "string" ? query.page : 1),
    page = Number.isSafeInteger(raw) && raw > 0 && raw <= 100000 ? raw : 1,
    take = 20,
    skip = (page - 1) * take;
  const hidden = (name: string, value: string | number | bigint) => (
    <input type="hidden" name={name} value={String(value)} />
  );
  const statusOptions = (values: string[]) =>
    values.map((status) => (
      <option key={status} value={status}>
        {common.statuses[status as keyof typeof common.statuses] || status}
      </option>
    ));
  const list = (rows: ReactNode[], count: number) =>
    rows.length ? (
      <>
        <div className="admin-record-list">{rows}</div>
        {count > take && (
          <Pager
            locale={locale}
            path={`admin/${section}`}
            params={query}
            page={page}
            pages={Math.ceil(count / take)}
            common={common}
          />
        )}
      </>
    ) : (
      <EmptyState common={common} />
    );
  const formProps = { locale, common };
  const search = typeof query.q === "string" ? query.q.trim().slice(0, 100) : "";
  const cabinWhere = search ? { OR: ["title", "titleKg", "titleEn"].map(key => ({ [key]: { contains: search, mode: "insensitive" as const } })) } : {};
  const userWhere = search ? { OR: [{ firstName: { contains: search, mode: "insensitive" as const } }, { lastName: { contains: search, mode: "insensitive" as const } }] } : {};
  let content: ReactNode;
  if (section === "regions" || section === "amenities") {
    const kind = section === "regions" ? "region" : "amenity";
    const [rows, count] =
      section === "regions"
        ? await Promise.all([
            db.region.findMany({ orderBy: { id: "asc" }, skip, take }),
            db.region.count(),
          ])
        : await Promise.all([
            db.amenity.findMany({ orderBy: { id: "asc" }, skip, take }),
            db.amenity.count(),
          ]);
    const fields = (row?: (typeof rows)[number]) => (
      <>
        {hidden("kind", kind)}
        {row && hidden("recordId", row.id)}
        <div className="form-grid-two">
          <Field
            label={`${labels.title} · RU`}
            name="name"
            defaultValue={row?.name}
            required
            maxLength={100}
          />
          <Field
            label={labels.slug}
            name="slug"
            defaultValue={row?.slug}
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={100}
          />
          <Field
            label={`${labels.title} · KG`}
            name="nameKg"
            defaultValue={row?.nameKg || ""}
            maxLength={100}
          />
          <Field
            label={`${labels.title} · EN`}
            name="nameEn"
            defaultValue={row?.nameEn || ""}
            maxLength={100}
          />
        </div>
        <label className="product-checkbox">
          <PremiumCheckbox name="isActive" defaultChecked={row?.isActive ?? true} />
          {labels.active}
        </label>
      </>
    );
    content = (
      <>
        <details className="product-panel admin-add">
          <summary>{labels.add}</summary>
          <ActionForm action={referenceAction} {...formProps}>
            {fields()}
          </ActionForm>
        </details>
        {list(
          rows.map((row) => (
            <details className="product-panel admin-record" key={row.id}>
              <summary>
                {row.name} · {row.isActive ? labels.active : labels.inactive}
              </summary>
              <ActionForm action={referenceAction} {...formProps}>
                {fields(row)}
              </ActionForm>
            </details>
          )),
          count,
        )}
      </>
    );
  } else if (section === "users") {
    const [rows, count] = await Promise.all([
      db.user.findMany({
        where: userWhere,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        select: { id: true, firstName: true, email: true, phone: true, role: true, isActive: true },
      }),
      db.user.count({ where: userWhere }),
    ]);
    content = list(
      rows.map((row) => (
        <article className="product-panel admin-record" key={row.id.toString()}>
          <h3>{row.firstName}</h3>
          <p>
            {row.email} · {row.phone}
          </p>
          <ActionForm action={userAdminAction} {...formProps}>
            {hidden("userId", row.id)}
            <SelectField label={labels.role} name="role" defaultValue={row.role}>
              {statusOptions(["USER", "OWNER", "ADMIN"])}
            </SelectField>
            <label className="product-checkbox">
              <PremiumCheckbox name="isActive" defaultChecked={row.isActive} />
              {labels.active}
            </label>
          </ActionForm>
        </article>
      )),
      count,
    );
  } else if (section === "owners") {
    const [rows, count] = await Promise.all([
      db.ownerProfile.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, email: true } },
          _count: { select: { cabins: true } },
        },
      }),
      db.ownerProfile.count(),
    ]);
    content = list(
      rows.map((row) => (
        <article className="product-panel admin-record" key={row.id.toString()}>
          <h3>{row.businessName || row.user.firstName}</h3>
          <p>
            {row.user.email} · {common.nav.cabins}: {row._count.cabins}
          </p>
          {row.description && <p>{row.description}</p>}
          <StatusBadge status={row.verificationStatus} common={common} />
          <ActionForm action={ownerAdminAction} {...formProps}>
            {hidden("ownerId", row.id)}
            <SelectField label={labels.status} name="status" defaultValue={row.verificationStatus}>
              {statusOptions(["PENDING", "VERIFIED", "REJECTED"])}
            </SelectField>
          </ActionForm>
        </article>
      )),
      count,
    );
  } else if (section === "cabins") {
    const [rows, count] = await Promise.all([
      db.cabin.findMany({
        where: cabinWhere,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          owner: { include: { user: { select: { email: true } } } },
          location: { include: { region: true } },
          _count: { select: { images: true } },
        },
      }),
      db.cabin.count({ where: cabinWhere }),
    ]);
    content = list(
      rows.map((row) => (
        <article className="product-panel admin-record" key={row.id.toString()}>
          <h3>{row.title}</h3>
          <p>
            {row.location.region.name} · {row.owner.user.email}
          </p>
          <p>
            <Money amount={row.pricePerNight.toString()} locale={locale} common={common} /> ·{" "}
            {labels.photos}: {row._count.images}
          </p>
          <StatusBadge status={row.status} common={common} />
          {row.status === "PUBLISHED" && (
            <Link className="text-link" href={`/${locale}/cabins/${row.slug}`}>
              {labels.details}
            </Link>
          )}
          <ActionForm action={cabinAdminAction} {...formProps}>
            {hidden("cabinId", row.id)}
            <SelectField
              label={labels.status}
              name="status"
              defaultValue={row.status === "DRAFT" ? "PENDING" : row.status}
            >
              {statusOptions(["PENDING", "PUBLISHED", "BLOCKED", "ARCHIVED"])}
            </SelectField>
          </ActionForm>
        </article>
      )),
      count,
    );
  } else if (section === "bookings") {
    const [rows, count] = await Promise.all([
      db.booking.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { cabin: { select: { title: true, isDemo: true } } },
      }),
      db.booking.count(),
    ]);
    content = (
      <>
        <p className="product-notice">{labels.ownerStatusHint}</p>
        {list(
          rows.map((row) => (
            <article className="product-panel admin-record" key={row.id.toString()}>
              <Link className="text-link" href={`/${locale}/bookings/${row.id}`}>
                {row.bookingNumber}
              </Link>
              <h3>{row.cabin.title}</h3>
              <p>
                {row.checkIn.toISOString().slice(0, 10)} — {row.checkOut.toISOString().slice(0, 10)}{" "}
                · {row.guestName}
              </p>
              <p>
                <Money amount={row.totalAmount.toString()} locale={locale} common={common} />
              </p>
              <StatusBadge status={row.status} common={common} demo={isDemoBooking(row)} />
              {!isDemoBooking(row) && (row.status === "PENDING" ||
                (row.status === "CONFIRMED" && row.checkOut <= new Date())) && (
                <ActionForm action={bookingAdminAction} {...formProps}>
                  {hidden("bookingId", row.id)}
                  <SelectField label={labels.status} name="status">
                    {statusOptions(
                      row.status === "PENDING" ? ["CONFIRMED", "REJECTED"] : ["COMPLETED"],
                    )}
                  </SelectField>
                </ActionForm>
              )}
            </article>
          )),
          count,
        )}
      </>
    );
  } else if (section === "payments") {
    const [rows, count] = await Promise.all([
      db.payment.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          booking: { select: { bookingNumber: true } },
          user: { select: { email: true } },
        },
      }),
      db.payment.count(),
    ]);
    content = (
      <>
        <p className="product-notice">{labels.integrationsPending}</p>
        {list(
          rows.map((row) => (
            <article className="product-panel admin-record" key={row.id.toString()}>
              <Link className="text-link" href={`/${locale}/bookings/${row.bookingId}`}>
                {row.booking.bookingNumber}
              </Link>
              <p>{row.user.email}</p>
              <h3>
                <Money amount={row.amount.toString()} locale={locale} common={common} />
              </h3>
              <StatusBadge status={row.status} kind="payment" common={common} />
              <p className="form-hint">
                {row.paymentMethod === "AWAITING_CONFIGURATION"
                  ? labels.paymentAwaiting
                  : row.paymentMethod}
                {row.transactionId && ` · ${row.transactionId}`}
              </p>
            </article>
          )),
          count,
        )}
      </>
    );
  } else if (section === "reviews") {
    const [rows, count] = await Promise.all([
      db.review.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true } }, cabin: { select: { title: true } } },
      }),
      db.review.count(),
    ]);
    content = list(
      rows.map((row) => (
        <article className="product-panel admin-record" key={row.id.toString()}>
          <h3>{row.cabin.title}</h3>
          <p>
            {row.user.firstName} · {labels.rating}: {row.rating}
          </p>
          <p>{row.text}</p>
          <ActionForm action={reviewAdminAction} {...formProps}>
            {hidden("reviewId", row.id)}
            <SelectField label={labels.status} name="status" defaultValue={row.status}>
              {statusOptions(["PENDING", "PUBLISHED", "HIDDEN"])}
            </SelectField>
          </ActionForm>
        </article>
      )),
      count,
    );
  } else if (section === "activities") {
    const [rows, count] = await Promise.all([
      db.auditLog.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
      db.auditLog.count(),
    ]);
    content = list(
      rows.map((row) => (
        <article className="product-panel admin-record" key={row.id.toString()}>
          <h3>
            {common.events[
              row.action.replace(/\.([a-z])/g, (_, letter) =>
                letter.toUpperCase(),
              ) as keyof typeof common.events
            ] || row.action}
          </h3>
          <p>
            {row.entityType} #{row.entityId.toString()} · {row.user?.email || "—"}
          </p>
          <p className="form-hint">
            {row.createdAt.toISOString().replace("T", " ").slice(0, 16)} UTC
          </p>
        </article>
      )),
      count,
    );
  } else if (section === "notifications") {
    const [rows, count] = await Promise.all([
      db.notification.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { email: true } } },
      }),
      db.notification.count(),
    ]);
    content = (
      <>
        <details className="product-panel admin-add">
          <summary>{labels.sendNotification}</summary>
          <ActionForm
            action={notificationAdminAction}
            {...formProps}
            submitLabel={labels.sendNotification}
          >
            <Field
              label={labels.recipient}
              name="userId"
              inputMode="numeric"
              pattern="[0-9]+"
              required
            />
            <Field label={labels.title} name="title" required maxLength={255} />
            <TextAreaField label={labels.message} name="message" required maxLength={5000} />
          </ActionForm>
        </details>
        {list(
          rows.map((row) => (
            <article className="product-panel admin-record" key={row.id.toString()}>
              <h3>
                {common.events[
                  row.type.replace(/\.([a-z])/g, (_, letter) =>
                    letter.toUpperCase(),
                  ) as keyof typeof common.events
                ] || row.title}
              </h3>
              <p>{common.statuses[row.message as keyof typeof common.statuses] || row.message}</p>
              <p className="form-hint">
                {row.user.email} · {row.isRead ? labels.read : labels.notRead}
              </p>
            </article>
          )),
          count,
        )}
      </>
    );
  } else if (section === "translations") {
    const [rows, count] = await Promise.all([
      db.translation.findMany({ skip, take, orderBy: { updatedAt: "desc" } }),
      db.translation.count(),
    ]);
    content = (
      <>
        <section className="product-panel">
          <ActionForm action={translationAdminAction} {...formProps}>
            <div className="form-grid-two">
              <SelectField name="language" label={labels.locale}>
                {["ru", "kg", "en"].map((language) => (
                  <option key={language} value={language}>
                    {language.toUpperCase()}
                  </option>
                ))}
              </SelectField>
              <SelectField name="namespace" label={labels.namespace}>
                {namespaces.map((namespace) => (
                  <option key={namespace} value={namespace}>
                    {namespace}
                  </option>
                ))}
              </SelectField>
            </div>
            <Field
              name="key"
              label={labels.key}
              required
              placeholder="labels.book"
              maxLength={255}
            />
            <TextAreaField name="value" label={labels.value} required />
          </ActionForm>
        </section>
        {list(
          rows.map((row) => (
            <article className="product-panel admin-record" key={row.id.toString()}>
              <h3>
                {row.locale.toUpperCase()} · {row.namespace}
              </h3>
              <p>{row.key}</p>
              <p>{row.value}</p>
              <ActionForm
                action={translationAdminAction}
                {...formProps}
                submitLabel={labels.removeOverride}
              >
                {hidden("language", row.locale)}
                {hidden("namespace", row.namespace)}
                {hidden("key", row.key)}
                {hidden("remove", "yes")}
              </ActionForm>
            </article>
          )),
          count,
        )}
      </>
    );
  } else {
    const settings = await db.siteSetting.findMany(),
      get = (key: string) => settings.find((row) => row.key === key)?.value;
    content = (
      <>
        <section className="product-panel">
          <ActionForm action={settingsAdminAction} {...formProps}>
            <Field
              label={labels.supportEmail}
              name="supportEmail"
              type="email"
              maxLength={255}
              defaultValue={
                typeof get("supportEmail") === "string" ? String(get("supportEmail")) : ""
              }
            />
            <label className="product-checkbox">
              <PremiumCheckbox
                name="bookingsEnabled"
                type="checkbox"
                defaultChecked={get("bookingsEnabled") !== false}
              />
              {labels.bookingsEnabled}
            </label>
          </ActionForm>
        </section>
        <section className="product-panel">
          <h3>{labels.externalServices}</h3>
          <p>{labels.integrationsPending}</p>
        </section>
      </>
    );
  }
  return (
    <>
      <div className="admin-section-heading">
        <h2>{common.nav[section]}</h2>
      </div>
      {(section === "cabins" || section === "users") && <NavigationForm action={`/${locale}/admin/${section}`} className="admin-table-filters"><Field label={labels.q} name="q" defaultValue={search} maxLength={100} /><button type="submit" className="admin-button">{labels.filters}</button></NavigationForm>}
      {content}
    </>
  );
}
