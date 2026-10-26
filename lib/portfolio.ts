import "server-only";
import type { Locale } from "@/app/i18n/config";
import { db } from "@/lib/db";
import { localizedName, publicCabinWhere } from "@/lib/catalog";

export async function portfolioPhotos(locale: Locale) {

  const cabins = await db.cabin.findMany({
    where: publicCabinWhere({ images: { some: {} } }),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: 60,
    select: {
      slug: true, title: true, titleKg: true, titleEn: true, isDemo: true,
      location: { select: { region: { select: { slug: true, name: true, nameKg: true, nameEn: true } } } },
      images: {
        select: { id: true, imageUrl: true, altText: true },
        orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
        take: 6,
      },
    },
  });
  return cabins.flatMap(cabin => {
    const title = (locale === "kg" ? cabin.titleKg : locale === "en" ? cabin.titleEn : null) || cabin.title;
    return cabin.images.map(image => ({
      id: image.id.toString(), src: image.imageUrl, alt: image.altText || title,
      title, slug: cabin.slug, isDemo: cabin.isDemo,
      region: localizedName(cabin.location.region, locale), regionSlug: cabin.location.region.slug,
    }));
  });
}

export type PortfolioPhoto = Awaited<ReturnType<typeof portfolioPhotos>>[number];
