import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import ru from "../app/i18n/locales/ru/common.json";
import { chooseOption, chooseRange, setGuests } from "./form-controls";
import { FINIK_PAYMENT_METHOD } from "../lib/finik-config";

// These data-dependent regressions need explicit fixtures in an isolated schema.
test.skip(!process.env.QA_SCHEMA, "Set QA_SCHEMA and fixture IDs in the isolated E2E database.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error("Invalid test schema");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
test.afterAll(async () => { await pool.end(); });

function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && /hydration|hydrated|did not match|maximum update depth/i.test(message.text())) errors.push(message.text()); });
  return errors;
}
async function session(context: BrowserContext, userId: string) {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',NOW())", [createHash("sha256").update(token).digest("hex"), userId]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: `http://localhost:${process.env.E2E_PORT || 3107}`, httpOnly: true, sameSite: "Lax" }]);
}

test("search, pagination, cabin, language and brand preserve client navigation", async ({ page }) => {
  const errors = monitor(page);
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.goto("/ru");
  await chooseOption(page, page.locator(".search-form .premium-select-trigger"), "Иссык-Куль");
  const before = documents;
  await page.locator(".search-submit").click();
  await expect(page).toHaveURL(/\/ru\/catalog\?region=issyk-kul/);
  await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(6);
  await page.locator(".product-pagination").getByRole("link", { name: ru.labels.next }).click();
  await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(2);
  await page.locator(".catalog-page-results .card-details").first().click();
  await expect(page.locator(".stay-selector")).toBeVisible();
  await chooseOption(page, page.locator(".site-header .language-switcher .premium-select-trigger:visible"), "English", "EN");
  await expect(page).toHaveURL(/\/en\/cabins\/qa-cabin-/);
  await page.locator(".site-header .brand:visible").click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.locator(".hero:visible")).toBeVisible();
  expect(documents).toBe(before);
  expect(errors).toEqual([]);
});

test("availability cancels old dates, recovers from a network error, and loads calendar on demand", async ({ page }) => {
  const errors = monitor(page);
  await page.goto("/ru/cabins/qa-cabin-1");
  const form = page.locator(".stay-selector");
  await expect(form).toBeVisible();
  await expect(page.locator(".availability-calendar")).toHaveCount(0);
  await page.locator(".stay-calendar summary").click();
  await expect(page.locator(".availability-calendar")).toBeVisible();
  const day = new Date(); day.setUTCDate(day.getUTCDate() + 40);
  const start = day.toISOString().slice(0,10); day.setUTCDate(day.getUTCDate()+2);
  const end = day.toISOString().slice(0,10);
  await chooseRange(page, form, start, end);
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/availability?**", async route => { await held; await route.continue().catch(() => {}); });
  const check = form.getByRole("button", { name: ru.labels.confirmAvailability });
  await check.click();
  await expect(form.locator("button[aria-busy='true'] .ui-spinner")).toBeVisible();
  await expect(form.locator("button[aria-busy='true']")).toBeDisabled();
  await setGuests(page, form, "2");
  release();
  await page.unroute("**/api/availability?**");
  await expect(form.locator(".stay-total")).toHaveCount(0);
  await page.route("**/api/availability?**", route => route.abort("failed"));
  await check.click();
  await expect(form.getByRole("alert")).toBeVisible();
  await expect(check).toBeEnabled();
  await page.unroute("**/api/availability?**");
  await check.click();
  await expect(form.locator(".stay-total")).toBeVisible();
  await expect(form.getByRole("alert")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("favorite persists, booking is idempotent and checkout state stays real", async ({ page, context }) => {
  const errors = monitor(page);
  const user = (await pool.query("INSERT INTO users(email,first_name,phone,role,updated_at) VALUES($1,'QA Booking','+996555123456','USER',NOW()) RETURNING id", [`booking-${randomBytes(5).toString('hex')}@qa.invalid`])).rows[0];
  await session(context, user.id);
  await page.goto("/ru/cabins/qa-cabin-2");
  const favorite = page.locator(".property-heading .favorite-button");
  await favorite.click();
  await expect(favorite).toHaveAttribute("aria-pressed", "true");
  await favorite.click();
  await expect(favorite).toHaveAttribute("aria-pressed", "false");
  const form = page.locator(".stay-selector");
  const day = new Date(); day.setUTCDate(day.getUTCDate() + 70);
  const start = day.toISOString().slice(0,10); day.setUTCDate(day.getUTCDate()+2);
  await chooseRange(page, form, start, day.toISOString().slice(0,10));
  await form.getByRole("button", { name: ru.labels.book, exact: true }).click();
  await expect(page.locator(".booking-form")).toBeVisible();
  await page.locator(".booking-form").getByRole("button", { name: ru.labels.confirmAvailability }).click();
  await expect(page.locator(".booking-quote")).toBeVisible();
  const requestKey = await page.locator("[name='requestKey']").inputValue();
  const submitted = page.waitForRequest(request => request.method() === "POST" && !!request.headers()["next-action"]);
  await page.locator(".booking-form").getByRole("button", { name: ru.labels.book, exact: true }).click();
  const request = await submitted;
  await expect(page).toHaveURL(/\/ru\/bookings\/\d+$/);
  await expect(page.locator(".booking-details-layout")).toBeVisible();
  // Replay the real, already accepted request to exercise the server's key guard.
  await context.request.post(request.url(), { headers: request.headers(), data: request.postDataBuffer()!, maxRedirects: 0 });
  const rows = (await pool.query('SELECT id,status FROM bookings WHERE request_key=$1', [requestKey])).rows;
  expect(rows).toHaveLength(1);
  expect(rows[0].status).toBe('PENDING');
  expect((await pool.query('SELECT status,payment_method FROM payments WHERE booking_id=$1', [rows[0].id])).rows).toEqual([{status:'PENDING',payment_method:FINIK_PAYMENT_METHOD}]);
  await expect(page.getByRole("button", { name: /оплатить/i })).toHaveCount(0);
  await page.locator(".cancellation-panel input[name='reason']").fill("QA cancellation");
  await page.locator(".cancellation-panel button[type='submit']").click();
  await expect(page.locator(".booking-summary-heading .status-badge")).toHaveText(ru.statuses.CANCELLED);
  expect(errors).toEqual([]);
});

test("admin updates invalidate cached translations, references and public settings", async ({ page, context, browser }) => {
  const errors = monitor(page);
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto("/ru/admin/translations");
  const form = page.locator(".admin-content section .product-form").first();
  await chooseOption(page, form.getByRole("combobox").nth(0), "RU");
  await chooseOption(page, form.getByRole("combobox").nth(1), "common");
  await form.locator("[name='key']").fill("labels.search");
  await form.locator("[name='value']").fill("QA поиск");
  await form.locator("button[type='submit']").click();
  await expect(form.locator(".form-success")).toBeVisible();
  const anonymous = await browser.newPage();
  await anonymous.goto("/ru/catalog");
  await expect(anonymous.locator(".catalog-filters-content button[type='submit']")).toHaveText("QA поиск");
  // Remove via the same real admin action, so the test also verifies invalidation.
  const record = page.locator(".admin-record").filter({ hasText: "labels.search" }).first();
  await record.locator("button[type='submit']").click();
  await expect(record).toHaveCount(0);
  await anonymous.reload();
  await expect(anonymous.locator(".catalog-filters-content button[type='submit']")).toHaveText(ru.labels.search);
  await page.goto("/ru/admin/regions");
  const region = page.locator(".admin-record").first();
  await region.locator("summary").click();
  await region.locator("input[name='name']").fill("QA Region");
  await region.locator("button[type='submit']").click();
  await expect(region.locator(".form-success")).toBeVisible();
  await anonymous.reload();
  await anonymous.locator(".catalog-filters-content .premium-select-trigger").first().click();
  await expect(anonymous.getByRole("option", { name: "QA Region", exact: true })).toBeVisible();
  await anonymous.keyboard.press("Escape");
  await page.goto("/ru/admin/settings");
  const settings = page.locator(".admin-content .product-form").first();
  await settings.locator("[name='supportEmail']").fill("support@qa.invalid");
  await settings.locator("button[type='submit']").click();
  await expect(settings.locator(".form-success")).toBeVisible();
  await anonymous.reload();
  await expect(anonymous.locator(".footer-contact a[href^='mailto:']")).toHaveAttribute("href", "mailto:support%40qa.invalid");
  await anonymous.close();
  expect(errors).toEqual([]);
});

test("mobile layouts and all language auth pages have no hydration errors", async ({ page }) => {
  const errors = monitor(page);
  for (const width of [390, 320]) {
    await page.setViewportSize({width,height:900});
    for (const locale of ['ru','kg','en']) {
      for (const path of ['catalog','cabins/qa-cabin-3','login','register','admin-login']) {
        await page.goto(`/${locale}/${path}`);
        await expect(page.locator("h1").first()).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
  }
  expect(errors).toEqual([]);
});

test("unconfigured Google login shows a retryable error without prefetching OAuth", async ({ page }) => {
  test.skip(Boolean(process.env.GOOGLE_CLIENT_ID && (process.env.GOOGLE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET_ID)), "This check needs Google OAuth unconfigured.");
  let starts = 0;
  page.on('request', request => { if (new URL(request.url()).pathname === '/api/auth/google') { expect(request.method()).toBe('POST'); starts++; } });
  await page.goto('/ru/login');
  await expect(page.locator('.google-auth-button')).toBeEnabled();
  expect(starts).toBe(0);
  await page.locator('.google-auth-button').click();
  await expect(page).toHaveURL(/error=googleNotConfigured/);
  await expect(page.locator('.auth-form [role="alert"]')).toHaveText(ru.errors.googleNotConfigured);
  await expect(page.locator('.google-auth-button')).toBeEnabled();
  expect(starts).toBe(1);
});
