import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { chooseOption, chooseDay } from "./form-controls";
import { adminPeriod } from "../lib/admin-period";
import { addDays, bishkekToday } from "../lib/stay-dates";

test.skip(!process.env.QA_SCHEMA, "Run npm run test:performance to use a newly created, isolated test schema.");
test.use({ screenshot: "only-on-failure" });
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error("Invalid schema");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
const base = `http://localhost:${process.env.E2E_PORT || 3107}`;
let guest: string, cabin: string;
const prefix = `STAGE1-${randomBytes(4).toString("hex")}`;
const privateMarker = `private-${randomBytes(5).toString("hex")}@qa.invalid`;

test.beforeAll(async () => {
  guest = (await pool.query("INSERT INTO users(first_name,email,role,updated_at) VALUES('Stage One Guest',$1,'USER',NOW()) RETURNING id", [privateMarker])).rows[0].id;
  const owner = (await pool.query("SELECT id FROM owner_profiles WHERE user_id=$1", [process.env.QA_OWNER_ID])).rows[0].id;
  const location = (await pool.query("SELECT id FROM locations LIMIT 1")).rows[0].id;
  cabin = (await pool.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,price_per_night,max_guests,status,updated_at) VALUES($1,$2,'Stage One Cabin',$3,'A sufficiently detailed cabin description for moderation validation.',2000,4,'DRAFT',NOW()) RETURNING id", [owner, location, `stage-one-${prefix.toLowerCase()}`])).rows[0].id;
  await pool.query("INSERT INTO cabin_images(cabin_id,image_url,is_main) VALUES($1,'/images/hero.webp',true)", [cabin]);
  const demo = (await pool.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,price_per_night,max_guests,status,is_demo,updated_at) VALUES($1,$2,'Stage One Demo',$3,'Test demo cabin',2000,4,'DRAFT',true,NOW()) RETURNING id", [owner, location, `stage-one-demo-${prefix.toLowerCase()}`])).rows[0].id;
  for (let i = 0; i < 9; i++) {
    const status = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REJECTED"][i % 5];
    const booking = (await pool.query("INSERT INTO bookings(booking_number,user_id,cabin_id,check_in,check_out,guests_count,guest_name,guest_phone,guest_email,price_per_night,nights,subtotal,total_amount,status,created_at,updated_at) VALUES($1,$2,$3,CURRENT_DATE+$4::int,CURRENT_DATE+$4::int+2,2,'Stage One Guest','+996555000000',$5,2000,2,4000,4000,$6::booking_status,NOW(),NOW()) RETURNING id", [`${prefix}-${i}`, guest, i === 8 ? demo : cabin, 100 + i * 3, privateMarker, status])).rows[0].id;
    const paymentStatus = i === 0 || i === 1 || i === 2 || i === 8 ? "PAID" : i === 3 ? "REFUNDED" : "PENDING";
    await pool.query("INSERT INTO payments(booking_id,user_id,amount,currency,payment_method,status,transaction_id,paid_at) VALUES($1,$2,4000,$3,'QA_PROVIDER',$4::payment_status,$5,CASE WHEN $4 IN ('PAID','REFUNDED') THEN NOW() ELSE NULL END)", [booking, guest, i === 1 ? "USD" : "KGS", paymentStatus, i === 2 ? null : `${prefix}-txn-${i}`]);
  }
});
test.afterAll(async () => { await pool.end(); }); // The runner drops only its own random schema.

async function session(context: BrowserContext, userId: string, verified = true, expired = false) {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,$3,$4)", [createHash("sha256").update(token).digest("hex"), userId, new Date(Date.now() + (expired ? -60000 : 3600000)), verified ? new Date() : null]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: base, httpOnly: true, sameSite: "Lax" }]);
}
function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error" && /hydration|hydrated|did not match|maximum update depth/i.test(message.text())) errors.push(message.text()); });
  return errors;
}

test("ADMIN sees exact database aggregates, revenue exclusions, search, filters and pagination", async ({ page, context }) => {
  const errors = monitor(page);
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto("/ru/admin");
  await expect(page.locator(".admin-shell")).toBeVisible();
  await expect(page.locator(".site-header, .site-footer")).toHaveCount(0);
  await expect(page.locator('[data-stat="bookings"]')).toHaveText("8");
  await expect(page.locator('[data-stat="revenue"]')).toContainText("4");
  const revenueText = (await page.locator('[data-stat="revenue"]').innerText()).replace(/[^\d]/g, "");
  expect(revenueText).toBe("4000");
  await expect(page.locator(".admin-stat-card")).toHaveCount(4);
  await expect(page.locator('[data-stat="pending"]')).toBeVisible();
  await expect(page.locator('[data-stat="moderation"]')).toBeVisible();
  await expect(page.locator(".admin-chart-row, .admin-secondary-stats, .admin-recent-events")).toHaveCount(0);
  await expect(page.locator(".admin-bookings-table tbody tr")).toHaveCount(6);
  await page.locator(".admin-table-footer").getByRole("link", { name: "Далее", exact: true }).click();
  await expect(page.locator(".admin-bookings-table tbody tr")).toHaveCount(2);
  await page.locator(".admin-table-search input").fill(`${prefix}-0`);
  await page.locator(".admin-table-filters button[type='submit']").click();
  await expect(page.locator(".admin-bookings-table tbody tr")).toHaveCount(1);
  await chooseOption(page, page.locator(".admin-table-filters .premium-select-trigger"), "Подтверждено");
  await page.locator(".admin-table-filters button[type='submit']").click();
  await expect(page.locator(".admin-table-empty")).toBeVisible();
  await page.goto("/ru/admin?period=custom&from=2026-02-30&to=2026-03-01");
  await expect(page.locator(".admin-validation-error")).toBeVisible();
  await page.goto("/ru/admin");
  await page.locator(".admin-search-trigger").click();
  await page.locator(".admin-search-input input").fill("Stage One Cabin");
  await expect(page.locator(".admin-search-results a").first()).toContainText("Stage One Cabin");
  await page.locator(".admin-search-results a").first().click();
  await expect(page).toHaveURL(/\/admin\/cabins\?q=/);
  await expect(page.locator(".admin-record")).toHaveCount(1);
  const result = await context.request.get("/api/admin/search?locale=en&q=Stage");
  expect(result.status()).toBe(200);
  expect(result.headers()["cache-control"]).toContain("no-store");
  const body = await result.text();
  expect(body).not.toContain(privateMarker);
  expect(body).not.toMatch(/passwordHash|password_hash|guestPhone|guestEmail/);
  await page.goto("/ru/admin/analytics");
  await expect(page.locator('[data-stat="paid"]')).toHaveText("1");
  await expect(page.locator(".admin-chart-row")).toBeVisible();
  await expect(page.locator(".admin-bookings-panel")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("anonymous, USER, OWNER, unverified, expired and disabled sessions cannot access admin", async ({ browser }) => {
  test.setTimeout(180000);
  for (const item of [
    { id: null, verified: false, expired: false, url: /\/admin-login/ },
    { id: guest, verified: true, expired: false, url: /\/account/ },
    { id: process.env.QA_OWNER_ID!, verified: true, expired: false, url: /\/owner/ },
    { id: process.env.QA_ADMIN_ID!, verified: false, expired: false, url: /\/admin-login/ },
    { id: process.env.QA_ADMIN_ID!, verified: true, expired: true, url: /\/admin-login/ },
  ]) {
    const context = await browser.newContext(), page = await context.newPage();
    if (item.id) await session(context, item.id, item.verified, item.expired);
    for (const route of ["/ru/admin", "/kg/admin/users", "/en/admin/settings"]) {
      await page.goto(route);
      await expect(page).toHaveURL(item.url);
      await expect(page.locator(".admin-shell")).toHaveCount(0);
    }
    const response = await context.request.get("/api/admin/search?locale=en&q=Stage");
    expect(response.status()).toBe(item.id && item.verified && !item.expired ? 403 : 401);
    expect(await response.text()).not.toContain("Stage One Cabin");
    await context.close();
  }
  const disabled = (await pool.query("INSERT INTO users(first_name,email,role,is_active,updated_at) VALUES('Disabled Admin',$1,'ADMIN',false,NOW()) RETURNING id", [`disabled-${prefix}@qa.invalid`])).rows[0].id;
  const context = await browser.newContext(), page = await context.newPage();
  await session(context, disabled);
  await page.goto("/en/admin");
  await expect(page).toHaveURL(/\/admin-login/);
  expect((await context.request.get("/api/admin/search?locale=en&q=Stage")).status()).toBe(401);
  await context.close();
});

test("admin moderation persists an audit; USER, OWNER and cross-origin action replay cannot mutate", async ({ page, context, browser }) => {
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto("/en/admin/cabins?q=Stage%20One%20Cabin");
  const record = page.locator(".admin-record").first();
  await record.locator("summary").click();
  await chooseOption(page, record.getByRole("combobox"), "Published");
  const submitted = page.waitForRequest(request => request.method() === "POST" && !!request.headers()["x-server-action"]);
  await record.locator("button[type='submit']").click();
  await page.locator("dialog[open]").getByRole("button", { name: "Confirm", exact: true }).click();
  const request = await submitted;
  await expect(record.locator(".form-success")).toBeVisible();
  expect((await pool.query("SELECT status FROM cabins WHERE id=$1", [cabin])).rows[0].status).toBe("PUBLISHED");
  const audit = await pool.query("SELECT user_id,new_data FROM audit_logs WHERE entity_type='cabin' AND entity_id=$1 AND action='cabin.moderated'", [cabin]);
  expect(audit.rows).toEqual([{ user_id: process.env.QA_ADMIN_ID, new_data: { status: "PUBLISHED", actorRole: "ADMIN" } }]);
  for (const userId of [guest, process.env.QA_OWNER_ID!]) {
    const other = await browser.newContext();
    await session(other, userId);
    const headers: Record<string, string> = { ...await request.allHeaders(), origin: base }; delete headers.cookie;
    const denied = await other.request.post(request.url(), { headers, data: request.postDataBuffer()!, maxRedirects: 0 });
    const redirect = denied.headers()["x-redirect"];
    if (redirect) expect(redirect).toMatch(/^\/en\/(account|owner)$/);
    else expect(await denied.text()).toContain("forbidden");
    await other.close();
  }
  const forged = await context.request.post(request.url(), { headers: { ...await request.allHeaders(), origin: "https://attacker.invalid" }, data: request.postDataBuffer()!, maxRedirects: 0 });
  expect(forged.status()).toBeGreaterThanOrEqual(400);
  expect((await pool.query("SELECT count(*)::int AS count FROM audit_logs WHERE entity_type='cabin' AND entity_id=$1", [cabin])).rows[0].count).toBe(1);
  // Keep the public catalog fixture count used by the existing regression suite.
  await chooseOption(page, record.getByRole("combobox"), "Archived");
  await record.locator("button[type='submit']").click();
  await page.locator("dialog[open]").getByRole("button", { name: "Confirm", exact: true }).click();
  await expect.poll(async () => (await pool.query("SELECT status FROM cabins WHERE id=$1", [cabin])).rows[0].status).toBe("ARCHIVED");
});

test("all existing admin sections and locale switches work; mobile drawer, keyboard and hydration", async ({ page, context }) => {
  test.setTimeout(300000);
  const errors = monitor(page);
  await session(context, process.env.QA_ADMIN_ID!);
  const sections = [
    ["cabins", "cabins"], ["bookings", "bookings"], ["payments", "payments"],
    ["users", "users"], ["owners", "owners"], ["regions", "cabins"],
    ["reviews", "cabins"], ["activities", "settings"], ["notifications", "settings"],
    ["translations", "settings"], ["settings", "settings"], ["amenities", "cabins"],
    ["categories", "cabins"], ["calendar", "bookings"], ["promotions", "cabins"],
    ["messages", "users"], ["support", "users"], ["audit", "settings"], ["analytics", "dashboard"],
  ];
  for (const [section, parent] of sections) {
    await page.goto(`/ru/admin/${section}`);
    await expect(page.locator(".admin-sidebar .admin-nav > a")).toHaveCount(7);
    await expect(page.locator(".admin-sidebar a[aria-current='page']")).toHaveAttribute("href", `/ru/admin${parent === "dashboard" ? "" : `/${parent}`}`);
    await expect(page.locator(".admin-section-heading, .admin-page-heading").first()).toBeVisible();
    const canonical = section === "activities" ? "audit" : section === "support" ? "messages" : section;
    await expect(page).toHaveURL(new RegExp(`/ru/admin/${canonical}$`));
    if (!["payments", "owners", "notifications"].includes(section)) {
      await expect(page.locator(".admin-section-navigation a[aria-current='page']")).toHaveAttribute("href", `/ru/admin/${canonical}`);
    }
  }
  await page.goto("/ru/admin/support?q=a%26b&tag=one&tag=two");
  await expect(page).toHaveURL(/\/ru\/admin\/messages\?q=a%26b&tag=one&tag=two$/);
  await page.goto("/ru/admin/activities?scope=admins&q=test");
  await expect(page).toHaveURL(/\/ru\/admin\/audit\?scope=admins&q=test$/);
  for (const locale of ["ru", "kg", "en"] as const) {
    await page.goto(`/${locale}/admin`);
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 960 });
      await expect(page.locator(".admin-stat-grid")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      if (width < 1024) {
        await page.locator(".admin-mobile-menu").click();
        await expect(page.locator("dialog.admin-drawer")).toBeVisible();
        await expect(page.locator("dialog.admin-drawer .admin-nav > a")).toHaveCount(7);
        await page.keyboard.press("Escape");
        await expect(page.locator("dialog.admin-drawer")).not.toBeVisible();
      }
    }
  }
  await page.goto("/ru/admin?period=7");
  await page.locator(".admin-topbar .language-switcher .premium-select-trigger").click();
  await page.getByRole("option", { name: "Кыргызча", exact: true }).click();
  await expect(page).toHaveURL(/\/kg\/admin\?period=7/);
  await expect(page.locator(".admin-topbar")).toHaveCount(1);
  await page.locator(".admin-topbar .language-switcher .premium-select-trigger").click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  await expect(page).toHaveURL(/\/en\/admin\?period=7/);
  await expect(page.locator(".admin-topbar")).toHaveCount(1);
  await page.locator(".admin-collapse").click();
  await expect(page.locator(".admin-shell")).toHaveAttribute("data-collapsed", "true");
  await page.locator(".admin-collapse").click();
  await page.keyboard.press("/");
  await expect(page.locator(".admin-search-input input")).toBeFocused();
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/ru/admin");
  await page.screenshot({ path: "test-results/admin-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.screenshot({ path: "test-results/admin-mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("custom date controls submit real historical ranges and preserve empty states", async ({ page, context }) => {
  await session(context, process.env.QA_ADMIN_ID!);
  const range = adminPeriod({ period: "7" });
  await page.goto("/en/admin");
  await chooseOption(page, page.locator(".admin-period-select .premium-select-trigger"), "Custom range");
  await page.locator(".admin-custom-range .premium-date-trigger").first().click();
  await chooseDay(page, range.start);
  await page.locator(".admin-custom-range .premium-date-trigger").last().click();
  await chooseDay(page, range.end);
  await page.locator(".admin-period-form button[type='submit']").click();
  await expect(page).toHaveURL(new RegExp(`period=custom&from=${range.start}&to=${range.end}`));
  await page.goto("/en/admin?period=custom&from=2000-01-01&to=2000-01-01");
  await expect(page.locator('[data-stat="bookings"]')).toHaveText("0");
  await expect(page.locator('[data-stat="revenue"]')).toContainText("0");
  await expect(page.locator(".admin-table-empty")).toBeVisible();
  await page.goto("/en/admin/analytics?period=custom&from=2000-01-01&to=2000-01-01");
  await expect(page.locator(".admin-chart-empty")).toBeVisible();
  await expect(page.locator(".admin-bookings-panel")).toHaveCount(0);
});

test("booking filters allow historical dates and preserve submitted values", async ({ page, context }) => {
  await session(context, process.env.QA_ADMIN_ID!);
  const yesterday = addDays(bishkekToday(), -1);
  await page.goto("/en/admin/bookings");
  const form = page.locator(".admin-filters");
  for (const name of ["from", "to"]) {
    await form.locator(`.product-field:has(input[name='${name}']) .premium-date-trigger`).click();
    await chooseDay(page, yesterday);
    await expect(form.locator(`input[name='${name}']`)).toHaveValue(yesterday);
  }
  await form.locator("button[type='submit']").click();
  await expect(page).toHaveURL(new RegExp(`from=${yesterday}&to=${yesterday}`));
  await expect(page.locator(".admin-table-empty")).toBeVisible();
});

test("super administrator can enter administration from the public account menu", async ({ page, context }) => {
  const superAdmin = (await pool.query("INSERT INTO users(first_name,email,role,updated_at) VALUES('QA Super Admin',$1,'SUPER_ADMIN',NOW()) RETURNING id", [`${prefix}-super@qa.invalid`])).rows[0].id;
  await session(context, superAdmin);
  await page.goto("/en/catalog");
  await page.locator(".header-account-button").click();
  const account = page.locator(".header-account-name");
  await expect(account).toHaveAttribute("href", "/en/admin");
  await account.click();
  await expect(page.locator(".admin-shell")).toBeVisible();
});

test("admin cleanup: local Kyrgyz home, profile and anonymous access stay reachable", async ({ page, context, browser }) => {
  test.skip(process.env.E2E_PRODUCTION === "true", "This regression covers local paths without the Kyrgyz prefix.");
  test.setTimeout(180000);
  await session(context, process.env.QA_ADMIN_ID!);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/kg/admin/cabins");
  await expect(page).toHaveURL(/\/admin\/cabins$/);
  await expect(page.locator(".admin-sidebar .admin-nav a[aria-current='page']")).toHaveAttribute("href", "/admin/cabins");
  await page.locator(".admin-sidebar .admin-nav > a").first().click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.locator(".admin-overview")).toBeVisible();
  const applyPeriod = page.locator(".admin-period-form button[type='submit']");
  await applyPeriod.click();
  await expect(page).toHaveURL(/\/admin\?period=30$/, { timeout: 60000 });
  await expect(applyPeriod).toBeEnabled({ timeout: 60000 });
  await page.locator(".admin-profile-trigger").click();
  const profile = page.locator(".admin-profile-popover a[href='/admin/settings?profile=1#profile']");
  await expect(profile).toBeVisible();
  await profile.click();
  await expect(page).toHaveURL(/\/admin\/settings\?profile=1#profile$/, { timeout: 60000 });
  await expect(page.locator("input[name='firstName']")).toBeVisible({ timeout: 60000 });

  const anonymous = await browser.newContext();
  try {
    await anonymous.addCookies([{ name: "a-frame-kg-locale", value: "kg", url: base }]);
    const guestPage = await anonymous.newPage();
    await guestPage.goto("/admin");
    await expect(guestPage).toHaveURL(/\/admin-login/);
    await expect(guestPage.locator(".admin-shell")).toHaveCount(0);
  } finally { await anonymous.close(); }
});
