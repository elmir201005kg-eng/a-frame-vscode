import type { Metadata } from "@/server/types";
import { DestinationGrid } from "@/components/landing-sections";
import { PageHeading } from "@/components/product-ui";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { translated } from "@/app/i18n/platform";
import { routeLocale } from "@/lib/route";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await routeLocale(params);
  const dictionary = await translated<LandingDictionary>(locale, "landing");
  return {
    title: `${dictionary.header.destinations} — A-FRAME KG`,
    description: dictionary.destinationsSection.description,
  };
}

export default async function DestinationsPage({ params }: Props) {
  const locale = await routeLocale(params);
  const dictionary = await translated<LandingDictionary>(locale, "landing");

  return (
    <section id="destinations" aria-label={dictionary.header.destinations}>
      <PageHeading text={{
        title: dictionary.header.destinations,
        eyebrow: dictionary.destinationsSection.eyebrow,
        description: dictionary.destinationsSection.description,
      }} />
      <DestinationGrid locale={locale} dictionary={dictionary} headingLevel={2} />
    </section>
  );
}
