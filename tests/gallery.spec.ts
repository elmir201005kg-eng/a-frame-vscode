import { test, expect } from "@playwright/test";
import { Pool } from "pg";
import { galleryMessages } from "../app/i18n/gallery";

test.skip(!process.env.QA_SCHEMA, "Use the QA runner with an isolated database schema.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });

async function finishAnimations(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    await Promise.all(document.getAnimations().filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {})));
  });
}

test.beforeAll(async () => {
  if (!/^aframe_qa_[a-f0-9]{12}$/.test(schema) || schema !== process.env.QA_SCHEMA) throw new Error("Isolated QA schema required");
  if ((await pool.query("SELECT 1 FROM regions WHERE slug='qa-portfolio-region'")).rowCount) return;
  const region = (await pool.query("INSERT INTO regions(name,slug,name_kg,name_en) VALUES('Portfolio Test Region','qa-portfolio-region','Portfolio Test Region','Portfolio Test Region') RETURNING id")).rows[0].id;
  const location = (await pool.query("INSERT INTO locations(region_id,address) VALUES($1,'QA Gallery') RETURNING id", [region])).rows[0].id;
  const owner = (await pool.query("SELECT id FROM owner_profiles WHERE user_id=$1", [process.env.QA_OWNER_ID])).rows[0].id;
  for (const status of ["PUBLISHED", "DRAFT"]) {
    const slug = status === "PUBLISHED" ? "qa-portfolio-cabin" : "qa-portfolio-draft";
    const title = status === "PUBLISHED" ? "Portfolio Test Cabin" : "Unpublished Gallery Cabin";
    const cabin = (await pool.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,price_per_night,max_guests,status,updated_at) VALUES($1,$2,$3,$4,'QA gallery',2000,4,$5,NOW()) RETURNING id", [owner, location, title, slug, status])).rows[0].id;
    await pool.query("INSERT INTO cabin_images(cabin_id,image_url,is_main) VALUES($1,'/images/hero.webp',true)", [cabin]);
  }
  await pool.query("INSERT INTO cabin_images(cabin_id,image_url,sort_order) SELECT id,'/images/story.webp',1 FROM cabins WHERE slug='qa-cabin-1'");
});
test.afterAll(async () => { await pool.end(); });

test("gallery: portfolio filters published photos and supports keyboard viewing", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/ru/portfolio");
  await expect(page.locator(".portfolio-card")).toHaveCount(10);
  await expect(page.getByText("Unpublished Gallery Cabin")).toHaveCount(0);
  const filter = page.getByRole("button", { name: "Portfolio Test Region", exact: true });
  await filter.click();
  await expect(filter).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".portfolio-card")).toHaveCount(1);
  await expect(page.locator(".portfolio-count")).toHaveText("Фотографий: 1");
  await page.getByRole("button", { name: galleryMessages.ru.all, exact: true }).click();
  const trigger = page.locator(".portfolio-photo").first();
  await trigger.click();
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  await expect(viewer.locator("[aria-live]")).toHaveText("1 / 10");
  await page.keyboard.press("ArrowLeft");
  await expect(viewer.locator("[aria-live]")).toHaveText("10 / 10");
  await page.keyboard.press("ArrowRight");
  await expect(viewer.locator("[aria-live]")).toHaveText("1 / 10");
  await page.keyboard.press("Escape");
  await expect(viewer).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.click();
  await viewer.getByRole("link", { name: galleryMessages.ru.viewCabin }).click();
  await expect(page).toHaveURL(/\/ru\/cabins\/qa-portfolio-cabin$/);
  expect(errors).toEqual([]);
});

test("gallery: cabin viewer changes photos and restores scrolling", async ({ page }) => {
  await page.goto("/ru/cabins/qa-cabin-1");
  await page.locator(".property-gallery-open").click();
  const viewer = page.getByRole("dialog");
  await expect(viewer).toBeVisible();
  await viewer.getByRole("button", { name: galleryMessages.ru.next, exact: true }).click();
  await expect(viewer.locator("img")).toHaveAttribute("src", /story/);
  await viewer.getByRole("button", { name: galleryMessages.ru.close, exact: true }).click();
  await expect(viewer).toHaveCount(0);
  await expect(page.locator(".property-gallery-main img")).toHaveAttribute("src", /story/);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});

test("gallery: a related cabin starts with its own first photo during client navigation", async ({ page }) => {
  let documents = 0;
  page.on("request", request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
  });
  await page.goto("/ru/cabins/qa-cabin-1");
  await page.locator(".property-gallery-thumbs button").nth(1).click();
  await expect(page.locator(".property-gallery-main img")).toHaveAttribute("src", /story/);
  const initialDocuments = documents;
  const related = page.locator(".similar-cabins .cabin-title").first();
  const href = await related.getAttribute("href");
  await related.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator(".property-gallery-main img")).toHaveAttribute("src", /hero/);
  await expect(page.locator(".property-gallery-open")).toContainText("1 / 1");
  expect(documents).toBe(initialDocuments);
});

test("gallery: localized pages and legal footer fit phone, tablet and desktop", async ({ page }, testInfo) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of ["ru", "kg", "en"] as const) {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/portfolio`);
      await expect(page.getByRole("heading", { level: 1, name: galleryMessages[locale].title })).toBeVisible();
      await expect(page.locator(`.footer-legal a[href='/${locale}/privacy']`)).toBeVisible();
      await expect(page.locator(`.footer-legal a[href='/${locale}/terms']`)).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (locale === "ru" && width !== 768) {
        await finishAnimations(page);
        await page.screenshot({ path: testInfo.outputPath(`portfolio-${width}.png`), animations: "disabled" });
      }
      await page.locator(".portfolio-photo").first().click();
      await expect(page.getByRole("dialog")).toBeVisible();
      const image = page.getByRole("dialog").locator("img");
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
      if (width === 320) expect((await page.getByRole("dialog").boundingBox())!.height).toBeLessThan(630);
      if (locale === "ru" && width !== 768) {
        await finishAnimations(page);
        await page.screenshot({ path: testInfo.outputPath(`gallery-${width}.png`), animations: "disabled" });
      }
      await page.keyboard.press("Escape");
    }
    await page.locator(`.footer-legal a[href='/${locale}/privacy']`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/privacy$`));
    await expect(page.locator(".information-page:visible")).toHaveCount(1);
    await page.locator(`.footer-legal a[href='/${locale}/terms']`).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/terms$`));
    await expect(page.locator(".information-page:visible")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test("gallery: catalog shows the applied filter count and resets results", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ru/catalog?region=issyk-kul&minPrice=1500");
  await expect(page.locator(".active-filter-chip")).toHaveCount(2);
  await expect(page.locator(".catalog-filter-toggle .catalog-filter-count")).toHaveText("2");
  await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(4);
  await page.locator(".catalog-filter-toggle").click();
  await page.locator(".catalog-reset").click();
  await expect(page).toHaveURL(/\/ru\/catalog$/);
  await expect(page.locator(".active-filter-chip")).toHaveCount(0);
  await expect(page.locator(".catalog-filter-count")).toHaveCount(0);
  await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(6);
});
