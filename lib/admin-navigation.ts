export const adminSections = [
  "dashboard",
  "analytics",
  "categories",
  "calendar",
  "promotions",
  "messages",
  "audit",
  "cabins",
  "regions",
  "amenities",
  "users",
  "owners",
  "bookings",
  "payments",
  "reviews",
  "activities",
  "notifications",
  "support",
  "translations",
  "settings",
] as const;
export type AdminSection = (typeof adminSections)[number];

export const adminNavigation = [
  { section: "dashboard", sections: ["dashboard", "analytics"] },
  { section: "cabins", sections: ["cabins", "reviews", "promotions", "categories", "regions", "amenities"] },
  { section: "bookings", sections: ["bookings", "calendar"] },
  { section: "payments", sections: ["payments"] },
  { section: "users", sections: ["users", "messages"] },
  { section: "owners", sections: ["owners"] },
  { section: "settings", sections: ["settings", "translations", "audit"] },
] as const satisfies readonly { section: AdminSection; sections: readonly AdminSection[] }[];

export type AdminPrimarySection = (typeof adminNavigation)[number]["section"];

export function adminNavigationGroup(section: string) {
  return adminNavigation.find(group => (group.sections as readonly string[]).includes(section));
}

export function adminParentSection(section: string): AdminPrimarySection {
  const canonical = section === "activities" ? "audit" : section === "support" ? "messages" : section;
  return adminNavigationGroup(canonical)?.section ?? (section === "notifications" ? "settings" : "dashboard");
}

export function adminSectionFromPathname(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const index = segments.indexOf("admin");
  return index >= 0 ? segments[index + 1] || "dashboard" : "dashboard";
}

export function adminSectionHref(locale: string, section: string) {
  return `/${locale}/admin${section === "dashboard" ? "" : `/${section}`}`;
}
