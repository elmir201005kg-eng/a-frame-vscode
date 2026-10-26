import { test, expect, type Page } from "@playwright/test";
import { pwaText } from "../../lib/pwa";
import { locales } from "../../app/i18n/config";

async function ready(page: Page, locale = "ru") {
  await page.goto(`/${locale}/offline`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect.poll(() => page.evaluate(async () => {
    const name = (await caches.keys()).find(name => name.startsWith("a-frame-pwa-"));
    return name ? (await (await caches.open(name)).match("/__pwa_locale"))?.text() : null;
  })).toBe(locale);
}

test("manifest, icons and worker headers support installation", async ({ page, request }) => {
  await page.goto("/ru/offline");
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0b120f");
  const manifestResponse = await request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest).toMatchObject({ name: "A-FRAME KG", display: "standalone", start_url: "/", scope: "/" });
  for (const icon of manifest.icons) {
    const response = await request.get(icon.src);
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
    const png = await response.body();
    const size = Number(icon.sizes.split("x")[0]);
    expect(png.readUInt32BE(16)).toBe(size);
    expect(png.readUInt32BE(20)).toBe(size);
  }
  const worker = await request.get(process.env.VITE_PWA_WORKER_PATH || "/sw.js");
  expect(worker.headers()["cache-control"]).toContain("no-store");
  expect(worker.headers()["service-worker-allowed"]).toBe("/");
  expect(await worker.text()).not.toContain("__PWA_VERSION__");
});

for (const locale of locales) {
  test(`home, images, styles and interactions work offline in ${locale}`, async ({ page, context }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await ready(page);
    await context.setOffline(true);
    // This language has not been opened before; installation caches all locales.
    await page.goto(`/${locale}?pwa-test=1`);
    await expect(page.locator("#hero-title")).toBeVisible();
    await expect(page.locator("#offline-title")).toHaveText(pwaText[locale].offline);
    await expect(page.locator(".search-submit")).toBeDisabled();
    await expect(page.locator("#destinations-title")).toBeAttached();
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(11, 18, 15)");
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator(".hero-image, .story-photo img, .destination-card img, .brand-mark").evaluateAll(images =>
      images.every(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0)
    )).toBe(true);
    await expect.poll(() => page.evaluate(() => {
      const family = getComputedStyle(document.body).fontFamily.split(",")[0];
      return Array.from(document.fonts).some(font => font.status === "loaded" && font.family.replaceAll('"', "") === family.replaceAll('"', "")) && document.fonts.check(`400 14px ${family}`);
    })).toBe(true);
    await page.locator(".faq-item summary").first().click();
    await expect(page.locator(".faq-item").first()).toHaveAttribute("open", "");
    await page.locator(".footer-back-top").click();
    await expect(page).toHaveURL(/#top$/);
    await page.reload();
    await expect(page.locator("#hero-title")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("offline app launch remembers the language and private routes use the public home", async ({ page, context }) => {
  await ready(page, "en");
  await context.setOffline(true);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await page.goto("/ru/account?tab=bookings");
  await expect(page.locator("#offline-title")).toHaveText(pwaText.ru.offline);
  await expect(page.locator("#hero-title")).toBeVisible();
  await page.locator(".desktop-nav").getByRole("link", { name: "Домики", exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/catalog$/);
  await expect(page.locator("#hero-title")).toBeVisible();
  const keys = await page.evaluate(async () => {
    const result: string[] = [];
    for (const name of await caches.keys()) {
      if (name.startsWith("a-frame-pwa-")) result.push(...(await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname));
    }
    return result;
  });
  expect(keys.some(key => key.startsWith("/api/") || /\/(account|bookings|admin|owner|login)(\/|$)/.test(key))).toBe(false);
});

test("offline language switching performs a working document navigation", async ({ page, context }) => {
  await ready(page);
  await context.setOffline(true);
  await page.goto("/ru");
  await page.locator(".language-switcher .premium-select-trigger").click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator("#offline-title")).toHaveText(pwaText.en.offline);
});

test("online pages remain available after the connection returns", async ({ page, context }) => {
  await ready(page);
  await context.setOffline(true);
  await page.goto("/ru");
  await expect(page.locator("#offline-title")).toBeVisible();
  await context.setOffline(false);
  await page.getByRole("button", { name: pwaText.ru.retry, exact: true }).click();
  await expect(page.locator("#hero-title")).toBeVisible();
  await expect(page.locator("[data-offline-page]")).toHaveCount(0);
  await expect(page.locator("#offline-title")).toHaveCount(0);
});

test("mobile offline home fits narrow screens and its menu works", async ({ page, context }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await ready(page);
  await context.setOffline(true);
  await page.goto("/ru");
  await expect(page.locator("#offline-title")).toBeVisible();
  await page.locator(".mobile-menu-button").click();
  await expect(page.locator(".mobile-navigation")).toBeVisible();
  await page.locator(".mobile-navigation").getByRole("link", { name: "Направления", exact: true }).click();
  await expect(page.locator("#destinations-title")).toBeInViewport();
  await expect(page.locator(".mobile-navigation")).toHaveCount(0);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: testInfo.outputPath("offline-mobile.png"), fullPage: false });
});
