import { isAdminRole } from "@/lib/roles";
import { ResourceUnavailable } from "@/components/resource-unavailable";
import { PremiumCheckbox } from "@/components/premium-fields";

import type { ReactNode } from "react";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminWorkspace, workspaceSections } from "@/components/admin-workspace";
import { requireUser } from "@/lib/auth";
import type { Locale } from "@/app/i18n/config";
import type { AdminSection } from "@/lib/admin-navigation";
import { pageDictionaries, namespaces, translated } from "@/app/i18n/platform";
import { AdminActionForm as ActionForm } from "@/components/admin-action-form";
import type { AdminDictionary } from "@/app/i18n/admin";
import {
  Field,
  SelectField,
  TextAreaField,
  StatusBadge,
  EmptyState,
  Pager,
} from "@/components/product-ui";
import {
  referenceAction,
  ownerAdminAction,
  reviewAdminAction,
  translationAdminAction,
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
  if (workspaceSections.some(key => key === section)) return <AdminWorkspace locale={locale} section={section} query={query} />;
  const user = await requireUser(locale, `/${locale}/admin`);
  if (!isAdminRole(user.role)) return <ResourceUnavailable locale={locale} />;
  const { common } = await pageDictionaries(locale, "admin"),
    labels = common.labels;
  const admin = await translated<AdminDictionary>(locale, "admin");
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
  const formProps = { locale, common, text: admin.manage };
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
          <ActionForm action={reviewAdminAction} {...formProps} confirm>
            {hidden("reviewId", row.id)}
            <SelectField label={labels.status} name="status" defaultValue={row.status}>
              {statusOptions(["PENDING", "PUBLISHED", "HIDDEN"])}
            </SelectField>
          </ActionForm>
        </article>
      )),
      count,
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
                confirm
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
    content = <ResourceUnavailable locale={locale} />;
  }
  return (
    <>
      <div className="admin-section-heading">
        <h2>{section === "support" ? admin.shell.support : common.nav[section]}</h2>
      </div>
      {content}
    </>
  );
}
