import { routeLocale } from "@/lib/route";
import { AdminDashboard } from "@/components/admin-dashboard";
import type { AdminQuery } from "@/lib/admin-period";
export const instant = false;
export default async function AdminPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<AdminQuery> }) {
  return <AdminDashboard locale={await routeLocale(params)} query={await searchParams} />;
}
