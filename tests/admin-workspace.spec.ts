import { test, expect, type BrowserContext, type Page, type Locator } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { chooseOption, chooseDay } from "./form-controls";
import { addDays, bishkekToday } from "../lib/stay-dates";

test.skip(!process.env.QA_SCHEMA, "Use npm run test:admin for an isolated schema.");
test.use({ screenshot: "only-on-failure" });
test.describe.configure({ mode: "serial" });
const connection = new URL(process.env.E2E_DATABASE_URL!), schema = connection.searchParams.get("schema")!;
if (!/^aframe_qa_[a-f0-9]{12}$/.test(schema)) throw new Error("Admin QA requires an isolated schema.");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
const prefix = `admin-workspace-${randomBytes(4).toString("hex")}`, base = `http://localhost:${process.env.E2E_PORT || 3107}`;
const start = addDays(bishkekToday(), 10), end = addDays(start, 2);
let cabin: string, guest: string, superAdmin: string, booking: string;

async function session(context: BrowserContext, userId: string, verified = true) {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',$3)", [createHash("sha256").update(token).digest("hex"), userId, verified ? new Date() : null]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: base, httpOnly: true, sameSite: "Lax" }]);
}
async function confirm(page: Page, form: Locator) {
  await form.locator("button[type='submit']").click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  await page.locator("dialog[open]").getByRole("button", { name: "Confirm", exact: true }).click();
}
async function dateField(page: Page, form: Locator, name: string, value: string) {
  const calendar = page.locator(".premium-calendar-popover");
  // Let the previous single-date popover finish restoring focus before opening another.
  await expect(calendar).toHaveCount(0);
  await form.locator(`.product-field:has(input[name='${name}']) .premium-date-trigger`).click();
  await expect(calendar).toBeVisible();
  await expect(calendar).toHaveAttribute("data-state", "open");
  await chooseDay(page, value);
  await expect(form.locator(`input[name='${name}']`)).toHaveValue(value);
  await expect(calendar).toHaveCount(0);
}
test.beforeAll(async () => {
  const hash = (await pool.query("SELECT password_hash FROM users WHERE id=$1", [process.env.QA_ADMIN_ID])).rows[0].password_hash;
  guest = (await pool.query("INSERT INTO users(first_name,email,phone,password_hash,updated_at) VALUES($1,$2,'+996555000000',$3,NOW()) RETURNING id", [prefix, `${prefix}@qa.invalid`, hash])).rows[0].id;
  superAdmin = (await pool.query("INSERT INTO users(first_name,email,password_hash,role,updated_at) VALUES($1,$2,$3,'SUPER_ADMIN',NOW()) RETURNING id", [`${prefix}-super`, `${prefix}-super@qa.invalid`, hash])).rows[0].id;
});
test.afterAll(async () => {
  const ids = (await pool.query("SELECT id FROM cabins WHERE slug LIKE $1", [`${prefix}%`])).rows.map(row => row.id);
  if (ids.length) {
    await pool.query("DELETE FROM notifications WHERE booking_id IN (SELECT id FROM bookings WHERE cabin_id=ANY($1::bigint[]))", [ids]);
    await pool.query("DELETE FROM payments WHERE booking_id IN (SELECT id FROM bookings WHERE cabin_id=ANY($1::bigint[]))", [ids]);
    await pool.query("DELETE FROM bookings WHERE cabin_id=ANY($1::bigint[])", [ids]);
    await pool.query("DELETE FROM cabins WHERE id=ANY($1::bigint[])", [ids]);
  }
  await pool.query("DELETE FROM categories WHERE slug LIKE $1", [`${prefix}%`]);
  await pool.query("DELETE FROM owner_profiles WHERE user_id=ANY($1::bigint[])", [[guest, superAdmin].filter(Boolean)]);
  await pool.query("DELETE FROM users WHERE id=ANY($1::bigint[])", [[guest, superAdmin].filter(Boolean)]);
  await pool.end();
});

test("category creation and complete cabin editor persist; upload and publication appear publicly", async ({ page, context }) => {
  test.setTimeout(120000);
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto("/en/admin/categories");
  await page.locator(".admin-add > summary").click();
  const category = page.locator(".admin-add form");
  await category.locator('[name="name"]').fill(prefix);
  await category.locator('[name="slug"]').fill(prefix);
  await category.locator('[name="nameEn"]').fill("Mountain stays");
  await category.locator("button[type='submit']").click();
  await expect(category.locator(".form-success")).toBeVisible();
  await page.goto("/en/admin/cabins?edit=new");
  const editor = page.locator("#cabin-editor");
  await editor.locator('[name="title"]').fill(prefix);
  await editor.locator('[name="slug"]').fill(prefix);
  await editor.locator('[name="description"]').fill("A quiet mountain cabin with a detailed description for guests and publication.");
  await chooseOption(page, editor.locator(".product-field:has(input[name='regionId']) button[role='combobox']"), "Issyk-Kul");
  await editor.locator('[name="address"]').fill("Karakol, QA street 1");
  await editor.locator('[name="latitude"]').fill("42.49");
  await editor.locator('[name="longitude"]').fill("78.39");
  await editor.locator('[name="price"]').fill("2000");
  await editor.locator('[name="categories"]').check();
  await editor.locator("button[type='submit']").click();
  await expect(page).toHaveURL(/edit=\d+/);
  cabin = (await pool.query("SELECT id,price_per_night FROM cabins WHERE slug=$1", [prefix])).rows[0].id;
  expect((await pool.query("SELECT latitude FROM locations WHERE id=(SELECT location_id FROM cabins WHERE id=$1)", [cabin])).rows[0].latitude).toBe("42.4900000");
  await page.locator('.photo-upload input[type="file"]').setInputFiles("public/images/hero.webp");
  await page.locator(".photo-upload button[type='submit']").click();
  await expect(page.locator(".owner-gallery img")).toHaveCount(1);
  const moderation = page.locator(".owner-editor-sidebar form").first();
  await chooseOption(page, moderation.getByRole("combobox"), "Published");
  await confirm(page, moderation);
  await expect(moderation.locator(".form-success")).toBeVisible();
  await page.goto(`/en/cabins/${prefix}`);
  await expect(page.getByRole("heading", { name: prefix, exact: true })).toBeVisible();
  await expect(page.getByText("Mountain stays", { exact: true })).toBeVisible();
});

test("maintenance dates block public availability and reopening releases them", async ({ page, context }) => {
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto(`/en/admin/calendar?cabinId=${cabin}&start=${start}&month=${start.slice(0, 7)}`);
  const form = page.locator("#calendar-editor form");
  await chooseOption(page, form.getByRole("combobox").last(), "Maintenance");
  await confirm(page, form);
  await expect(form.locator(".form-success")).toBeVisible();
  await expect(page.locator('.admin-calendar-table a[data-state="maintenance"]')).toHaveCount(1);
  const unavailable = await context.request.get(`/api/availability?cabinId=${cabin}&checkIn=${start}&checkOut=${end}&guests=2`);
  expect(unavailable.status()).toBe(400);
  expect((await unavailable.json()).code).toBe("datesUnavailable");
  await chooseOption(page, form.getByRole("combobox").last(), "Available");
  await confirm(page, form);
  await expect.poll(async () => (await pool.query("SELECT status FROM cabin_availability WHERE cabin_id=$1 AND date=$2", [cabin, start])).rows[0].status).toBe("AVAILABLE");
});

test("promo code changes real server quote; invalid codes are rejected", async ({ page, context }) => {
  test.setTimeout(120000);
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto("/en/admin/promotions");
  await page.locator(".admin-add > summary").click();
  const form = page.locator(".admin-add form");
  await form.locator('[name="title"]').fill(prefix);
  await chooseOption(page, form.getByRole("combobox").first(), prefix);
  await form.locator('[name="code"]').fill("MOUNTAIN25");
  await form.locator('[name="discountValue"]').fill("25");
  await dateField(page, form, "startDate", start);
  await dateField(page, form, "endDate", end);
  await form.locator("button[type='submit']").click();
  await expect(form.locator(".form-success")).toBeVisible();
  const url = `/api/availability?cabinId=${cabin}&checkIn=${start}&checkOut=${end}&guests=2`;
  expect((await (await context.request.get(url)).json()).total).toBe("4000.00");
  expect((await (await context.request.get(`${url}&promoCode=MOUNTAIN25`)).json()).total).toBe("3000.00");
  expect((await (await context.request.get(`${url}&promoCode=INVALID`)).json()).code).toBe("invalidPromoCode");
});

test("booking transitions, overlap constraint and cancellation free the same public dates", async ({ page, context, browser }) => {
  test.setTimeout(120000);
  await session(context, process.env.QA_ADMIN_ID!);
  const guestContext = await browser.newContext(), guestPage = await guestContext.newPage();
  await session(guestContext, guest);
  await guestPage.goto(`${base}/en/booking?cabin=${prefix}&checkIn=${start}&checkOut=${end}&guests=2`);
  const guestForm = guestPage.locator(".booking-form");
  await guestForm.locator('[name="promoCode"]').fill("MOUNTAIN25");
  await guestForm.getByRole("button", { name: "Check availability", exact: true }).click();
  await expect(guestForm.locator(".booking-quote")).toContainText("3,000");
  await guestForm.getByRole("button", { name: "Request booking", exact: true }).click();
  await expect(guestPage).toHaveURL(/\/en\/bookings\/\d+/);
  const stored = (await pool.query("SELECT id,total_amount,discount_amount FROM bookings WHERE cabin_id=$1", [cabin])).rows[0];
  booking = stored.id;
  expect(stored.total_amount).toBe("3000.00"); expect(stored.discount_amount).toBe("1000.00");
  expect((await pool.query("SELECT count(*)::int AS count FROM notifications WHERE booking_id=$1 AND user_id=$2 AND type='booking.created'", [booking, process.env.QA_ADMIN_ID])).rows[0].count).toBe(1);
  await guestContext.close();
  await expect(pool.query("INSERT INTO bookings(booking_number,user_id,cabin_id,check_in,check_out,guests_count,guest_name,guest_phone,price_per_night,nights,subtotal,total_amount,updated_at) VALUES($1,$2,$3,$4,$5,2,'Conflict','+996555000000',2000,2,4000,4000,NOW())", [`OVERLAP-${randomBytes(6).toString("hex")}`, guest, cabin, start, end])).rejects.toMatchObject({ code: "23P01" });
  await page.goto(`/en/admin/bookings?q=${encodeURIComponent(prefix)}`);
  await page.locator(".admin-row-details > summary").click();
  const moderation = page.locator(".admin-row-actions form").first();
  await confirm(page, moderation);
  await expect.poll(async () => (await pool.query("SELECT status FROM bookings WHERE id=$1", [booking])).rows[0].status).toBe("CONFIRMED");
  const cancellation = page.locator(".admin-row-actions form").last();
  await cancellation.locator('[name="reason"]').fill("Guest requested cancellation within the policy.");
  await confirm(page, cancellation);
  await expect.poll(async () => (await pool.query("SELECT status FROM bookings WHERE id=$1", [booking])).rows[0].status).toBe("CANCELLED");
  expect((await (await context.request.get(`/api/availability?cabinId=${cabin}&checkIn=${start}&checkOut=${end}&guests=2`)).json()).available).toBe(true);
  expect((await pool.query("SELECT count(*)::int AS count FROM audit_logs WHERE entity_type='booking' AND entity_id=$1", [booking])).rows[0].count).toBe(3);
});

test("payment CSV matches filters; guests and unverified super administrators are denied", async ({ page, context, browser }) => {
  await pool.query("INSERT INTO payments(booking_id,user_id,amount,currency,payment_method,status,transaction_id,paid_at) VALUES($1,$2,5,'KGS','QA_PROVIDER','PAID',$3,NOW())", [booking, guest, `txn-${prefix}`]);
  await session(context, superAdmin);
  await page.goto(`/en/admin/payments?q=${prefix}&status=PAID`);
  await expect(page.locator(".admin-data-table tbody tr")).toHaveCount(1);
  const result = await context.request.get(`/api/admin/payments/export?locale=en&q=${prefix}&status=PAID`);
  expect(result.status()).toBe(200);
  expect(result.headers()["cache-control"]).toContain("no-store");
  const csv = await result.text(); expect(csv).toContain(`txn-${prefix}`); expect(csv).toContain('"5"');
  expect(csv).not.toMatch(/password|payment_url|api_key/);
  for (const [userId, verified, status] of [[guest, true, 403], [superAdmin, false, 401]] as const) {
    const other = await browser.newContext(); await session(other, userId, verified);
    expect((await other.request.get("/api/admin/payments/export?locale=en")).status()).toBe(status);
    await other.close();
  }
});

test("deletion requires confirmation; booking history and assigned categories remain protected", async ({ page, context }) => {
  test.setTimeout(120000);
  await session(context, process.env.QA_ADMIN_ID!);
  await page.goto(`/en/admin/cabins?edit=${cabin}`);
  const protectedDelete = page.locator(".owner-editor-sidebar form").filter({ has: page.getByRole("button", { name: "Delete", exact: true }) }).first();
  await confirm(page, protectedDelete);
  await expect(protectedDelete.locator(".form-error")).toBeVisible();
  expect((await pool.query("SELECT count(*)::int AS count FROM cabins WHERE id=$1", [cabin])).rows[0].count).toBe(1);
  const disposable = (await pool.query("INSERT INTO cabins(owner_id,location_id,title,slug,description,price_per_night,max_guests,status,updated_at) SELECT owner_id,location_id,$2,$2,'A disposable draft for a safe delete check.',2000,2,'DRAFT',NOW() FROM cabins WHERE id=$1 RETURNING id", [cabin, `${prefix}-delete`])).rows[0].id;
  await page.goto(`/en/admin/cabins?q=${prefix}-delete`);
  await page.locator(".admin-row-details > summary").click();
  const remove = page.locator(".admin-row-actions form").last();
  await remove.getByRole("button", { name: "Delete", exact: true }).click();
  await page.locator("dialog[open]").getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await pool.query("SELECT count(*)::int AS count FROM cabins WHERE id=$1", [disposable])).rows[0].count).toBe(1);
  await confirm(page, remove);
  await expect.poll(async () => (await pool.query("SELECT count(*)::int AS count FROM cabins WHERE id=$1", [disposable])).rows[0].count).toBe(0);
  await page.goto(`/en/admin/categories?q=${prefix}`);
  await page.locator(".admin-edit-details > summary").click();
  const categoryDelete = page.locator(".admin-edit-details form").last();
  await confirm(page, categoryDelete);
  await expect(categoryDelete.locator(".form-error")).toBeVisible();
});

test("role changes are confirmed, last super administrator is protected, sessions are revoked", async ({ page, context }) => {
  await session(context, superAdmin);
  await page.goto(`/en/admin/users?q=${encodeURIComponent(prefix + "@qa.invalid")}`);
  await page.locator(".admin-row-details > summary").click();
  const form = page.locator(".admin-row-actions form").first();
  await chooseOption(page, form.getByRole("combobox"), "Owner");
  await confirm(page, form);
  await expect.poll(async () => (await pool.query("SELECT role FROM users WHERE id=$1", [guest])).rows[0].role).toBe("OWNER");
  expect((await pool.query("SELECT count(*)::int AS count FROM sessions WHERE user_id=$1", [guest])).rows[0].count).toBe(0);
  await page.goto(`/en/admin/users?q=${encodeURIComponent(prefix + "-super@qa.invalid")}`);
  await page.locator(".admin-row-details > summary").click();
  const own = page.locator(".admin-row-actions form").first();
  await chooseOption(page, own.getByRole("combobox"), "Traveler");
  await confirm(page, own);
  await expect(own.locator(".form-error")).toBeVisible();
  expect((await pool.query("SELECT role FROM users WHERE id=$1", [superAdmin])).rows[0].role).toBe("SUPER_ADMIN");
});

test("operational pages fit mobile and tablet without hydration errors", async ({ page, context }) => {
  test.setTimeout(180000);
  await session(context, process.env.QA_ADMIN_ID!);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of ["ru", "kg", "en"]) {
    for (const [section, width] of [["calendar", 320], ["cabins", 375], ["bookings", 430], ["payments", 768], ["categories", 375], ["settings", 375]] as const) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}/admin/${section}`);
      await expect(page.locator(".admin-section-heading")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1050 }); await page.goto("/ru/admin");
  await page.screenshot({ path: "test-results-admin/admin-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 375, height: 900 }); await page.goto("/ru/admin/calendar");
  await page.screenshot({ path: "test-results-admin/admin-calendar-mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});
