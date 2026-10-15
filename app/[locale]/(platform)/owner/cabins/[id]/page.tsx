import { ResourceUnavailable } from "@/components/resource-unavailable";

import { routeLocale } from "@/lib/route";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { references, cabinInclude } from "@/lib/catalog";
import { id } from "@/lib/validation";
import { pageDictionaries } from "@/app/i18n/platform";
import { PageHeading } from "@/components/product-ui";
import { OwnerCabinEditor } from "@/components/owner-cabin-editor";

export const instant = false;
export default async function OwnerCabinPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const locale = await routeLocale(params),
    raw = (await params).id,
    user = await requireUser(locale, `/${locale}/owner/cabins/${raw}`);
  if (user.role !== "OWNER" || !user.ownerProfile) return <ResourceUnavailable locale={locale} />;
  let cabinId: bigint;
  try {
    cabinId = id(raw);
  } catch {
    return <ResourceUnavailable locale={locale} />;
  }
  const [cabin, { common, text }, refs] = await Promise.all([
    db.cabin.findFirst({
      where: { id: cabinId, ownerId: user.ownerProfile.id },
      include: cabinInclude,
    }),
    pageDictionaries(locale, "owner-cabin"),
    references(locale),
  ]);
  if (!cabin) return <ResourceUnavailable locale={locale} />;
  return (
    <>
      <PageHeading text={{ ...text, title: cabin.title }} />
      <OwnerCabinEditor cabin={cabin} locale={locale} common={common} refs={refs} />
    </>
  );
}
