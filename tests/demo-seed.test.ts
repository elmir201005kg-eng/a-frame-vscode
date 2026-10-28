import assert from "node:assert/strict";
import { after, test } from "node:test";
import { randomUUID } from "node:crypto";
import { db } from "../lib/db";
import { seedDemoCabins, SeedConflict, demoEmail } from "../prisma/seed-demo-data";
import { demoCabins } from "../prisma/demo-cabins";
import { previewDemoCabins } from "../prisma/demo-preflight";
import { cabinDto, cabinInclude, searchCabins } from "../lib/catalog";
import { createBooking, quoteStay } from "../lib/booking";
import { prepareFinikPayment } from "../lib/finik-payments";
import { addDays, bishkekToday } from "../lib/stay-dates";

const schema = new URL(process.env.DATABASE_URL!).searchParams.get("schema");
if (process.env.QA_DEMO_CATALOG !== "true" || !/^aframe_showcase_qa_[a-f0-9]{12}$/.test(schema || ""))
  throw new Error("Run npm run test:demo-catalog to create an isolated database.");
after(() => db.$disconnect());

// Independent acceptance criteria: changing the seed cannot silently change this list.
const expectedListings = [
  ["demo-a-frame-ala-too", "A-Frame Ala-Too", 5000, "chui"],
  ["demo-black-diamond", "Black Diamond", 8000, "issyk-kul"],
  ["demo-sky-house", "Sky House", 6500, "chui"],
  ["demo-mountain-view", "Mountain View", 7000, "naryn"],
  ["demo-pine-forest", "Pine Forest", 5500, "issyk-kul"],
  ["demo-alpine-luxury", "Alpine Luxury", 12000, "karakol"],
  ["demo-nomad-house", "Nomad House", 4500, "osh"],
  ["demo-lake-paradise", "Lake Paradise", 9000, "issyk-kul"],
] as const;
const demoWhere = { slug: { in: expectedListings.map(([slug]) => slug) } };

test("exactly eight requested demo cabins: additive seed, translations, search and booking protection", async t => {
  const region = await db.region.create({ data: { slug: "qa-real-region", name: "QA real region" } });
  const owner = await db.user.create({ data: { email: "owner@qa.invalid", firstName: "Existing owner", role: "OWNER",
    ownerProfile: { create: { businessName: "Existing business", verificationStatus: "VERIFIED" } } }, include: { ownerProfile: true } });
  const real = await db.cabin.create({ data: {
    slug: "qa-real-cabin", title: "Existing real cabin", description: "Must survive the demo seed", status: "PUBLISHED",
    owner: { connect: { id: owner.ownerProfile!.id } }, location: { create: { regionId: region.id, address: "Existing address" } },
    pricePerNight: 8000, maxGuests: 4,
  } });
  const legacy = await db.cabin.create({ data: {
    slug: "demo-legacy-existing", title: "Existing legacy demo", description: "Existing demo and its history must remain unchanged",
    status: "PUBLISHED", isDemo: true, isBookable: false, pricePerNight: 4000, maxGuests: 2,
    owner: { connect: { id: owner.ownerProfile!.id } }, location: { create: { regionId: region.id, address: "Legacy address" } },
  } });
  const guest = await db.user.create({ data: { email: "guest@qa.invalid", firstName: "Existing guest" } });
  const checkIn = addDays(bishkekToday(), 20), checkOut = addDays(checkIn, 2);
  for (const [index, cabin] of [real, legacy].entries()) await db.booking.create({ data: {
    bookingNumber: `AF-QA-EXISTING-${index}`, userId: guest.id, cabinId: cabin.id,
    checkIn: new Date(`${checkIn}T00:00:00Z`), checkOut: new Date(`${checkOut}T00:00:00Z`), guestsCount: 2,
    guestName: "Existing guest", guestPhone: "+996555123456", pricePerNight: 8000, nights: 2, subtotal: 16000, totalAmount: 16000,
  } });
  const snapshot = async () => ({
    users: await db.user.findMany({ where: { id: { in: [owner.id, guest.id] } }, orderBy: { id: "asc" } }),
    cabins: await db.cabin.findMany({ where: { id: { in: [real.id, legacy.id] } }, orderBy: { id: "asc" } }),
    bookings: await db.booking.findMany({ where: { cabinId: { in: [real.id, legacy.id] } }, orderBy: { id: "asc" } }),
  });
  const original = await snapshot();

  await t.test("dry run makes no writes; the first seed adds exactly eight and repeats make no changes", async () => {
    assert.deepEqual(demoCabins.map(item => [item.slug, item.title[0], item.price, item.region]), expectedListings);
    const preview = await previewDemoCabins(db, schema!);
    assert.equal(preview.wouldCreate, 8); assert.equal(preview.existing, 0); assert.equal(preview.total, 8);
    assert.equal(preview.dryRun, true); assert.equal(preview.changesMade, false);
    assert.equal(preview.existingCabinsWillBePreserved, true); assert.equal(preview.migrationRequired, false);
    assert.deepEqual(preview.missingColumns, []); assert.deepEqual(preview.conflicts, []);
    assert.deepEqual(preview.existingDatabase, { cabins: 2, users: 2, bookings: 2, payments: 0 });
    assert.deepEqual(preview.listings.map(item => [item.slug, item.title, item.price, item.region]), expectedListings);
    assert.deepEqual(await snapshot(), original);
    assert.equal((await seedDemoCabins(db, { dryRun: true })).wouldCreate, 8);
    assert.equal(await db.region.count(), 1);
    assert.equal(await db.user.count(), 2);
    assert.equal(await db.cabin.count(), 2);
    assert.equal((await seedDemoCabins(db)).created, 8);
    const repeatPreview = await previewDemoCabins(db, schema!);
    assert.equal(repeatPreview.wouldCreate, 0); assert.equal(repeatPreview.existing, 8);
    assert.equal(repeatPreview.changesMade, false);
    assert.deepEqual(repeatPreview.existingDatabase, { cabins: 10, users: 3, bookings: 2, payments: 0 });
    const all = await db.cabin.findMany({ include: { location: true, rules: true, amenities: true, images: true }, orderBy: { id: "asc" } });
    assert.deepEqual(await seedDemoCabins(db), { created: 0, existing: 8, enriched: 0, dryRun: false });
    assert.deepEqual(await db.cabin.findMany({ include: { location: true, rules: true, amenities: true, images: true }, orderBy: { id: "asc" } }), all);
    assert.deepEqual(await snapshot(), original);
  });
  await t.test("concurrent seeds do not duplicate cabins, rules, images, locations or owners", async () => {
    const results = await Promise.all([seedDemoCabins(db), seedDemoCabins(db)]);
    assert.ok(results.every(result => result.created === 0 && result.enriched === 0));
    assert.equal(await db.cabin.count({ where: demoWhere }), 8);
    assert.equal(await db.cabin.count(), 10);
    assert.equal(await db.location.count(), 10);
    assert.equal(await db.cabinRule.count(), 40);
    assert.equal(await db.user.count({ where: { email: demoEmail } }), 1);
    assert.deepEqual(await snapshot(), original);
  });
  await t.test("all eight have the requested names, prices, regions, rooms and 3–5 photos in every language", async () => {
    const rows = await db.cabin.findMany({ where: demoWhere, include: cabinInclude });
    assert.equal(rows.length, 8);
    for (const locale of ["ru", "kg", "en"] as const) {
      assert.equal(new Set(rows.map(row => cabinDto(row, locale).title)).size, 8);
      for (const [slug, title, price, regionSlug] of expectedListings) {
        const row = rows.find(row => row.slug === slug)!;
        const item = cabinDto(row, locale);
        assert.equal(item.title, title); assert.equal(item.price, price); assert.equal(item.regionSlug, regionSlug);
        assert.equal(row.status, "PUBLISHED"); assert.equal(row.isDemo, true); assert.equal(row.isBookable, false);
        assert.ok(item.bedrooms > 0 && item.beds > 0 && item.bathrooms > 0 && item.maxGuests >= item.bedrooms);
        assert.equal(item.checkInTime, "14:00"); assert.equal(item.checkOutTime, "11:00");
        assert.equal(item.amenities.length, 5); assert.equal(item.rules.length, 5);
        assert.ok(row.location.city || row.location.village); assert.ok(item.address.includes("DEMO-"));
        assert.ok(item.description.length > 300);
        assert.ok(item.images.length >= 3 && item.images.length <= 5);
        assert.equal(new Set(item.images.map(image => image.src)).size, item.images.length);
        assert.ok(item.rules.every(rule => rule.title && rule.description));
        assert.ok(row.descriptionKg && row.descriptionEn && row.description !== row.descriptionKg && row.description !== row.descriptionEn);
      }
    }
    const alaToo = rows.find(row => row.slug === "demo-a-frame-ala-too")!;
    assert.match(cabinDto(alaToo, "en").location, /Besh-Kungey/);
    assert.match(cabinDto(alaToo, "kg").location, /Беш-Күңгөй/);
    assert.equal(cabinDto(alaToo, "en").rules[0].title, "Demonstration only");
    assert.equal(cabinDto(alaToo, "kg").rules[0].title, "Көрсөтмө үчүн гана");
  });
  await t.test("production search supports all languages, combined filters, sorting and two catalog pages", async () => {
    assert.equal(process.env.DEMO_MODE, "false");
    // The eight additions, the existing published demo and the real fixture remain public.
    assert.equal((await searchCabins({}, "ru")).total, 10);
    assert.equal((await searchCabins({ q: "Existing legacy demo" }, "ru")).total, 1);
    for (const q of ["A-frame ala-too", "Беш-Кунгей", "Беш-Күңгөй", "Besh-Kungey", "DEMO-08"])
      assert.equal((await searchCabins({ q }, "en")).total, 1, q);
    for (const region of new Set(demoCabins.map(item => item.region)))
      assert.equal((await searchCabins({ region }, "ru")).total, demoCabins.filter(item => item.region === region).length);
    const combined = await searchCabins({ region: "issyk-kul", guests: "4", minPrice: "6000", maxPrice: "12000",
      amenity: ["wifi", "kitchen", "heating", "parking", "terrace"], sort: "priceAsc", checkIn, checkOut }, "ru");
    assert.equal(combined.total, 2);
    assert.deepEqual(combined.cabins.map(item => [item.title, item.price]), [["Black Diamond", 8000], ["Lake Paradise", 9000]]);
    const slugs: string[] = [];
    for (let page = 1; page <= 2; page++) {
      const result = await searchCabins({ q: "DEMO-", page: String(page) }, "en");
      assert.equal(result.total, 8); assert.equal(result.pages, 2);
      assert.equal(result.cabins.length, page === 1 ? 6 : 2);
      slugs.push(...result.cabins.map(item => item.slug));
    }
    assert.deepEqual(slugs.sort(), expectedListings.map(([slug]) => slug).sort());
    assert.equal((await searchCabins({ region: "osh", minPrice: "14000" }, "ru")).total, 0);
    assert.equal((await searchCabins({ sort: "priceDesc" }, "en")).cabins[0].price, 12000);
    assert.deepEqual(await snapshot(), original);
  });
  await t.test("all eight reject quotes and bookings even when demo mode is enabled", async () => {
    const cabins = await db.cabin.findMany({ where: demoWhere });
    process.env.DEMO_MODE = "true";
    try {
      for (const cabin of cabins) {
        await assert.rejects(quoteStay(cabin.id, checkIn, checkOut, 2), /cabinNotBookable/);
        await assert.rejects(createBooking({ userId: guest.id, cabinId: cabin.id, checkIn, checkOut, guests: 2,
          guestName: "QA", guestPhone: "+996555123456", guestEmail: guest.email, requestKey: randomUUID() }), /cabinNotBookable/);
        assert.equal(await db.booking.count({ where: { cabinId: cabin.id } }), 0);
      }
      assert.equal(await db.payment.count(), 0);
    } finally { process.env.DEMO_MODE = "false"; }
  });
  await t.test("reruns complete seed-owned records without replacing edited copy, prices or booking history", async () => {
    const cabin = await db.cabin.findUniqueOrThrow({ where: { slug: "demo-black-diamond" } });
    await db.cabin.update({ where: { id: cabin.id }, data: { title: "Edited demo title", pricePerNight: 4900, isBookable: true } });
    await db.location.update({ where: { id: cabin.locationId }, data: { city: null, cityKg: null, cityEn: null,
      address: "A-FRAME KG · DEMO", addressKg: null, addressEn: null } });
    await db.cabinRule.deleteMany({ where: { cabinId: cabin.id } });
    await db.cabinAmenity.deleteMany({ where: { cabinId: cabin.id } });
    const history = await db.booking.create({ data: {
      bookingNumber: "DEMO-QA-HISTORY", userId: guest.id, cabinId: cabin.id,
      checkIn: new Date(`${checkIn}T00:00:00Z`), checkOut: new Date(`${checkOut}T00:00:00Z`), guestsCount: 2,
      guestName: "Existing guest", guestPhone: "+996555123456", pricePerNight: 4500, nights: 2, subtotal: 9000, totalAmount: 9000,
    } });
    assert.equal((await seedDemoCabins(db)).enriched, 1);
    const completed = await db.cabin.findUniqueOrThrow({ where: { id: cabin.id }, include: cabinInclude });
    assert.equal(completed.title, "Edited demo title"); assert.equal(Number(completed.pricePerNight), 4900);
    assert.equal(completed.isBookable, false); assert.equal(completed.amenities.length, 5); assert.equal(completed.rules.length, 5);
    assert.ok(completed.location.cityEn);
    await assert.rejects(prepareFinikPayment(guest.id, history.id), /cabinNotBookable/);
    assert.deepEqual(await db.booking.findUnique({ where: { id: history.id } }), history);
    assert.equal(await db.payment.count(), 0);
    assert.deepEqual(await snapshot(), original);
    await db.cabin.update({ where: { id: cabin.id }, data: { title: cabin.title, pricePerNight: cabin.pricePerNight } });
  });
  await t.test("a conflicting slug rolls back the transaction without touching unrelated records", async () => {
    const demo = await db.cabin.findUniqueOrThrow({ where: { slug: "demo-a-frame-ala-too" } });
    await db.cabin.update({ where: { id: demo.id }, data: { slug: "qa-temporarily-renamed" } });
    await db.cabin.update({ where: { id: real.id }, data: { slug: demo.slug, updatedAt: real.updatedAt } });
    const before = await snapshot();
    await assert.rejects(seedDemoCabins(db), SeedConflict);
    assert.deepEqual(await snapshot(), before);
    assert.equal(await db.cabin.count(), 10);
    await db.cabin.update({ where: { id: real.id }, data: { slug: real.slug, updatedAt: real.updatedAt } });
    await db.cabin.update({ where: { id: demo.id }, data: { slug: demo.slug } });
  });
  await t.test("disabled references are preserved and block a partial seed", async () => {
    const region = await db.region.findUniqueOrThrow({ where: { slug: "chui" } });
    await db.region.update({ where: { id: region.id }, data: { isActive: false } });
    await assert.rejects(seedDemoCabins(db), SeedConflict);
    assert.equal((await db.region.findUniqueOrThrow({ where: { id: region.id } })).isActive, false);
    assert.equal(await db.cabin.count(), 10);
    await db.region.update({ where: { id: region.id }, data: { isActive: true } });
    assert.deepEqual(await snapshot(), original);
  });
  await t.test("former seed-owned demos stay published and their historical bookings remain unchanged", async () => {
    const showcaseOwner = await db.user.findUniqueOrThrow({ where: { email: demoEmail }, include: { ownerProfile: true } });
    const previous = await db.cabin.create({ data: {
      slug: "demo-kol-nur", title: "Former seed concept", description: "Keep this record and its history",
      status: "PUBLISHED", isDemo: true, isBookable: false, pricePerNight: 4500, maxGuests: 2,
      owner: { connect: { id: showcaseOwner.ownerProfile!.id } },
      location: { create: { regionId: region.id, address: "Historical demo address" } },
    } });
    const history = await db.booking.create({ data: {
      bookingNumber: "DEMO-QA-PREVIOUS", userId: guest.id, cabinId: previous.id,
      checkIn: new Date(`${checkIn}T00:00:00Z`), checkOut: new Date(`${checkOut}T00:00:00Z`), guestsCount: 2,
      guestName: "Existing guest", guestPhone: "+996555123456", pricePerNight: 4500, nights: 2, subtotal: 9000, totalAmount: 9000,
    } });
    assert.equal((await seedDemoCabins(db, { dryRun: true })).wouldCreate, 0);
    assert.deepEqual(await seedDemoCabins(db), { created: 0, existing: 8, enriched: 0, dryRun: false });
    assert.deepEqual(await db.cabin.findUniqueOrThrow({ where: { id: previous.id } }), previous);
    assert.deepEqual(await db.booking.findUnique({ where: { id: history.id } }), history);
    assert.equal((await searchCabins({ q: "Former seed concept" }, "en")).total, 1);
    assert.equal((await searchCabins({}, "en")).total, 11);
    assert.equal(await db.cabin.count(), 11);
    assert.deepEqual(await snapshot(), original);
  });
});
