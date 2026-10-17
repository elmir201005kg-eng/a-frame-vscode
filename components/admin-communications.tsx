import { db } from "@/lib/db";
import { adminPage } from "@/lib/admin-period";
import { queryString } from "@/lib/admin-filters";
import { notificationAdminAction } from "@/app/actions/admin";
import { readAdminNotificationsAction } from "@/app/actions/admin-workspace";
import { AdminActionForm } from "@/components/admin-action-form";
import { Field, SelectField, TextAreaField } from "@/components/product-ui";
import { AdminPageHeading, AdminFilters, AdminPagination, adminDate, type AdminContext } from "@/components/admin-workspace-ui";
import type { Prisma } from "@/generated/prisma/client";

export async function AdminCommunications({ ctx, messages = false }: { ctx: AdminContext; messages?: boolean }) {
  const { locale, common, query, text: { manage: t } } = ctx, section = messages ? "messages" : "notifications", q = queryString(query, "q"), labels = common.labels;
  const where: Prisma.NotificationWhereInput = { ...(messages ? { type: "admin.message" } : { userId: ctx.user.id }), ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { message: { contains: q, mode: "insensitive" } }] } : {}) };
  const count = await db.notification.count({ where }), page = Math.min(adminPage(query), Math.max(1, Math.ceil(count / 20)));
  const [rows, recipients] = await Promise.all([
    db.notification.findMany({ where, take: 20, skip: (page - 1) * 20, orderBy: [{ createdAt: "desc" }, { id: "desc" }], include: { user: { select: { firstName: true, email: true } } } }),
    messages ? db.user.findMany({ where: { isActive: true }, orderBy: { firstName: "asc" }, select: { id: true, firstName: true, email: true } }) : Promise.resolve([]),
  ]);
  return <><AdminPageHeading ctx={ctx} section={section} /><p className="product-notice">{messages ? t.messagesHint : t.notificationsDescription}</p><AdminFilters ctx={ctx} section={section} />
    {messages ? <details className="product-panel admin-add"><summary>{labels.sendNotification}</summary><AdminActionForm action={notificationAdminAction} locale={locale} common={common} text={t} submitLabel={labels.sendNotification}><SelectField name="userId" label={labels.recipient} required>{recipients.map(row => <option key={String(row.id)} value={String(row.id)}>{row.firstName} · {row.email}</option>)}</SelectField><Field name="title" label={labels.title} required maxLength={255} /><TextAreaField name="message" label={labels.message} required maxLength={5000} /></AdminActionForm></details> : <AdminActionForm action={readAdminNotificationsAction} locale={locale} common={common} text={t} submitLabel={t.readAll} className="admin-read-action" />}
    <div className="admin-record-list">{rows.map(row => <article className="product-panel admin-message-card" key={String(row.id)} data-unread={!row.isRead || undefined}><div className="admin-card-heading"><h2>{common.events[row.type.replace(/\.([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof typeof common.events] || row.title}</h2><span className="admin-live-label">{row.isRead ? labels.read : labels.notRead}</span></div><p>{common.statuses[row.message as keyof typeof common.statuses] || row.message}</p><p className="form-hint">{row.user.firstName} · {row.user.email} · {adminDate(row.createdAt, locale)}</p></article>)}</div>{!rows.length && <div className="admin-table-empty">{common.labels.empty}</div>}
    <AdminPagination ctx={ctx} section={section} count={count} page={page} />
  </>;
}
