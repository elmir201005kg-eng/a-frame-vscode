import type { PrismaClient } from "../generated/prisma/client";
import { demoCabins } from "./demo-cabins";
import { demoAmenityNames, demoRegions, demoRules } from "./demo-cabin-details";

export const demoEmail = "showcase-owner@demo.a-frame.invalid";
export const demoBusiness = "A-FRAME KG · DEMO";
export class SeedConflict extends Error {}

export async function seedDemoCabins(db: PrismaClient, { dryRun = false } = {}) {
  const schema = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).searchParams.get("schema") || "public" : "public";
  // Keep the existing production lock, while independent test schemas do not
  // serialize each other's seed transactions on the same PostgreSQL database.
  const lockKey = schema === "public" ? "a-frame-demo-seed" : `a-frame-demo-seed:${schema}`;
  if (demoCabins.length !== 8 || new Set(demoCabins.map(item => item.slug)).size !== 8)
    throw new SeedConflict("The demo collection must contain exactly 8 unique slugs.");
  if (demoCabins.some(item => item.photos.length < 3 || item.photos.length > 5 || new Set(item.photos).size !== item.photos.length))
    throw new SeedConflict("Every demo cabin must have 3–5 distinct photos.");
  return db.$transaction(async tx => {
    // One transaction and a shared lock make retries and concurrent runs safe.
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}))::text`;
    let user = await tx.user.findUnique({ where: { email: demoEmail }, include: { ownerProfile: true } });
    if (user && (user.role !== "OWNER" || !user.isActive || user.ownerProfile?.businessName !== demoBusiness ||
      user.ownerProfile.verificationStatus !== "VERIFIED" ||
      await tx.cabin.count({ where: { ownerId: user.ownerProfile.id, isDemo: false } })))
      throw new SeedConflict("Reserved demo owner conflicts with existing data. Nothing was changed.");
    const present = await tx.cabin.findMany({ where: { slug: { in: demoCabins.map(item => item.slug) } },
      include: { location: { include: { _count: { select: { cabins: true } } } }, amenities: true, rules: true } });
    for (const cabin of present) {
      if (!cabin.isDemo || cabin.ownerId !== user?.ownerProfile?.id || cabin.location._count.cabins !== 1)
        throw new SeedConflict(`Reserved demo slug or location conflicts with existing data: ${cabin.slug}. Nothing was changed.`);
    }
    // Reference data is inserted only when missing; disabled or conflicting rows are never reactivated/renamed.
    const regions = new Map<string, number>(), amenities = new Map<string, number>();
    for (const [slug, name, nameKg, nameEn] of demoRegions) {
      let row = await tx.region.findFirst({ where: { OR: [{ slug }, { name }] } });
      if (row && (row.slug !== slug || !row.isActive))
        throw new SeedConflict(`Region conflicts with the demo collection: ${slug}. Nothing was changed.`);
      if (!row && !dryRun) row = await tx.region.create({ data: { slug, name, nameKg, nameEn } });
      if (row) regions.set(slug, row.id);
    }
    for (const [slug, name, nameKg, nameEn] of demoAmenityNames) {
      let row = await tx.amenity.findFirst({ where: { OR: [{ slug }, { name }] } });
      if (row && (row.slug !== slug || !row.isActive))
        throw new SeedConflict(`Amenity conflicts with the demo collection: ${slug}. Nothing was changed.`);
      if (!row && !dryRun) row = await tx.amenity.create({ data: { slug, name, nameKg, nameEn } });
      if (row) amenities.set(slug, row.id);
    }
    if (dryRun) return { created: 0, wouldCreate: demoCabins.length - present.length, existing: present.length, enriched: 0, dryRun: true };
    if (!user) user = await tx.user.create({ data: {
      // Reserved .invalid address, no password, no external identity or reusable credentials.
      email: demoEmail, firstName: demoBusiness, phone: "DEMO", role: "OWNER", passwordHash: null,
      ownerProfile: { create: { businessName: demoBusiness, verificationStatus: "VERIFIED" } },
    }, include: { ownerProfile: true } });
    const ownerId = user.ownerProfile!.id;
    let created = 0, enriched = 0;
    for (const item of demoCabins) {
      const existing = present.find(row => row.slug === item.slug);
      const settlement = item.city
        ? { city: item.settlement[0], cityKg: item.settlement[1], cityEn: item.settlement[2] }
        : { village: item.settlement[0], villageKg: item.settlement[1], villageEn: item.settlement[2] };
      const rules = demoRules.map(rule => ({ title: rule.title[0], titleKg: rule.title[1], titleEn: rule.title[2],
        description: rule.description[0], descriptionKg: rule.description[1], descriptionEn: rule.description[2] }));
      if (!existing) {
        await tx.cabin.create({ data: {
          owner: { connect: { id: ownerId } }, slug: item.slug, isDemo: true, isBookable: false, status: "PUBLISHED",
          title: item.title[0], titleKg: item.title[1], titleEn: item.title[2],
          description: item.description[0], descriptionKg: item.description[1], descriptionEn: item.description[2],
          pricePerNight: item.price, maxGuests: item.guests, bedrooms: item.bedrooms, beds: item.beds, bathrooms: item.bathrooms,
          checkInTime: item.checkInTime, checkOutTime: item.checkOutTime, cancellationHours: 0,
          location: { create: { regionId: regions.get(item.region)!, ...settlement,
            address: item.address[0], addressKg: item.address[1], addressEn: item.address[2] } },
          amenities: { create: item.amenities.map(slug => ({ amenityId: amenities.get(slug)! })) },
          rules: { create: rules },
          images: { create: item.photos.map((name, index) => ({ imageUrl: "/images/" + name,
            altText: `${item.title[0]} · DEMO`, isMain: index === 0, sortOrder: index })) },
        } });
        created++;
        continue;
      }
      // Complete old seed-owned concepts without replacing edited copy, prices, photos or history.
      let changed = false;
      if (existing.isBookable) {
        await tx.cabin.update({ where: { id: existing.id }, data: { isBookable: false } });
        changed = true;
      }
      const location = existing.location;
      const address = location.address === demoBusiness || location.address === item.address[0]
        ? { address: item.address[0], addressKg: location.addressKg || item.address[1], addressEn: location.addressEn || item.address[2] } : {};
      const place = !location.city && !location.village ? settlement : {};
      if (Object.entries({ ...address, ...place }).some(([key, value]) => location[key as keyof typeof location] !== value)) {
        await tx.location.update({ where: { id: location.id }, data: { ...address, ...place } });
        changed = true;
      }
      const missingAmenities = item.amenities.map(slug => amenities.get(slug)!).filter(id => !existing.amenities.some(row => row.amenityId === id));
      if (missingAmenities.length) {
        await tx.cabinAmenity.createMany({ data: missingAmenities.map(amenityId => ({ cabinId: existing.id, amenityId })) });
        changed = true;
      }
      const missingRules = rules.filter(rule => !existing.rules.some(row => row.title === rule.title));
      if (missingRules.length) {
        await tx.cabinRule.createMany({ data: missingRules.map(rule => ({ cabinId: existing.id, ...rule })) });
        changed = true;
      }
      if (changed) enriched++;
    }
    // Existing cabins outside these eight slugs keep their publication status,
    // booking settings and complete history, including previous demo collections.
    return { created, existing: present.length, enriched, dryRun: false };
  }, { maxWait: 15000, timeout: 180000 });
}
