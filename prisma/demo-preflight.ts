import { Prisma, type PrismaClient } from "../generated/prisma/client";
import { demoCabins } from "./demo-cabins";
import { demoBusiness, demoEmail, SeedConflict } from "./seed-demo-data";

// Uses only SELECT inside a read-only transaction, including before the
// additive showcase migration has been applied to the existing database.
export async function previewDemoCabins(db: PrismaClient, schema: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new SeedConflict("Invalid database schema.");
  if (demoCabins.length !== 8 || new Set(demoCabins.map(item => item.slug)).size !== 8)
    throw new SeedConflict("The demo collection must contain exactly 8 unique slugs.");
  const table = (name: string) => Prisma.raw(`"${schema}"."${name}"`);
  return db.$transaction(async tx => {
    await tx.$executeRaw`SET TRANSACTION READ ONLY`;
    const required = {
      cabins: ["is_bookable"],
      locations: ["city_kg", "city_en", "village_kg", "village_en", "address_kg", "address_en"],
      cabin_rules: ["title_kg", "title_en", "description_kg", "description_en"],
    };
    const columns = await tx.$queryRaw<{ table_name: string; column_name: string }[]>`
      SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = ${schema}`;
    const missingColumns = Object.entries(required).flatMap(([name, names]) =>
      names.filter(column => !columns.some(row => row.table_name === name && row.column_name === column))
        .map(column => `${name}.${column}`));
    const [counts] = await tx.$queryRaw<{ cabins: number; users: number; bookings: number; payments: number }[]>`
      SELECT (SELECT COUNT(*)::int FROM ${table("cabins")}) AS cabins,
        (SELECT COUNT(*)::int FROM ${table("users")}) AS users,
        (SELECT COUNT(*)::int FROM ${table("bookings")}) AS bookings,
        (SELECT COUNT(*)::int FROM ${table("payments")}) AS payments`;
    const present = await tx.$queryRaw<{ slug: string; is_demo: boolean; owner_id: bigint }[]>`
      SELECT slug, is_demo, owner_id FROM ${table("cabins")}
      WHERE slug IN (${Prisma.join(demoCabins.map(item => item.slug))})`;
    const owner = await tx.user.findUnique({ where: { email: demoEmail }, include: { ownerProfile: true } });
    const conflicts: string[] = [];
    if (owner && (owner.role !== "OWNER" || !owner.isActive || owner.ownerProfile?.businessName !== demoBusiness ||
      owner.ownerProfile.verificationStatus !== "VERIFIED" ||
      await tx.cabin.count({ where: { ownerId: owner.ownerProfile.id, isDemo: false } })))
      conflicts.push("The reserved demo owner conflicts with existing data.");
    for (const cabin of present)
      if (!cabin.is_demo || cabin.owner_id !== owner?.ownerProfile?.id)
        conflicts.push(`Reserved demo slug conflicts with existing data: ${cabin.slug}`);
    return {
      dryRun: true, changesMade: false, total: 8, wouldCreate: 8 - present.length, existing: present.length,
      existingCabinsWillBePreserved: true,
      existingDatabase: counts, migrationRequired: missingColumns.length > 0, missingColumns, conflicts,
      listings: demoCabins.map(item => ({ slug: item.slug, title: item.title[0], region: item.region,
        price: item.price, guests: item.guests, bedrooms: item.bedrooms, beds: item.beds,
        bathrooms: item.bathrooms, photos: item.photos.length, demo: true, bookable: false })),
    };
  }, { isolationLevel: "RepeatableRead", maxWait: 15000, timeout: 30000 });
}
