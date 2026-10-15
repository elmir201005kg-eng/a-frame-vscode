import { ResourceUnavailable } from "@/components/resource-unavailable";

import { routeLocale } from "@/lib/route";
import { adminSections, type AdminSection } from "@/lib/admin-navigation";
import { AdminContent } from "@/components/admin-content";
export const instant = false;
export default async function AdminSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; section: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const locale = await routeLocale(params),
    section = (await params).section;
  if (!adminSections.includes(section as AdminSection))
    return <ResourceUnavailable locale={locale} />;
  return (
    <AdminContent locale={locale} section={section as AdminSection} query={await searchParams} />
  );
}
