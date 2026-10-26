import { AdminCabins } from "@/components/admin-cabins";
import { AdminReservations } from "@/components/admin-reservations";
import { AdminCalendar } from "@/components/admin-calendar";
import { AdminTaxonomy } from "@/components/admin-taxonomy";
import { AdminPeople, AdminAudit } from "@/components/admin-people";
import { AdminSettings } from "@/components/admin-settings";
import { AdminCommunications } from "@/components/admin-communications";
import { AdminDashboard } from "@/components/admin-dashboard";
import { requireAdmin } from "@/lib/auth";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import type { AdminDictionary } from "@/app/i18n/admin";
import type { AdminSection } from "@/lib/admin-navigation";
import type { AdminQuery } from "@/lib/admin-period";
import type { Locale } from "@/app/i18n/config";

export const workspaceSections = ["cabins", "bookings", "payments", "calendar", "categories", "promotions", "users", "audit", "settings", "messages", "notifications", "analytics"] as const;
export async function AdminWorkspace({ locale, section, query }: { locale: Locale; section: AdminSection; query: AdminQuery }) {
  const user = await requireAdmin(locale);
  const [common, text] = await Promise.all([translated<CommonDictionary>(locale, "common"), translated<AdminDictionary>(locale, "admin")]);
  const ctx = { locale, common, text, query, user };
  switch (section) {
    case "cabins": return <AdminCabins ctx={ctx} />;
    case "bookings": return <AdminReservations ctx={ctx} />;
    case "payments": return <AdminReservations ctx={ctx} payments />;
    case "calendar": return <AdminCalendar ctx={ctx} />;
    case "categories": return <AdminTaxonomy ctx={ctx} />;
    case "promotions": return <AdminTaxonomy ctx={ctx} promotions />;
    case "users": return <AdminPeople ctx={ctx} />;
    case "audit": return <AdminAudit ctx={ctx} />;
    case "settings": return <AdminSettings ctx={ctx} />;
    case "messages": return <AdminCommunications ctx={ctx} messages />;
    case "notifications": return <AdminCommunications ctx={ctx} />;
    case "analytics": return <AdminDashboard locale={locale} query={query} analytics />;
  }
  return null;
}
