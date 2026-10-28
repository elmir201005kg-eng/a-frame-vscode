import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";

test.skip(!process.env.QA_SCHEMA, "Run through the QA runner with an isolated database schema.");
test.use({ screenshot: "only-on-failure" });
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (!/^aframe_qa_[a-f0-9]{12}$/.test(schema) || schema !== process.env.QA_SCHEMA) throw new Error("Isolated QA schema required");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
test.afterAll(async () => { await pool.end(); });

async function session(context: BrowserContext, userId: string) {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',NOW())", [createHash("sha256").update(token).digest("hex"), userId]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: `http://localhost:${process.env.E2E_PORT || 3107}`, httpOnly: true, sameSite: "Lax" }]);
}

async function fitsViewport(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const layout = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    viewport: innerWidth,
    offenders: [...document.querySelectorAll("body *")].filter(element => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1) && getComputedStyle(element).position !== "absolute";
    }).slice(0, 8).map(element => `${element.tagName}.${element.className}`),
  }));
  expect(layout.width, `Overflow on ${page.url()}: ${layout.offenders.join(", ")}`).toBeLessThanOrEqual(layout.viewport + 1);
}

async function contained(page: Page, selector: string) {
  const box = await page.locator(selector).boundingBox();
  expect(box, selector).not.toBeNull();
  expect(box!.x, selector).toBeGreaterThanOrEqual(-1);
  expect(box!.y, selector).toBeGreaterThanOrEqual(-1);
  expect(box!.x + box!.width, selector).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  expect(box!.y + box!.height, selector).toBeLessThanOrEqual(page.viewportSize()!.height + 1);
}

for (const locale of ["ru", "kg", "en"]) {
  for (const width of locale === "ru" ? [320, 375, 768, 1024, 1440] : [320, 768, 1280]) {
    test(`responsive public pages: ${locale} ${width}px`, async ({ page }, testInfo) => {
      test.setTimeout(180000);
      await page.setViewportSize({ width, height: 844 });
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      for (const route of ["", "/catalog", "/cabins/qa-cabin-1", "/destinations", "/how-it-works", "/portfolio", "/login", "/register", "/admin-login", "/privacy", "/terms"]) {
        await page.goto(`/${locale}${route}`);
        await expect(page.locator("h1").first()).toBeVisible();
        await fitsViewport(page);
        if (await page.locator(".site-header").count()) {
          const brand = await page.locator(".site-header .brand").boundingBox();
          const actions = await page.locator(".site-header .header-actions").boundingBox();
          expect(brand!.x + brand!.width).toBeLessThanOrEqual(actions!.x + 1);
          expect(actions!.x + actions!.width).toBeLessThanOrEqual(width + 1);
        }
        if (route === "/cabins/qa-cabin-1" && width <= 1023) {
          const columns = await page.locator(".property-detail-layout").evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length);
          expect(columns).toBe(1);
        }
        if (locale === "ru" && [320, 768, 1440].includes(width) && ["", "/catalog", "/cabins/qa-cabin-1"].includes(route)) {
          await page.screenshot({ path: testInfo.outputPath(`${route ? route.split("/").pop() : "home"}-${width}.png`), fullPage: true, animations: "disabled" });
        }
      }
      expect(errors).toEqual([]);
    });
  }
}

test("responsive navigation closes on selection and resizing; mobile filters remain usable", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/ru");
  const menu = page.locator(".mobile-menu-button");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await contained(page, "#mobile-navigation");
  await page.locator("#mobile-navigation a[href='/ru/portfolio']").click();
  await expect(page).toHaveURL(/\/ru\/portfolio$/);
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await menu.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await expect(page.locator(".desktop-nav")).toBeVisible();
  await page.setViewportSize({ width: 320, height: 667 });
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await page.goto("/ru/catalog");
  await page.locator(".catalog-filter-toggle").click();
  await expect(page.locator(".catalog-filters-content")).toBeVisible();
  await fitsViewport(page);
  await page.locator(".catalog-filters-content .premium-select-trigger").first().click();
  await contained(page, ".premium-select-content");
  await page.keyboard.press("Escape");
  await page.locator(".catalog-filters-content .premium-date-trigger").first().click();
  await contained(page, ".premium-calendar-popover");
  await page.keyboard.press("Escape");
});

test("responsive photo viewer and assistant fit a short landscape viewport", async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto("/ru/portfolio");
  await page.locator(".portfolio-photo").first().click();
  await expect(page.locator(".photo-viewer")).toBeVisible();
  await contained(page, ".photo-viewer");
  await contained(page, ".photo-viewer-toolbar button");
  await contained(page, ".photo-viewer-caption");
  const stage = await page.locator(".photo-viewer-stage").boundingBox();
  expect(stage!.height).toBeGreaterThan(80);
  await page.keyboard.press("Escape");
  await expect(page.locator(".photo-viewer")).toHaveCount(0);
  await page.locator(".af-ai-launcher").click();
  await expect(page.locator(".af-ai-panel")).toBeVisible();
  await contained(page, ".af-ai-panel");
  await contained(page, ".af-ai-composer");
});

test("responsive account, checkout and owner editor fit phones and tablets", async ({ page, context }) => {
  test.setTimeout(120000);
  await session(context, process.env.QA_OWNER_ID!);
  for (const width of [320, 375, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/ru/account?tab=profile", "/ru/account?tab=payments", "/ru/owner", "/ru/owner/cabins/new", "/ru/booking?cabin=qa-cabin-1"]) {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible();
      await fitsViewport(page);
      if (width <= 1023 && route.includes("booking?")) {
        expect(await page.locator(".checkout-layout").evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length)).toBe(1);
      }
    }
  }
});

test("responsive admin dashboard, forms and drawer fit phones and tablets", async ({ page, context }, testInfo) => {
  test.setTimeout(120000);
  await session(context, process.env.QA_ADMIN_ID!);
  for (const width of [320, 375, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/ru/admin", "/ru/admin/calendar", "/ru/admin/cabins", "/ru/admin/settings"]) {
      await page.goto(route);
      await expect(page.locator(".admin-shell")).toBeVisible();
      await fitsViewport(page);
    }
    if (width < 1024) {
      const trigger = page.locator(".admin-mobile-menu");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await contained(page, ".admin-drawer");
      expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
      await page.keyboard.press("Escape");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
    }
    if ([320, 768, 1440].includes(width)) {
      await page.goto("/ru/admin");
      await page.screenshot({ path: testInfo.outputPath(`admin-${width}.png`), fullPage: true, animations: "disabled" });
    }
  }
  await page.setViewportSize({ width: 375, height: 667 });
  await page.locator(".admin-mobile-menu").click();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.locator(".admin-drawer")).not.toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
});
