import { ResourceUnavailable } from "@/components/resource-unavailable";

import { routeLocale } from "@/lib/route";
import { requireUser } from "@/lib/auth";
import { references } from "@/lib/catalog";
import { pageDictionaries } from "@/app/i18n/platform";
import { PageHeading } from "@/components/product-ui";
import { OwnerCabinEditor } from "@/components/owner-cabin-editor";

export const instant = false;
export default async function NewCabinPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await routeLocale(params),
    user = await requireUser(locale, `/${locale}/owner/cabins/new`);
  if (user.role !== "OWNER" || !user.ownerProfile) return <ResourceUnavailable locale={locale} />;
  const [{ common, text }, refs] = await Promise.all([
    pageDictionaries(locale, "owner-cabin"),
    references(locale),
  ]);
  return (
    <>
      <PageHeading text={{ ...text, title: common.labels.addCabin }} />
      <OwnerCabinEditor locale={locale} common={common} refs={refs} />
    </>
  );
}
