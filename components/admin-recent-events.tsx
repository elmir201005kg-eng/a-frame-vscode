import { Activity, Bell, ArrowUpRight } from "lucide-react";
import Link from "@/components/navigation-link";
import { db } from "@/lib/db";
import type { Locale } from "@/app/i18n/config";
import type { CommonDictionary } from "@/app/i18n/platform";
import type { AdminDictionary } from "@/app/i18n/admin";
import { adminDate } from "@/components/admin-workspace-ui";

export async function AdminRecentEvents({ locale, userId, common, text }: { locale: Locale; userId: bigint; common: CommonDictionary; text: AdminDictionary }) {
  const [events, notifications] = await Promise.all([
    db.auditLog.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5, select: { id: true, action: true, createdAt: true, user: { select: { firstName: true } } } }),
    db.notification.findMany({ where: { userId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5, select: { id: true, type: true, title: true, message: true, createdAt: true } }),
  ]);
  const label = (key: string) => common.events[key.replace(/\.([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof typeof common.events];
  return <div className="admin-management-grid admin-recent-events"><section className="admin-panel"><div className="admin-panel-heading"><h2><Activity size={17} />{text.manage.activity}</h2><Link href={`/${locale}/admin/activities`} aria-label={common.nav.activities}><ArrowUpRight size={18} /></Link></div><div className="admin-event-list">{events.map(row => <article key={String(row.id)}><span className="admin-event-dot" /><div><strong>{label(row.action) || row.action}</strong><p>{row.user?.firstName || "—"} · {adminDate(row.createdAt, locale)}</p></div></article>)}{!events.length && <p>{common.labels.empty}</p>}</div></section>
    <section className="admin-panel"><div className="admin-panel-heading"><h2><Bell size={17} />{common.nav.notifications}</h2><Link href={`/${locale}/admin/notifications`} aria-label={common.nav.notifications}><ArrowUpRight size={18} /></Link></div><div className="admin-event-list">{notifications.map(row => <article key={String(row.id)}><span className="admin-event-dot" /><div><strong>{label(row.type) || row.title}</strong><p>{common.statuses[row.message as keyof typeof common.statuses] || row.message}</p></div></article>)}{!notifications.length && <p>{text.shell.noNotifications}</p>}</div></section></div>;
}
