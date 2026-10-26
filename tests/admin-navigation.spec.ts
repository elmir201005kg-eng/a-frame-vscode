import { test, expect, type Route } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { chooseOption } from "./form-controls";

test.skip(!process.env.QA_SCHEMA, "Use npm run test:admin for an isolated schema.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema")!;
if (!/^aframe_qa_[a-f0-9]{12}$/.test(schema) || schema !== process.env.QA_SCHEMA) throw new Error("Isolated QA schema required");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });

test.beforeEach(async ({ context }) => {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',NOW())", [createHash("sha256").update(token).digest("hex"), process.env.QA_ADMIN_ID]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: `http://localhost:${process.env.E2E_PORT || 3127}`, httpOnly: true, sameSite: "Lax" }]);
});
test.afterAll(async () => { await pool.end(); });

test("admin sections, filters, languages and profile navigate in React without reloading", async ({ page }) => {
  test.setTimeout(120000); // A fresh Vite dev server compiles each section on its first visit.
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.goto("/ru/admin");
  await expect(page.locator(".admin-overview")).toBeVisible();
  const initialDocuments = documents;
  await page.locator(".admin-collapse").click();
  for (const section of ["cabins", "bookings", "payments", "users", "owners", "settings"]) {
    await page.locator(`.admin-sidebar .admin-nav a[href='/ru/admin/${section}']`).click();
    await expect(page).toHaveURL(new RegExp(`/ru/admin/${section}$`));
    await expect(page.locator(".admin-section-heading")).toBeVisible();
    await expect(page.locator(".admin-shell")).toHaveAttribute("data-collapsed", "true");
  }
  await page.locator(".admin-sidebar .admin-nav a[href='/ru/admin']").click();
  await page.locator(".admin-period-form button[type='submit']").click();
  await expect(page).toHaveURL(/\/ru\/admin\?period=30$/);
  for (const [locale, label, display] of [["kg", "Кыргызча", "KG"], ["en", "English", "ENG"]]) {
    await chooseOption(page, page.locator(".admin-topbar .language-switcher .premium-select-trigger"), label, display);
    const path = process.env.E2E_PRODUCTION === "true" || locale !== "kg" ? `/${locale}/admin` : "/admin";
    await expect(page).toHaveURL(new RegExp(`${path}\\?period=30$`));
    await expect(page.locator(".admin-overview")).toBeVisible();
    await expect(page.locator(".admin-shell")).toHaveAttribute("data-collapsed", "true");
  }
  await page.locator(".admin-profile-trigger").click();
  await page.locator(".admin-profile-popover a[href='/en/admin/settings?profile=1#profile']").click();
  await expect(page).toHaveURL(/\/en\/admin\/settings\?profile=1#profile$/);
  await expect(page.locator("input[name='firstName']")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/en\/admin\?period=30$/);
  await expect(page.locator(".admin-overview")).toBeVisible();
  await page.goForward();
  await expect(page.locator("input[name='firstName']")).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".admin-mobile-menu").click();
  await page.locator("dialog.admin-drawer .admin-nav a[href='/en/admin/bookings']").click();
  await expect(page).toHaveURL(/\/en\/admin\/bookings$/);
  await expect(page.locator("dialog.admin-drawer")).not.toBeVisible();
  expect(documents).toBe(initialDocuments);
  expect(errors).toEqual([]);
});

test("a stalled admin request can be superseded without an obsolete response reloading the page", async ({ page }) => {
  await page.goto("/en/admin");
  await expect(page.locator(".admin-overview")).toBeVisible();
  const held: Route[] = [];
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest()) documents++; });
  await page.route("**/en/admin/cabins", route => {
    if (route.request().headers().rsc) held.push(route);
    else void route.continue();
  });
  try {
    await page.locator(".admin-sidebar a[href='/en/admin/cabins']").click();
    await expect.poll(() => held.length).toBe(1);
    await expect(page.locator(".admin-navigation-progress")).toBeVisible();
    await page.locator(".admin-collapse").click();
    await expect(page.locator(".admin-shell")).toHaveAttribute("data-collapsed", "true");
    await page.locator(".admin-sidebar a[href='/en/admin/users']").click();
    await expect(page).toHaveURL(/\/en\/admin\/users$/);
    await expect(page.locator("#admin-main")).toHaveAttribute("aria-busy", "false");
    await Promise.all(held.splice(0).map(route => route.fulfill({ status: 503, body: "Unavailable" }).catch(() => {})));
    await expect(page.locator(".admin-navigation-error")).toHaveCount(0);
    expect(documents).toBe(0);
  } finally {
    await page.unroute("**/en/admin/cabins");
    await Promise.all(held.map(route => route.abort().catch(() => {})));
  }
});

test("a timed out admin transition keeps the workspace usable and allows a React retry", async ({ page }) => {
  await page.goto("/en/admin");
  await expect(page.locator(".admin-overview")).toBeVisible();
  await page.clock.install();
  const held: Route[] = [];
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest()) documents++; });
  await page.route("**/en/admin/cabins", route => {
    if (route.request().headers().rsc) held.push(route);
    else void route.continue();
  });
  try {
    await page.locator(".admin-sidebar a[href='/en/admin/cabins']").click();
    await expect.poll(() => held.length).toBe(1);
    await page.clock.fastForward(21000);
    await expect(page.locator(".admin-navigation-error")).toBeVisible();
    await expect(page.locator("#admin-main")).toHaveAttribute("aria-busy", "false");
    await expect(page.locator(".admin-overview")).toBeVisible();
    await page.unroute("**/en/admin/cabins");
    await page.locator(".admin-navigation-error button").click();
    await expect(page).toHaveURL(/\/en\/admin\/cabins$/);
    await expect(page.locator(".admin-section-heading")).toBeVisible();
    await expect(page.locator(".admin-navigation-error")).toHaveCount(0);
    expect(documents).toBe(0);
  } finally {
    await page.unroute("**/en/admin/cabins");
    await Promise.all(held.map(route => route.abort().catch(() => {})));
  }
});
