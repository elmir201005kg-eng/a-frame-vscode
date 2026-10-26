import Link from "@/components/navigation-link";
import { db } from "@/lib/db";
import { isAdminRole } from "@/lib/roles";
import { adminPage } from "@/lib/admin-period";
import { queryString, adminDateFilter } from "@/lib/admin-filters";
import { userAdminAction } from "@/app/actions/admin";
import { AdminActionForm } from "@/components/admin-action-form";
import { SelectField, StatusBadge, Money } from "@/components/product-ui";
import { PremiumCheckbox } from "@/components/premium-fields";
import { AdminPageHeading, AdminFilters, AdminTable, AdminPagination, adminDate, hidden, type AdminContext } from "@/components/admin-workspace-ui";
import type { Prisma } from "@/generated/prisma/client";

export async function AdminPeople({ ctx }: { ctx: AdminContext }) {
  const { locale, common, query, user, text: { manage: t } } = ctx, q = queryString(query, "q"), role = queryString(query, "role"), active = queryString(query, "active");
  const where: Prisma.UserWhereInput = { ...(q ? { OR: ["firstName", "lastName", "email", "phone"].map(key => ({ [key]: { contains: q, mode: "insensitive" } })) } : {}),
    ...(["USER", "OWNER", "ADMIN", "SUPER_ADMIN"].includes(role) ? { role: role as Prisma.EnumUserRoleFilter["equals"] } : {}), ...(active === "yes" || active === "no" ? { isActive: active === "yes" } : {}) };
  const count = await db.user.count({ where }), page = Math.min(adminPage(query), Math.max(1, Math.ceil(count / 20)));
  const rows = await db.user.findMany({ where, take: 20, skip: (page - 1) * 20, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, isActive: true, createdAt: true,
    _count: { select: { bookings: true } }, bookings: { orderBy: { createdAt: "desc" }, take: 10, select: { id: true, bookingNumber: true, status: true, totalAmount: true, cabin: { select: { title: true } } } } } });
  return <><AdminPageHeading ctx={ctx} section="users" /><p className="product-notice">{t.roleHint}</p><AdminFilters ctx={ctx} section="users"><SelectField name="role" label={common.labels.role} defaultValue={role}><option value="">{t.all}</option>{["USER", "OWNER", "ADMIN", "SUPER_ADMIN"].map(value => <option key={value} value={value}>{common.statuses[value as keyof typeof common.statuses]}</option>)}</SelectField><SelectField name="active" label={t.account} defaultValue={active}><option value="">{t.all}</option><option value="yes">{common.labels.active}</option><option value="no">{common.labels.inactive}</option></SelectField></AdminFilters>
    <AdminTable headings={[common.labels.name, common.labels.contact, common.labels.role, t.account, common.nav.bookings, t.actions]} empty={!rows.length} caption={common.labels.empty}>
      {rows.map(row => <tr className="admin-record" key={String(row.id)}><td><div className="admin-person-cell"><span className="admin-avatar">{row.firstName.slice(0, 1)}</span><div>{[row.firstName, row.lastName].filter(Boolean).join(" ")}<small>#{String(row.id)}</small></div></div></td><td>{row.email}<small>{row.phone || "—"}</small></td><td><StatusBadge status={row.role} common={common} /></td><td><span className="admin-status-badge" data-status={row.isActive ? "CONFIRMED" : "CANCELLED"}>{row.isActive ? common.labels.active : common.labels.inactive}</span></td><td>{row._count.bookings}</td><td><details className="admin-row-details"><summary>{t.details}</summary><div className="admin-row-actions"><p>{t.registered}: {adminDate(row.createdAt, locale)}</p>
        {(user.role === "SUPER_ADMIN" || !isAdminRole(row.role)) && <AdminActionForm action={userAdminAction} locale={locale} common={common} text={t} confirm>{hidden("userId", row.id)}<SelectField name="role" label={common.labels.role} defaultValue={row.role}>{(user.role === "SUPER_ADMIN" ? ["USER", "OWNER", "ADMIN", "SUPER_ADMIN"] : ["USER", "OWNER"]).map(value => <option key={value} value={value}>{common.statuses[value as keyof typeof common.statuses]}</option>)}</SelectField><label className="product-checkbox"><PremiumCheckbox name="isActive" defaultChecked={row.isActive} />{common.labels.active}</label></AdminActionForm>}
        <h3>{common.nav.bookings}</h3>{row.bookings.map(booking => <p key={String(booking.id)}><Link href={`/${locale}/admin/bookings?q=${encodeURIComponent(booking.bookingNumber)}`}>{booking.bookingNumber}</Link><small>{booking.cabin.title} · <Money amount={String(booking.totalAmount)} locale={locale} common={common} /></small><StatusBadge status={booking.status} common={common} /></p>)}{!row.bookings.length && <p>{common.labels.empty}</p>}
        {row._count.bookings > 10 && <Link className="admin-button" href={`/${locale}/admin/bookings?userId=${row.id}`}>{t.all}</Link>}
      </div></details></td></tr>)}
    </AdminTable><AdminPagination ctx={ctx} section="users" count={count} page={page} /></>;
}

export async function AdminAudit({ ctx }: { ctx: AdminContext }) {
  const { locale, common, query, text: { manage: t } } = ctx, section = "audit", q = queryString(query, "q"), range = adminDateFilter(query), scope = queryString(query, "scope") === "admins" ? "admins" : "all", adminOnly = scope === "admins";
  const where: Prisma.AuditLogWhereInput = { ...(adminOnly ? { AND: [{ OR: [{ user: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }, { newData: { path: ["actorRole"], equals: "ADMIN" } }, { newData: { path: ["actorRole"], equals: "SUPER_ADMIN" } }] }] } : {}), ...(range.where ? { createdAt: range.where } : {}),
    ...(q ? { OR: [{ action: { contains: q, mode: "insensitive" } }, { entityType: { contains: q, mode: "insensitive" } }, { user: { email: { contains: q, mode: "insensitive" } } }] } : {}) };
  const count = await db.auditLog.count({ where }), page = Math.min(adminPage(query), Math.max(1, Math.ceil(count / 20)));
  const rows = await db.auditLog.findMany({ where, take: 20, skip: (page - 1) * 20, orderBy: [{ createdAt: "desc" }, { id: "desc" }], include: { user: { select: { firstName: true, email: true } } } });
  return <><AdminPageHeading ctx={ctx} section={section} /><AdminFilters ctx={ctx} section={section} dates><SelectField name="scope" label={common.labels.role} defaultValue={scope}><option value="all">{t.all}</option><option value="admins">{common.statuses.ADMIN}</option></SelectField></AdminFilters><AdminTable headings={[t.date, t.activity, common.labels.name, t.details]} empty={!rows.length} caption={common.labels.empty}>
    {rows.map(row => <tr key={String(row.id)}><td>{adminDate(row.createdAt, locale)}</td><td>{common.events[row.action.replace(/\.([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof typeof common.events] || row.action}<small>{row.entityType} #{String(row.entityId)}</small></td><td>{row.user?.firstName || "—"}<small>{row.user?.email}</small></td><td><details className="admin-row-details"><summary>{t.details}</summary><div className="admin-row-actions"><strong>{t.oldValue}</strong><pre>{row.oldData ? JSON.stringify(row.oldData, null, 2) : "—"}</pre><strong>{t.newValue}</strong><pre>{row.newData ? JSON.stringify(row.newData, null, 2) : "—"}</pre></div></details></td></tr>)}
  </AdminTable><AdminPagination ctx={ctx} section={section} count={count} page={page} /></>;
}
