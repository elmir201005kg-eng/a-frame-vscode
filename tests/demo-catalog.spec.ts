import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { addDays, bishkekToday } from "../lib/stay-dates";

const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "";
if (process.env.QA_DEMO_CATALOG !== "true" || process.env.QA_SCHEMA !== schema || !/^aframe_showcase_qa_[a-f0-9]{12}$/.test(schema))
  throw new Error("Run npm run test:demo-catalog for an isolated database.");
const pool = new Pool({ connectionString: connection.toString() });
const base = `http://localhost:${process.env.E2E_PORT || 3138}`;
const cabins = [
  ["demo-a-frame-ala-too", "A-Frame Ala-Too"], ["demo-black-diamond", "Black Diamond"],
  ["demo-sky-house", "Sky House"], ["demo-mountain-view", "Mountain View"],
  ["demo-pine-forest", "Pine Forest"], ["demo-alpine-luxury", "Alpine Luxury"],
  ["demo-nomad-house", "Nomad House"], ["demo-lake-paradise", "Lake Paradise"],
] as const;
let admin: string, guest: string;
test.beforeAll(async () => {
  admin = (await pool.query(`INSERT INTO "${schema}".users(email,first_name,role,updated_at) VALUES('admin@showcase-qa.invalid','Showcase Admin','ADMIN',NOW()) RETURNING id`)).rows[0].id;
  guest = (await pool.query(`SELECT id FROM "${schema}".users WHERE email='guest@qa.invalid'`)).rows[0].id;
});
test.afterAll(() => pool.end());
async function session(context: BrowserContext, userId: string, administrator = false) {
  const token = randomBytes(32).toString("hex");
  await pool.query(`INSERT INTO "${schema}".sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',$3)`,
    [createHash("sha256").update(token).digest("hex"), userId, administrator ? new Date() : null]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: base, httpOnly: true, sameSite: "Lax" }]);
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
}

for (const locale of ["ru", "kg", "en"] as const) {
  test(`${locale}: anonymous visitors can open all eight complete demo detail pages`, async ({ page, context }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    expect((await context.cookies()).filter(cookie => cookie.name === "a-frame-session")).toHaveLength(0);
    await page.goto(`/${locale}/catalog?q=DEMO-`);
    await expect(page.locator(".catalog-page-count")).toContainText("8");
    await expect(page.locator(".cabin-card")).toHaveCount(6);
    await expect(page.locator(".cabin-card .cabin-photo-label")).toHaveCount(6);
    const rules = { ru: "Тихие часы", kg: "Тынчтык убактысы", en: "Quiet hours" };
    for (const [index, [slug, title]] of cabins.entries()) {
      const response = await page.goto(`/${locale}/cabins/${slug}`);
      expect(response?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
      await expect(page.locator(".property-rules > li")).toHaveCount(5);
      await expect(page.locator(".property-rules")).toContainText(rules[locale]);
      await expect(page.locator(".property-facts > span")).toHaveCount(4);
      await expect(page.locator(".property-detail-section .property-amenities > span")).toHaveCount(5);
      await expect(page.locator(".property-description")).not.toBeEmpty();
      await expect(page.locator(".property-address")).toContainText(`DEMO-${String(index + 1).padStart(2, "0")}`);
      await expect(page.locator(".property-rule-times")).toContainText("14:00");
      await expect(page.locator(".property-rule-times")).toContainText("11:00");
      await expect(page.locator(".property-gallery .cabin-photo-label")).toBeVisible();
      await expect(page.locator(".property-gallery-thumbs button")).toHaveCount(3);
      await expect(page.locator(".property-photo-credits summary")).toBeVisible();
      await expect(page.locator(".property-photo-credits li")).toHaveCount(3);
      await expect(page.locator(".property-gallery-main img")).toBeVisible();
      await expect.poll(() => page.locator(".property-gallery-main img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
      await expect(page.locator(".stay-selector .product-notice")).toBeVisible();
      await expect(page.locator(".stay-selector form, .stay-selector button, a[href*='/booking?']")).toHaveCount(0);
    }
    expect(errors).toEqual([]);
  });
}

test("catalog form submits search; combined filters, sorting and pagination show matching cabins", async ({ page }) => {
  await page.goto("/en/catalog");
  const form = page.locator(".catalog-page-layout form").first();
  await form.locator('input[name="q"]').fill("Sky House");
  await form.locator('button[type="submit"]').click();
  await expect(page.locator(".cabin-card")).toHaveCount(1);
  await expect(page.locator(".cabin-card .cabin-title")).toHaveText("Sky House");
  await page.goto("/en/catalog?region=issyk-kul&guests=4&minPrice=6000&maxPrice=12000&amenity=wifi&amenity=heating&sort=priceAsc");
  await expect(page.locator(".catalog-page-count")).toContainText("2");
  await expect(page.locator(".cabin-card .cabin-title")).toHaveText(["Black Diamond", "Lake Paradise"]);
  await page.goto("/en/catalog?q=DEMO-&sort=priceAsc");
  await expect(page.locator(".cabin-card .cabin-title").first()).toHaveText("Nomad House");
  await page.goto("/en/catalog?q=DEMO-&page=2");
  await expect(page.locator(".cabin-card")).toHaveCount(2);
  await expect(page.locator(".catalog-page-count")).toContainText("8");
  expect((await page.locator(".cabin-card .cabin-title").allTextContents()).sort()).toEqual(["A-Frame Ala-Too", "Black Diamond"]);
  await page.goto("/en/catalog?region=osh&minPrice=14000");
  await expect(page.locator(".cabin-card")).toHaveCount(0);
});

test("anonymous catalog retains previously published demos alongside the eight additions", async ({ page }) => {
  await page.goto("/en/catalog");
  await expect(page.locator(".catalog-page-count")).toContainText("11");
  for (const title of ["Existing legacy demo", "Former seed concept"]) {
    await page.goto(`/en/catalog?q=${encodeURIComponent(title)}`);
    await expect(page.locator(".cabin-card")).toHaveCount(1);
    await expect(page.locator(".cabin-card .cabin-title")).toHaveText(title);
    await page.locator(".cabin-card .cabin-title").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator(".stay-selector .product-notice")).toBeVisible();
  }
});

for (const locale of ["ru", "kg", "en"] as const) {
  test(`${locale}: cards and galleries fit narrow phones and desktop screens`, async ({ page }, testInfo) => {
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/catalog?q=DEMO-`);
      await expect(page.locator(".cabin-card")).toHaveCount(6);
      await noOverflow(page);
      for (const card of await page.locator(".cabin-card").all()) {
        const box = await card.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
        expect(box!.width).toBeGreaterThan(220);
      }
      if (locale === "ru" && width !== 320)
        await page.screenshot({ path: testInfo.outputPath(`catalog-${width}.png`), fullPage: true });
      await page.goto(`/${locale}/cabins/demo-nomad-house`);
      await expect(page.locator(".property-gallery-main img")).toBeVisible();
      await noOverflow(page);
      await page.locator(".property-gallery-thumbs button").nth(1).click();
      await expect(page.locator(".property-gallery-thumbs button").nth(1)).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(".property-gallery-main img")).toHaveAttribute("src", /demo-interior-timber/);
      if (locale === "ru" && width === 390)
        await page.screenshot({ path: testInfo.outputPath("cabin-mobile.png"), fullPage: true });
    }
  });
}

test("admin saves demo copy and price without losing translated rules, addresses or booking protection", async ({ page, context }) => {
  await session(context, admin, true);
  await page.goto("/ru/admin/cabins");
  await expect(page.locator(".admin-record")).toHaveCount(11);
  await page.goto("/ru/admin/cabins?status=ARCHIVED");
  await expect(page.locator(".admin-record")).toHaveCount(0);
  await page.goto("/en/admin/cabins?q=Sky%20House&status=PUBLISHED");
  await expect(page.locator(".admin-record")).toHaveCount(1);
  await expect(page.locator(".admin-record")).toContainText("Sky House");
  await expect(page.locator(".admin-record")).toContainText(/demo/i);
  const id = (await pool.query(`SELECT id FROM "${schema}".cabins WHERE slug='demo-sky-house'`)).rows[0].id;
  const translations = async () => (await pool.query(`SELECT c.title_kg,c.description_kg,c.description_en,c.is_demo,c.is_bookable,
    l.city_kg,l.city_en,l.village_kg,l.village_en,l.address_kg,l.address_en FROM "${schema}".cabins c
    JOIN "${schema}".locations l ON l.id=c.location_id WHERE c.id=$1`, [id])).rows[0];
  const rules = async () => (await pool.query(`SELECT * FROM "${schema}".cabin_rules WHERE cabin_id=$1 ORDER BY id`, [id])).rows;
  const before = await translations(), beforeRules = await rules();
  const edit = async (title: string, price: string) => {
    await page.goto(`/en/admin/cabins?edit=${id}`);
    await page.locator("#cabin-editor details.translation-fields summary").first().click();
    await page.locator('#cabin-editor input[name="titleEn"]').fill(title);
    await page.locator('#cabin-editor input[name="price"]').fill(price);
    await expect(page.locator('#cabin-editor input[name="isDemo"]')).toBeChecked();
    await page.locator('#cabin-editor button[type="submit"]').click();
    await expect.poll(async () => (await pool.query(`SELECT title_en,price_per_night::text AS price FROM "${schema}".cabins WHERE id=$1`, [id])).rows[0])
      .toEqual({ title_en: title, price: `${price}.00` });
    await page.reload();
  };
  await edit("Sky House · QA", "7250");
  await expect(page.locator('#cabin-editor input[name="titleEn"]')).toHaveValue("Sky House · QA");
  expect(await translations()).toEqual(before);
  expect(await rules()).toEqual(beforeRules);
  await page.goto("/en/cabins/demo-sky-house");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sky House · QA");
  await expect(page.locator(".stay-price")).toContainText("7,250");
  await expect(page.locator(".stay-selector .product-notice")).toBeVisible();
  await expect(page.locator(".stay-selector button")).toHaveCount(0);
  await edit("Sky House", "6500");
  await page.goto("/en/admin/cabins?q=Sky%20House&status=DRAFT");
  await expect(page.locator(".admin-record")).toHaveCount(0);
});

test("checkout, availability and historical payment controls cannot book display-only demos", async ({ page, context }) => {
  await session(context, guest);
  await page.goto("/en/booking?cabin=demo-a-frame-ala-too");
  await expect(page.locator(".product-notice")).toContainText("booking, payment and real stays are unavailable");
  await expect(page.locator(".booking-form")).toHaveCount(0);
  const id = (await pool.query(`SELECT id FROM "${schema}".cabins WHERE slug='demo-a-frame-ala-too'`)).rows[0].id;
  const checkIn = addDays(bishkekToday(), 40), checkOut = addDays(checkIn, 2);
  const response = await context.request.get(`/api/availability?cabinId=${id}&checkIn=${checkIn}&checkOut=${checkOut}&guests=2`);
  expect(response.status()).toBe(400);
  expect(await response.json()).toEqual({ code: "cabinNotBookable" });
  expect((await pool.query(`SELECT COUNT(*)::int AS total FROM "${schema}".bookings WHERE cabin_id=$1`, [id])).rows[0].total).toBe(0);
  expect((await pool.query(`SELECT COUNT(*)::int AS total FROM "${schema}".payments`)).rows[0].total).toBe(0);
  const history = (await pool.query(`SELECT id FROM "${schema}".bookings WHERE booking_number='DEMO-QA-HISTORY'`)).rows[0].id;
  await page.goto(`/en/bookings/${history}?payment=failed`);
  await expect(page.locator(".product-notice").first()).toContainText("booking, payment and real stays are unavailable");
  await expect(page.locator(".booking-details-layout aside button")).toHaveCount(0);
});
