import { cachedPublic } from "@/server/cache";
import "server-only";
import { cache } from "react";
import type { Locale } from "@/app/i18n/config";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { fail, stay } from "@/lib/validation";
import { demoModeEnabled } from "@/lib/demo";

export function publicCabinWhere(extra: Prisma.CabinWhereInput = {}): Prisma.CabinWhereInput {
  return {
    AND: [
      {
        status: "PUBLISHED",
        owner: { verificationStatus: "VERIFIED", user: { isActive: true, role: "OWNER" } },
        location: { region: { isActive: true } },
        ...(!demoModeEnabled() ? { isDemo: false } : {}),
      },
      extra,
    ],
  };
}

export const cabinInclude = {
  location: { include: { region: true } },
  images: { orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }] },
  amenities: { include: { amenity: true } },
  categories: { where: { category: { isActive: true } }, include: { category: true } },
  rules: { where: { isActive: true } },
  owner: { include: { user: { select: { firstName: true, lastName: true, isActive: true } } } },
} satisfies Prisma.CabinInclude;
export type CabinRecord = Prisma.CabinGetPayload<{ include: typeof cabinInclude }>;
export const cabinCardSelect = {
  id: true, slug: true, title: true, titleKg: true, titleEn: true,
  description: true, descriptionKg: true, descriptionEn: true,
  pricePerNight: true, maxGuests: true, bedrooms: true, rating: true, reviewsCount: true, isDemo: true,
  location: { select: { city: true, village: true, region: { select: { name: true, nameKg: true, nameEn: true } } } },
  images: { select: { id: true, imageUrl: true, altText: true }, orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }], take: 1 },
  amenities: { where: { amenity: { isActive: true } }, select: { amenityId: true, amenity: { select: { name: true, nameKg: true, nameEn: true, slug: true } } }, take: 3, orderBy: { amenityId: "asc" } },
} satisfies Prisma.CabinSelect;
export type CabinSummary = ReturnType<typeof cabinCardDto>;
export function cabinCardDto(cabin: Prisma.CabinGetPayload<{ select: typeof cabinCardSelect }>, locale: Locale, favorites: string[] = []) {
  return {
    id: cabin.id.toString(), slug: cabin.slug,
    title: (locale === "kg" ? cabin.titleKg : locale === "en" ? cabin.titleEn : null) || cabin.title,
    description: (locale === "kg" ? cabin.descriptionKg : locale === "en" ? cabin.descriptionEn : null) || cabin.description,
    location: [localizedName(cabin.location.region, locale), cabin.location.city || cabin.location.village].filter(Boolean).join(" · "),
    price: Number(cabin.pricePerNight), maxGuests: cabin.maxGuests, bedrooms: cabin.bedrooms,
    rating: Number(cabin.rating), reviewsCount: cabin.reviewsCount, isDemo: cabin.isDemo,
    images: cabin.images.map(image => ({ id: image.id.toString(), src: image.imageUrl, alt: image.altText || cabin.title })),
    amenities: cabin.amenities.map(item => ({ id: item.amenityId, slug: item.amenity.slug, name: localizedName(item.amenity, locale) })),
    favorite: favorites.includes(cabin.id.toString()),
  };
}
export type SearchParams = Record<string, string | string[] | undefined>;
export const single = (params: SearchParams, name: string) =>
  typeof params[name] === "string" ? (params[name] as string) : "";
export function localizedName(
  value: { name: string; nameKg: string | null; nameEn: string | null },
  locale: Locale,
) {
  return (locale === "kg" ? value.nameKg : locale === "en" ? value.nameEn : null) || value.name;
}
export function cabinDto(cabin: CabinRecord, locale: Locale, favorites: string[] = []) {
  return {
    id: cabin.id.toString(),
    slug: cabin.slug,
    title:
      (locale === "kg" ? cabin.titleKg : locale === "en" ? cabin.titleEn : null) || cabin.title,
    description:
      (locale === "kg" ? cabin.descriptionKg : locale === "en" ? cabin.descriptionEn : null) ||
      cabin.description,
    region: localizedName(cabin.location.region, locale),
    categories: cabin.categories.map(item => ({ id: item.categoryId, name: localizedName(item.category, locale) })),
    regionSlug: cabin.location.region.slug,
    location: [
      localizedName(cabin.location.region, locale),
      cabin.location.city || cabin.location.village,
    ]
      .filter(Boolean)
      .join(" · "),
    address: cabin.location.address,
    price: Number(cabin.pricePerNight),
    maxGuests: cabin.maxGuests,
    bedrooms: cabin.bedrooms,
    beds: cabin.beds,
    bathrooms: cabin.bathrooms,
    rating: Number(cabin.rating),
    reviewsCount: cabin.reviewsCount,
    status: cabin.status,
    isDemo: cabin.isDemo,
    images: cabin.images.map((image) => ({
      id: image.id.toString(),
      src: image.imageUrl,
      alt: image.altText || cabin.title,
    })),
    amenities: cabin.amenities
      .filter((item) => item.amenity.isActive)
      .map((item) => ({
        id: item.amenityId,
        slug: item.amenity.slug,
        name: localizedName(item.amenity, locale),
      })),
    rules: cabin.rules.map((rule) => ({ title: rule.title, description: rule.description })),
    owner: {
      name:
        cabin.owner.businessName ||
        [cabin.owner.user.firstName, cabin.owner.user.lastName].filter(Boolean).join(" "),
      verified: !cabin.isDemo && cabin.owner.verificationStatus === "VERIFIED",
      description: cabin.owner.description,
      contactPhone: cabin.owner.contactPhone,
    },
    checkInTime: cabin.checkInTime,
    checkOutTime: cabin.checkOutTime,
    cancellationHours: cabin.cancellationHours,
    favorite: favorites.includes(cabin.id.toString()),
  };
}
export async function references(locale: Locale) {
  return cachedPublic(`catalog-references:${locale}`, ["catalog-references"], async () => {
    const [regions, amenities] = await Promise.all([
      db.region.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
      db.amenity.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    ]);
    return {
      regions: regions.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: localizedName(row, locale),
      })),
      amenities: amenities.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: localizedName(row, locale),
      })),
    };
  });
}
export const favoriteIds = cache(async (userId?: bigint) => {
  if (!userId) return [];
  return (await db.favorite.findMany({ where: { userId, cabin: publicCabinWhere() }, select: { cabinId: true } })).map((row) =>
    row.cabinId.toString(),
  );
});
export async function featuredCabins(locale: Locale, userId?: bigint) {

  const [rows, saved] = await Promise.all([
    db.cabin.findMany({ where: publicCabinWhere(), select: cabinCardSelect, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 6 }),
    favoriteIds(userId),
  ]);
  return { cabins: rows.map(row => cabinCardDto(row, locale, saved)) };
}
export async function searchCabins(params: SearchParams, locale: Locale, userId?: bigint) {

  const q = single(params, "q").trim().slice(0, 100),
    region = single(params, "region"),
    sort = single(params, "sort");
  const guests = single(params, "guests"),
    min = single(params, "minPrice"),
    max = single(params, "maxPrice");
  const checkIn = single(params, "checkIn"),
    checkOut = single(params, "checkOut");
  const filters: Prisma.CabinWhereInput[] = [
    publicCabinWhere(),
  ];
  if (q)
    filters.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { titleKg: { contains: q, mode: "insensitive" } },
        { titleEn: { contains: q, mode: "insensitive" } },
        {
          location: {
            region: {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { nameKg: { contains: q, mode: "insensitive" } },
                { nameEn: { contains: q, mode: "insensitive" } },
              ],
            },
          },
        },
      ],
    });
  if (region) filters.push({ location: { region: { slug: region } } });
  if (guests) {
    const value = Number(guests);
    if (!Number.isInteger(value) || value < 1 || value > 50) fail("invalidGuests");
    filters.push({ maxGuests: { gte: value } });
  }
  for (const value of [min, max])
    if (value && (!Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1000000))
      fail("invalidPrice");
  if (min && max && Number(min) > Number(max)) fail("invalidPrice");
  if (min || max)
    filters.push({ pricePerNight: { ...(min ? { gte: min } : {}), ...(max ? { lte: max } : {}) } });
  const requested = (Array.isArray(params.amenity) ? params.amenity : [single(params, "amenity")])
    .filter(Boolean)
    .slice(0, 30);
  for (const slug of requested)
    filters.push({ amenities: { some: { amenity: { slug, isActive: true } } } });
  if (checkIn || checkOut) {
    if (!checkIn || !checkOut) fail("invalidDates");
    const range = stay(checkIn, checkOut, guests || 1);
    filters.push({
      bookings: {
        none: {
          status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] },
          checkIn: { lt: range.end },
          checkOut: { gt: range.start },
        },
      },
      availability: {
        none: { date: { gte: range.start, lt: range.end }, status: { in: ["BLOCKED", "BOOKED"] } },
      },
    });
  }
  if (single(params, "favorites") === "1")
    filters.push(userId ? { favorites: { some: { userId } } } : { id: BigInt(-1) });
  const where = { AND: filters };
  const requestedPage = Math.max(1, Number.parseInt(single(params, "page"), 10) || 1);
  const firstReadPage = Number.isSafeInteger(requestedPage) && (requestedPage - 1) * 6 <= 2147483647 ? requestedPage : 1;
  const orderBy: Prisma.CabinOrderByWithRelationInput[] =
    sort === "priceAsc"
      ? [{ pricePerNight: "asc" }, { id: "desc" }]
      : sort === "priceDesc"
        ? [{ pricePerNight: "desc" }, { id: "desc" }]
        : [{ createdAt: "desc" }, { id: "desc" }];
  // Normal pages do not depend on count(). Only an out-of-range URL needs a
  // second read to retain the existing clamp-to-last-page behavior.
  const [total, saved, requestedRows] = await Promise.all([
    db.cabin.count({ where }),
    favoriteIds(userId),
    db.cabin.findMany({ where, select: cabinCardSelect, orderBy, skip: (firstReadPage - 1) * 6, take: 6 }),
  ]);
  const pages = Math.max(1, Math.ceil(total / 6));
  const page = Math.min(pages, requestedPage);
  const rows = page === firstReadPage ? requestedRows
    : await db.cabin.findMany({ where, select: cabinCardSelect, orderBy, skip: (page - 1) * 6, take: 6 });
  return { cabins: rows.map((row) => cabinCardDto(row, locale, saved)), total, page, pages };
}
