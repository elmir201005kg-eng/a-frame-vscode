import { test, expect } from "@playwright/test";

test.skip(!process.env.QA_SCHEMA, "Use the QA runner with an isolated database schema.");

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`navigation visibility: hidden-document animation abort preserves client navigation (${reducedMotion})`, async ({ page }) => {
    const errors: string[] = [];
    let documents = 0;
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => {
      if (message.type() === "error" && /InvalidStateError|Document hidden/i.test(message.text())) errors.push(message.text());
    });
    page.on("request", request => {
      if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++;
    });
    await page.emulateMedia({ reducedMotion });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript(() => {
      // Reproduce the browser's hidden-document failure deterministically,
      // including when a Suspense boundary reveals after the initial load.
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: () => {
          const ready = Promise.reject(new DOMException("Transition was aborted because of invalid state. Document hidden", "InvalidStateError"));
          return { ready, finished: ready.catch(() => {}), updateCallbackDone: Promise.resolve(), types: new Set(), skipTransition() {} };
        },
      });
    });

    await page.goto("/ru");
    await expect(page.locator(".hero")).toBeVisible();
    await expect(page.locator(".cabins-section .cabin-card")).toHaveCount(6);
    expect(errors).toEqual([]);
    const initialDocuments = documents;

    await page.locator(".desktop-nav a[href='/ru/catalog']:visible").click();
    await expect(page).toHaveURL(/\/ru\/catalog$/);
    await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(6);
    await page.locator(".desktop-nav a[href='/ru/portfolio']:visible").click();
    await expect(page).toHaveURL(/\/ru\/portfolio$/);
    await expect(page.locator(".portfolio-photo").first()).toBeVisible();
    await page.locator(".footer-legal a[href='/ru/privacy']:visible").click();
    await expect(page).toHaveURL(/\/ru\/privacy$/);
    await expect(page.locator(".information-page:visible")).toHaveCount(1);
    await page.locator(".footer-legal a[href='/ru/terms']:visible").click();
    await expect(page).toHaveURL(/\/ru\/terms$/);
    await expect(page.locator(".information-page:visible")).toHaveCount(1);
    await page.locator(".desktop-nav a[href='/ru']:visible").click();
    await expect(page).toHaveURL(/\/ru$/);
    await expect(page.locator(".hero:visible")).toBeVisible();
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));

    expect(documents).toBe(initialDocuments);
    expect(errors).toEqual([]);
  });
}
