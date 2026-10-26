import type { Metadata } from "@/server/types";
import Link from "@/components/navigation-link";
import { BookingSteps } from "@/components/landing-sections";
import { PageHeading } from "@/components/product-ui";
import { Icon } from "@/components/icon";
import type { LandingDictionary } from "@/app/i18n/dictionaries";
import { translated } from "@/app/i18n/platform";
import { routeLocale } from "@/lib/route";

export const instant = false;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await routeLocale(params);
  const dictionary = await translated<LandingDictionary>(locale, "landing");
  return {
    title: `${dictionary.header.howItWorks} — A-FRAME KG`,
    description: dictionary.how.description,
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const locale = await routeLocale(params);
  const dictionary = await translated<LandingDictionary>(locale, "landing");

  return (
    <section id="how-it-works" aria-label={dictionary.header.howItWorks}>
      <PageHeading text={{
        title: dictionary.header.howItWorks,
        eyebrow: dictionary.how.eyebrow,
        description: dictionary.how.description,
      }} />
      <BookingSteps how={dictionary.how} headingLevel={2} />
      <div className="catalog-more">
        <Link className="button button-primary" href={`/${locale}/catalog`}>
          {dictionary.hero.action}
          <Icon name="arrow-up-right" size={19} />
        </Link>
      </div>
    </section>
  );
}
