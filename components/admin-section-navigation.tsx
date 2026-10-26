import Link from "@/components/navigation-link";
import type { Locale } from "@/app/i18n/config";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import { adminNavigationGroup, adminSectionHref, type AdminSection } from "@/lib/admin-navigation";

export async function AdminSectionNavigation({ locale, section }: { locale: Locale; section: AdminSection }) {
  const group = adminNavigationGroup(section);
  if (!group || group.sections.length < 2) return null;
  const common = await translated<CommonDictionary>(locale, "common");
  return (
    <nav className="admin-section-navigation" aria-label={`${common.nav.admin}: ${common.nav[group.section]}`}>
      {group.sections.map(key => (
        <Link key={key} href={adminSectionHref(locale, key)} aria-current={key === section ? "page" : undefined}>
          {key === "dashboard" ? common.nav.home : common.nav[key]}
        </Link>
      ))}
    </nav>
  );
}
