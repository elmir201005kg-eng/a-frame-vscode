import { test, expect, type Route } from "@playwright/test";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import { Pool } from "pg";
import common from "../app/i18n/locales/ru/common.json" with { type: "json" };

test.skip(!process.env.QA_SCHEMA, "Use npm run test:performance with an isolated schema.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (!/^aframe_qa_[a-f0-9]{12}$/.test(schema) || schema !== process.env.QA_SCHEMA) throw new Error("Isolated QA schema required");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
test.afterAll(async () => { await pool.end(); });

test("navigation remains interruptible while a catalog response is stalled", async ({ page }) => {
  let documents = 0;
  page.on("request", request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
  await page.goto("/ru");
  await expect(page.locator(".search-panel")).toBeVisible();
  const initialDocuments = documents;
  const held: Route[] = [];
  await page.route("**/ru/catalog?*", route => {
    if (route.request().headers().rsc) held.push(route);
    else void route.continue();
  });
  try {
    await page.locator(".desktop-nav:visible a[href='/ru/catalog']").click();
    await expect.poll(() => held.length).toBeGreaterThan(0);
    await expect(page.locator(".desktop-nav:visible")).toBeVisible();
    await page.locator(".desktop-nav:visible a[href='/ru/destinations']").click();
    await expect(page).toHaveURL(/\/ru\/destinations$/);
    await expect(page.locator("#destinations:visible")).toBeVisible();
    expect(documents).toBe(initialDocuments);
  } finally {
    await page.unroute("**/ru/catalog?*");
    await Promise.all(held.map(route => route.abort().catch(() => {})));
  }
});

test("mobile footer links accept pointer clicks above the floating assistant", async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/ru/privacy");
    await expect(page.locator("[data-ai-widget]")).toBeVisible();
    for (const destination of ["terms", "privacy"]) {
      await page.locator(`.footer-legal:visible a[href='/ru/${destination}']`).click();
      await expect(page).toHaveURL(new RegExp(`/ru/${destination}$`));
      await expect(page.locator(".information-page:visible")).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("catalog still clamps an oversized page URL to the last results", async ({ page }) => {
  await page.goto(`/ru/catalog?page=${"9".repeat(350)}`);
  await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(2);
  await expect(page.locator(".catalog-page-count")).toContainText("8");
});

test("payment confirmation does not overlap slow refreshes or poll in a hidden tab", async ({ page, context }) => {
  await page.clock.install();
  const user = process.env.QA_OWNER_ID!;
  const cabin = (await pool.query("SELECT id FROM cabins WHERE slug='qa-cabin-1'")).rows[0].id;
  const booking = (await pool.query("INSERT INTO bookings(booking_number,user_id,cabin_id,check_in,check_out,guests_count,guest_name,guest_phone,guest_email,price_per_night,nights,subtotal,total_amount,status,updated_at) VALUES($1,$2,$3,CURRENT_DATE+700,CURRENT_DATE+702,1,'Polling QA','+996555123456','polling@qa.invalid',1000,2,2000,2000,'PENDING',NOW()) RETURNING id", [`POLL-${randomBytes(5).toString("hex")}`, user, cabin])).rows[0].id;
  await pool.query("INSERT INTO payments(booking_id,user_id,amount,currency,payment_method,status,provider_payment_id) VALUES($1,$2,5,'KGS','FINIK_PAY','PENDING',$3)", [booking, user, randomUUID()]);
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at) VALUES($1,$2,NOW()+INTERVAL '1 hour')", [createHash("sha256").update(token).digest("hex"), user]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: `http://localhost:${process.env.E2E_PORT || 3107}`, httpOnly: true, sameSite: "Lax" }]);
  await page.goto(`/ru/bookings/${booking}?payment=success`);
  const refresh = page.getByRole("button", { name: common.labels.paymentRefresh, exact: true });
  await expect(refresh).toBeVisible();
  const held: Route[] = [];
  await page.route(`**/ru/bookings/${booking}?*`, route => {
    if (route.request().headers().rsc) held.push(route);
    else void route.continue();
  });
  try {
    await expect.poll(() => held.length, { timeout: 10000 }).toBe(1);
    await expect(refresh).toBeDisabled();
    // Advance only test timers; no artificial waits are added to the application.
    await page.clock.fastForward(12000);
    expect(held).toHaveLength(1);
    await Promise.all(held.splice(0).map(route => route.continue().catch(() => {})));
    await expect(refresh).toBeEnabled();
    await page.evaluate(() => Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" }));
    await page.clock.fastForward(12000);
    expect(held).toHaveLength(0);
  } finally {
    await page.unroute(`**/ru/bookings/${booking}?*`);
    await Promise.all(held.map(route => route.abort().catch(() => {})));
  }
});
