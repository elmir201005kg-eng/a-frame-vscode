import { Suspense, type ReactNode } from "react";
import type { Metadata } from "@/server/types";
import { routeLocale } from "@/lib/route";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import type { AdminDictionary } from "@/app/i18n/admin";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { AdminShell } from "@/components/admin-shell";
import { AdminSkeleton } from "@/components/admin-skeleton";
import "./admin.css";

export const instant = false;
export const metadata: Metadata = { title: "Admin · A-FRAME KG", robots: { index: false, follow: false } };

async function ProtectedAdmin({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await routeLocale(params), user = await requireAdmin(locale);
  const [text, common, landing, notifications, unread] = await Promise.all([
    translated<AdminDictionary>(locale, "admin"), translated<CommonDictionary>(locale, "common"), translated<LandingDictionary>(locale, "landing"),
    db.notification.findMany({ where: { userId: user.id, isRead: false }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 5, select: { id: true, title: true, type: true, message: true, bookingId: true } }),
    db.notification.count({ where: { userId: user.id, isRead: false } }),
  ]);
  return <AdminShell locale={locale} text={text} common={common} language={landing.language}
    name={[user.firstName, user.lastName].filter(Boolean).join(" ")} unread={unread}
    notifications={notifications.map(row => ({ id: row.id.toString(), title: common.events[row.type.replace(/\.([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof typeof common.events] || row.title, message: common.statuses[row.message as keyof typeof common.statuses] || row.message, href: row.bookingId ? `/${locale}/admin/bookings?bookingId=${row.bookingId.toString()}` : `/${locale}/admin/notifications` }))}>{children}</AdminShell>;
}

export default function AdminLayout(props: { children: ReactNode; params: Promise<{ locale: string }> }) {
  return <Suspense fallback={<AdminSkeleton shell />}><ProtectedAdmin {...props} /></Suspense>;
}
