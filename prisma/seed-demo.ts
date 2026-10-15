import "dotenv/config";
import { access } from "node:fs/promises";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { hashPassword } from "../lib/password";
import { demoCabins } from "./demo-cabins";

const demoEmail = "showcase-owner@demo.a-frame.invalid";
const demoBusiness = "A-FRAME KG · DEMO";
const connection = new URL(process.env.DATABASE_URL!);
if (connection.searchParams.get("sslmode") === "require") connection.searchParams.set("sslmode", "verify-full");
const schema = connection.searchParams.get("schema") || "public";
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: connection.toString() }, { schema }) });
class SeedConflict extends Error {}

async function main() {
  for (const name of new Set(demoCabins.flatMap(cabin => cabin.photos))) {
    await access(path.join(process.cwd(), "public", "images", name));
  }
  // This synthetic owner has no published or reusable login credentials.
  const passwordHash = await hashPassword(randomBytes(48).toString("hex"));
  const result = await db.$transaction(async tx => {
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext('a-frame-demo-seed'))::text`;
    let user = await tx.user.findUnique({ where: { email: demoEmail }, include: { ownerProfile: true } });
    if (user && (user.role !== "OWNER" || user.ownerProfile?.businessName !== demoBusiness ||
      await tx.cabin.count({ where: { ownerId: user.ownerProfile.id, isDemo: false } }))) {
      throw new SeedConflict("Reserved demo owner conflicts with existing data. Nothing was changed.");
    }
    if (!user) user = await tx.user.create({ data: {
      email: demoEmail, firstName: "A-FRAME KG · DEMO", phone: "DEMO", role: "OWNER", passwordHash,
      ownerProfile: { create: { businessName: demoBusiness, verificationStatus: "VERIFIED" } },
    }, include: { ownerProfile: true } });
    const ownerId = user.ownerProfile!.id;
    let created = 0, existing = 0;
    for (const item of demoCabins) {
      const present = await tx.cabin.findUnique({ where: { slug: item.slug } });
      if (present) {
        if (!present.isDemo || present.ownerId !== ownerId)
          throw new SeedConflict("A demo slug conflicts with existing data. Nothing was changed.");
        existing++;
        continue;
      }
      const region = await tx.region.findUnique({ where: { slug: item.region } });
      if (!region?.isActive) throw new SeedConflict("Run db:seed first and ensure the demo regions are active.");
      const amenities = await tx.amenity.findMany({ where: { slug: { in: item.amenities }, isActive: true } });
      if (amenities.length !== item.amenities.length) throw new SeedConflict("Run db:seed first and ensure amenities are active.");
      await tx.cabin.create({ data: {
        owner: { connect: { id: ownerId } }, slug: item.slug, isDemo: true, status: "PUBLISHED",
        title: item.title[0], titleKg: item.title[1], titleEn: item.title[2],
        description: item.description[0], descriptionKg: item.description[1], descriptionEn: item.description[2],
        pricePerNight: item.price, maxGuests: item.guests, bedrooms: item.bedrooms, beds: item.guests,
        cancellationHours: 0,
        location: { create: { regionId: region.id, address: "A-FRAME KG · DEMO" } },
        amenities: { create: amenities.map(amenity => ({ amenityId: amenity.id })) },
        images: { create: item.photos.map((name, index) => ({
          imageUrl: "/images/" + name, altText: "A-FRAME KG · DEMO", isMain: index === 0, sortOrder: index,
        })) },
      } });
      created++;
    }
    return { created, existing };
  }, { maxWait: 15000, timeout: 90000 });
  console.log(JSON.stringify({ ...result, total: demoCabins.length, demo: true }));
}
main().catch(error => {
  console.error(error instanceof SeedConflict ? error.message : "Demo seed failed. Check database settings, migrations and local images.");
  process.exitCode = 1;
}).finally(() => db.$disconnect());
