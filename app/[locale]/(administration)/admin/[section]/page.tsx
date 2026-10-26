import { ResourceUnavailable } from "@/components/resource-unavailable";
import { redirect } from "@/server/navigation";

import { routeLocale } from "@/lib/route";
import { adminSections, type AdminSection } from "@/lib/admin-navigation";
import { AdminContent } from "@/components/admin-content";
import { AdminSectionNavigation } from "@/components/admin-section-navigation";
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
  const query = await searchParams;
  if (section === "support" || section === "activities") {
    const target = section === "support" ? "messages" : "audit";
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (typeof value === "string") params.append(key, value);
      else if (Array.isArray(value)) value.forEach(item => params.append(key, item));
    }
    const suffix = params.size ? `?${params}` : "";
    redirect(`/${locale}/admin/${target}${suffix}`);
  }
  return (
    <>
      <AdminSectionNavigation locale={locale} section={section as AdminSection} />
      <AdminContent locale={locale} section={section as AdminSection} query={query} />
    </>
  );
}
