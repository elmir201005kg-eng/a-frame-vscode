import type { Metadata } from "@/server/types";
import Link from "@/components/navigation-link";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { PageHeading, EmptyState } from "@/components/product-ui";
import { translated, type CommonDictionary } from "@/app/i18n/platform";
import { galleryMessages } from "@/app/i18n/gallery";
import { portfolioPhotos } from "@/lib/portfolio";
import { isDatabaseUnavailable } from "@/lib/db-errors";
import { routeLocale } from "@/lib/route";

export const instant = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = await routeLocale(params);
  const text = galleryMessages[locale];
  return { title: `${text.title} — A-FRAME KG`, description: text.description };
}

export default async function PortfolioPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await routeLocale(params);
  const text = galleryMessages[locale];
  const [common, photos] = await Promise.all([
    translated<CommonDictionary>(locale, "common"),
    portfolioPhotos(locale).catch((error: unknown) => {
      if (!isDatabaseUnavailable(error)) throw error;
      return null;
    }),
  ]);
  return <>
    <PageHeading text={text} />
    {photos?.length ? <PortfolioGallery photos={photos} locale={locale} demoLabel={common.labels.demo} /> : (
      <EmptyState common={common} title={photos ? text.empty : common.errors.serverError}>
        {photos && <p>{text.emptyHint}</p>}
        <Link className="button button-outline" href={`/${locale}/catalog`}>{common.labels.backCatalog}</Link>
      </EmptyState>
    )}
  </>;
}
