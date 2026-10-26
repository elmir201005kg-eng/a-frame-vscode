import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { Pool } from "pg";
import { chooseRange, setGuests } from "./form-controls";

test.skip(process.env.QA_DEMO_CHECKOUT !== "true", "Run node scripts/demo-checkout-qa.mjs for an isolated database and mocked Finik provider.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (process.env.QA_DEMO_CHECKOUT === "true" && !/^aframe_demo_qa_[a-f0-9]{12}$/.test(schema)) throw new Error("Demo checkout tests require an isolated schema.");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
const base = `http://localhost:${process.env.E2E_PORT || 3112}`;
const callbackOrigin = "https://callbacks.demo-checkout.invalid";
const cabinPath = "/ru/cabins/demo-checkout-cabin";
const uuid = /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
let guest: string;

function futureDay(offset: number) {
  return new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);
}
async function session(context: BrowserContext) {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at) VALUES($1,$2,$3)", [createHash("sha256").update(token).digest("hex"), guest, new Date(Date.now() + 3600000)]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: base, httpOnly: true, sameSite: "Lax" }]);
}
async function interceptCheckout(page: Page) {
  await page.route("https://checkout.finik.invalid/**", route => route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Finik checkout test</h1>" }));
}
async function providerRequests() {
  return (await readFile(process.env.QA_FINIK_JOURNAL!, "utf8")).trim().split("\n").filter(Boolean).map(line => JSON.parse(line));
}

test.beforeAll(async () => {
  guest = (await pool.query("SELECT id FROM users WHERE email='guest@demo-qa.invalid'")).rows[0].id;
});
test.afterAll(async () => { await pool.end(); });

test("demo button opens HTTPS Finik checkout directly for 5 KGS with the selected stay", async ({ page, context }) => {
  await session(context);
  await interceptCheckout(page);
  const checkIn = futureDay(25), checkOut = futureDay(27);
  await page.goto(cabinPath);
  const selector = page.locator(".stay-selector");
  await chooseRange(page, selector, checkIn, checkOut);
  await setGuests(page, selector, "3");
  const requestKey = await selector.locator('input[name="requestKey"]').inputValue();
  expect(requestKey).toMatch(uuid);
  await expect(selector).toContainText(/5\s*сом/);
  await selector.getByRole("button", { name: "Создать тестовую заявку", exact: true }).click();
  await expect(page).toHaveURL(/^https:\/\/checkout\.finik\.invalid\/payment\//, { timeout: 60000 });
  const checkout = new URL(page.url());
  expect(checkout.searchParams.get("amount")).toBe("5");
  expect(checkout.searchParams.get("currency")).toBe("KGS");
  const rows = (await pool.query("SELECT b.*, b.check_in::text AS start_date, b.check_out::text AS end_date, p.amount::text AS payment_amount,p.currency,p.provider_payment_id,p.payment_url,p.status AS payment_status FROM bookings b JOIN payments p ON p.booking_id=b.id WHERE b.request_key=$1", [requestKey])).rows;
  expect(rows).toHaveLength(1);
  const booking = rows[0];
  expect(booking.booking_number).toMatch(/^DEMO-/);
  expect(booking.user_id).toBe(guest);
  expect(booking.start_date).toBe(checkIn);
  expect(booking.end_date).toBe(checkOut);
  expect(booking.guests_count).toBe(3);
  expect(booking.guest_name).toBe("Demo Guest");
  expect(booking.guest_phone).toBe("+996555123456");
  expect(booking.guest_email).toBe("guest@demo-qa.invalid");
  expect(Number(booking.payment_amount)).toBe(5);
  expect(booking.currency).toBe("KGS");
  expect(booking.provider_payment_id).toMatch(uuid);
  expect(booking.payment_url).toBe(page.url());
  expect(booking.payment_status).toBe("PENDING");
  const request = (await providerRequests()).find(item => item.PaymentId === booking.provider_payment_id);
  expect(request.Amount).toBe(5);
  expect(request.RedirectUrl).toBe(`${callbackOrigin}/ru/bookings/${booking.id}?payment=success`);
  expect(request.Data.webhookUrl).toBe(`${callbackOrigin}/api/finik/webhook`);
  expect(JSON.parse(request.Data.metadata)).toMatchObject({ bookingId: booking.id, userId: guest, paymentId: booking.provider_payment_id });
});

test("provider failure retries the same demo booking and payment UUID", async ({ page, context }) => {
  await session(context);
  await interceptCheckout(page);
  await writeFile(process.env.QA_FINIK_CONTROL!, JSON.stringify({ failNext: true }));
  const checkIn = futureDay(35);
  await page.goto(`${cabinPath}?checkIn=${checkIn}&checkOut=${futureDay(36)}&guests=2`);
  const selector = page.locator(".stay-selector");
  const requestKey = await selector.locator('input[name="requestKey"]').inputValue();
  const submit = selector.getByRole("button", { name: "Создать тестовую заявку", exact: true });
  await submit.click();
  await expect(page).toHaveURL(/\/ru\/bookings\/\d+\?payment=failed$/, { timeout: 60000 });
  await expect(page.locator(".booking-details-layout .form-error[role='alert']")).toBeVisible();
  const first = (await pool.query("SELECT b.id,p.id AS payment_id,p.provider_payment_id FROM bookings b JOIN payments p ON p.booking_id=b.id WHERE b.request_key=$1", [requestKey])).rows;
  expect(first).toHaveLength(1);
  // Expire only the isolated attempt's short in-flight lock, without a real wait.
  await pool.query("UPDATE payments SET created_at=NOW()-INTERVAL '31 seconds' WHERE id=$1", [first[0].payment_id]);
  await page.getByRole("button", { name: "Оплатить 5 сом", exact: true }).click();
  await expect(page).toHaveURL(/^https:\/\/checkout\.finik\.invalid\/payment\//, { timeout: 60000 });
  const retried = (await pool.query("SELECT b.id,p.id AS payment_id,p.provider_payment_id FROM bookings b JOIN payments p ON p.booking_id=b.id WHERE b.user_id=$1 AND b.check_in=$2::date", [guest, checkIn])).rows;
  expect(retried).toEqual(first);
  expect((await providerRequests()).filter(item => item.PaymentId === first[0].provider_payment_id)).toHaveLength(2);
});

test("anonymous demo checkout preserves selected dates and guests through login", async ({ page }) => {
  const checkIn = futureDay(45), checkOut = futureDay(47);
  await page.goto(cabinPath);
  const selector = page.locator(".stay-selector");
  await chooseRange(page, selector, checkIn, checkOut);
  await setGuests(page, selector, "3");
  await selector.getByRole("button", { name: "Создать тестовую заявку", exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/login\?next=/, { timeout: 60000 });
  const next = new URL(new URL(page.url()).searchParams.get("next")!, base);
  expect(next.pathname).toBe(cabinPath);
  expect(next.searchParams.get("checkIn")).toBe(checkIn);
  expect(next.searchParams.get("checkOut")).toBe(checkOut);
  expect(next.searchParams.get("guests")).toBe("3");
  await page.locator('input[name="email"]').fill("guest@demo-qa.invalid");
  await page.locator('input[name="password"]').fill("Aframe-demo-qa-2026!");
  await page.locator('.auth-form button[type="submit"]').click();
  await expect(page).toHaveURL(new RegExp(cabinPath), { timeout: 60000 });
  await expect(page.locator('.stay-selector input[name="checkIn"]')).toHaveValue(checkIn);
  await expect(page.locator('.stay-selector input[name="checkOut"]')).toHaveValue(checkOut);
  await expect(page.locator('.stay-selector input[name="guests"]')).toHaveValue("3");
  expect((await pool.query("SELECT id FROM bookings WHERE user_id=$1 AND check_in=$2::date", [guest, checkIn])).rows).toHaveLength(0);
});
