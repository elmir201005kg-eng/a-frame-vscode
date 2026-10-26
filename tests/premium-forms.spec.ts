import { test, expect, type BrowserContext, type Locator, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import { addDays, bishkekToday, validStay } from "../lib/stay-dates";
import ru from "../app/i18n/locales/ru/common.json" with { type: "json" };
import kg from "../app/i18n/locales/kg/common.json" with { type: "json" };
import en from "../app/i18n/locales/en/common.json" with { type: "json" };
import ruForms from "../app/i18n/locales/ru/forms.json" with { type: "json" };
import kgForms from "../app/i18n/locales/kg/forms.json" with { type: "json" };
import enForms from "../app/i18n/locales/en/forms.json" with { type: "json" };
import { chooseDay, chooseOption, chooseRange, setGuests } from "./form-controls";

test.skip(!process.env.QA_SCHEMA, "Use the isolated fixtures created by npm run test:performance.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (process.env.QA_SCHEMA && !/^aframe_qa_[a-f0-9]{12}$/.test(schema)) throw new Error("Premium form tests require a dedicated QA schema.");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
test.afterAll(async () => { await pool.end(); });

function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /hydration|hydrated|did not match|maximum update depth|not focusable/i.test(message.text())) errors.push(message.text());
  });
  return errors;
}
async function assertFits(page: Page, surface: Locator) {
  await expect(surface).toBeVisible();
  const bounds = await surface.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
}
async function authorize(context: BrowserContext, userId: string) {
  const token = randomBytes(32).toString("hex");
  await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',NOW())", [createHash("sha256").update(token).digest("hex"), userId]);
  await context.addCookies([{ name: "a-frame-session", value: token, url: `http://localhost:${process.env.E2E_PORT || 3107}`, httpOnly: true, sameSite: "Lax" }]);
}

test("date-only arithmetic, Bishkek midnight, leap years and unavailable nights", () => {
  expect(bishkekToday(new Date("2026-10-13T18:01:00Z"))).toBe("2026-10-14");
  expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  expect(validStay("2026-10-15", "2026-10-15", "2026-10-13")).toBe(false);
  expect(validStay("2026-10-12", "2026-10-15", "2026-10-13")).toBe(false);
  expect(validStay("2026-10-15", "2026-10-20", "2026-10-13", ["2026-10-17"])).toBe(false);
  expect(validStay("2026-10-15", "2026-10-17", "2026-10-13", ["2026-10-17"])).toBe(true);
});

for (const locale of ["ru", "kg", "en"] as const) {
  const common = { ru, kg, en }[locale], forms = { ru: ruForms, kg: kgForms, en: enForms }[locale];
  test(`${locale}: filters submit real values, selected options, guest count and removable chips`, async ({ page }) => {
    const errors = monitor(page);
    await page.goto(`/${locale}/catalog`);
    const form = page.locator(".catalog-filters-content form");
    await form.locator("input[name='q']").fill("QA");
    const region = form.getByRole("combobox").first();
    await region.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("option", { selected: true })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option").last()).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(form.locator("input[name='region']")).toHaveValue("issyk-kul");
    await region.click();
    await expect(page.getByRole("option", { selected: true })).toContainText({ ru: "Иссык-Куль", kg: "Ысык-Көл", en: "Issyk-Kul" }[locale]);
    await expect(page.getByRole("option", { selected: true }).locator(".premium-option-check")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(region).toBeFocused();
    await region.click();
    await expect(page.getByRole("option", { selected: true })).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(page.getByRole("option").first()).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("option").last()).toBeFocused();
    await page.keyboard.press("Escape");
    await form.locator("input[name='minPrice']").fill("1000");
    await form.locator("input[name='maxPrice']").fill("5000");
    await chooseRange(page, form, addDays(bishkekToday(), 20), addDays(bishkekToday(), 23));
    await setGuests(page, form, "2");
    await form.locator(".premium-filter-trigger").click();
    const wifi = page.locator(".premium-filter-option").filter({ hasText: "Wi-Fi" }).locator("input");
    await wifi.focus(); await page.keyboard.press("Space"); await expect(wifi).toBeChecked();
    await page.keyboard.press("Escape");
    await chooseOption(page, form.getByRole("combobox").last(), common.labels.priceDesc);
    expect(await form.evaluate(element => Object.fromEntries(new FormData(element as HTMLFormElement)))).toMatchObject({ region: "issyk-kul", guests: "2", amenity: "wifi", sort: "priceDesc", minPrice: "1000", maxPrice: "5000" });
    await form.getByRole("button", { name: common.labels.search, exact: true }).click();
    await expect(page).toHaveURL(/amenity=wifi/);
    await expect(page.locator(".catalog-page-results .cabin-card")).toHaveCount(6);
    await expect(page.locator(".catalog-page-results .cabin-card").first()).toContainText("QA Cabin 8");
    await page.locator(".active-filter-chip").filter({ hasText: "Wi-Fi" }).click();
    await expect(page).not.toHaveURL(/amenity=/);
    await expect(page).toHaveURL(/sort=priceDesc/);
    await expect(page).toHaveURL(/region=issyk-kul/);
    await page.locator(".catalog-reset").click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/catalog$`));
    await expect(page.locator(".active-filter-chip")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`${locale}: all six widths, portalled menus, keyboard Tab and calendar navigation`, async ({ page }) => {
    test.setTimeout(180000);
    page.setDefaultTimeout(15000);
    const errors = monitor(page);
    for (const width of [320, 375, 430, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      const form = page.locator(".search-form:visible");
      await expect(form).toBeVisible();
      await expect(form.locator(".premium-select-trigger")).toBeEnabled();
      await expect(page.locator("select:visible")).toHaveCount(0);
      const region = form.locator(".premium-select-trigger");
      const control = await region.boundingBox();
      expect(control!.height).toBeGreaterThanOrEqual(48);
      await region.click();
      await assertFits(page, page.locator(".premium-select-content"));
      if (locale === "ru" && (width === 375 || width === 1440)) await page.screenshot({ path: test.info().outputPath(`select-${width}.png`) });
      await page.keyboard.press("Tab");
      await expect(page.locator(".premium-select-content")).toHaveCount(0);
      await expect(form.locator(".premium-range-field button").first()).toBeFocused();
      await page.keyboard.press("Enter");
      await assertFits(page, page.locator(".premium-calendar-popover"));
      if (locale === "ru" && (width === 375 || width === 1440)) await page.screenshot({ path: test.info().outputPath(`calendar-${width}.png`) });
      const date = page.locator(".premium-calendar-popover button[data-date]:focus");
      await expect(date).toBeFocused();
      const initial = await date.getAttribute("data-date");
      await page.keyboard.press("ArrowRight");
      await expect(page.locator(".premium-calendar-popover button[data-date]:focus")).toHaveAttribute("data-date", addDays(initial!, 1));
      await page.keyboard.press("PageDown");
      expect((await page.locator(".premium-calendar-popover button[data-date]:focus").getAttribute("data-date"))!.slice(0, 7)).not.toBe(initial!.slice(0, 7));
      await page.keyboard.press("Escape");
      await form.locator(".premium-guest-trigger").click();
      await assertFits(page, page.locator(".premium-guest-popover"));
      await page.getByRole("button", { name: forms.increase, exact: true }).click();
      await expect(form.locator("input[name='guests']")).toHaveValue("1");
      await page.keyboard.press("Escape");
      await page.goto(`/${locale}/catalog`);
      await expect(page.locator(".catalog-page-results")).toBeVisible();
      if (width < 1024 && await page.locator(".catalog-filter-toggle").isVisible()) await page.locator(".catalog-filter-toggle").click();
      await page.locator(".premium-filter-trigger").click();
      await assertFits(page, page.locator(".premium-filter-popover"));
      await page.keyboard.press("Escape");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("blocked nights, checkout boundary, capacity, reset and a different browser time zone", async ({ browser }) => {
  const start = bishkekToday(), blocked = addDays(start, 3);
  const cabin = (await pool.query("SELECT id FROM cabins WHERE slug='qa-cabin-4'")).rows[0];
  await pool.query("INSERT INTO cabin_availability(cabin_id,date,status) VALUES($1,$2,'BLOCKED')", [cabin.id, blocked]);
  const context = await browser.newContext({ timezoneId: "America/Los_Angeles", viewport: { width: 375, height: 900 } });
  const page = await context.newPage(), errors = monitor(page);
  try {
    await page.goto(`http://localhost:${process.env.E2E_PORT || 3107}/ru/cabins/qa-cabin-4`);
    const form = page.locator(".stay-selector form");
    await expect(form.locator("input[name='checkIn']")).toHaveAttribute("min", start);
    await form.locator(".premium-range-field button").first().click();
    await expect(page.locator(`.premium-calendar-popover button[data-date='${blocked}']`)).toBeDisabled();
    await chooseDay(page, addDays(start, 1));
    await expect(page.locator(`.premium-calendar-popover button[data-date='${addDays(start, 4)}']`)).toBeDisabled();
    await expect(page.locator(`.premium-calendar-popover button[data-date='${blocked}']`)).toBeEnabled();
    await chooseDay(page, blocked);
    await form.locator(".premium-guest-trigger").click();
    await page.locator(".premium-step-value input").fill("50");
    await expect(page.locator(".premium-step-value input")).toHaveValue("4");
    await expect(page.getByRole("button", { name: ruForms.increase, exact: true })).toBeDisabled();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: ruForms.decrease, exact: true }).click();
    expect(await page.locator(".premium-step-value input").evaluate(element => element.getAnimations().length)).toBe(0);
    await page.keyboard.press("Escape");
    await expect(form.locator("input[name='guests']")).toHaveValue("3");
    await expect.poll(() => form.evaluate(element => (element as HTMLFormElement).checkValidity())).toBe(true);
    await form.getByRole("button", { name: ru.labels.confirmAvailability, exact: true }).click();
    await expect(page.locator(".stay-total")).toBeVisible();
    await form.evaluate(element => (element as HTMLFormElement).reset());
    await expect(form.locator(".premium-range-field button").first()).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await pool.query("DELETE FROM cabin_availability WHERE cabin_id=$1 AND date=$2", [cabin.id, blocked]);
  }
});

test("owner and admin forms retain required validation, selects, checkboxes and textarea submission", async ({ page, context }) => {
  const errors = monitor(page);
  await authorize(context, process.env.QA_OWNER_ID!);
  await page.goto("/ru/owner/cabins/new");
  await page.locator("#cabin-editor button[type='submit']").click();
  await expect(page).toHaveURL(/\/owner\/cabins\/new$/);
  const form = page.locator("#cabin-editor");
  await form.locator("[name='title']").fill("Premium QA cabin");
  await form.locator("[name='slug']").fill(`premium-qa-${randomBytes(4).toString("hex")}`);
  await form.locator("[name='description']").fill("A cabin saved through the shared premium textarea.");
  await form.locator("[name='address']").fill("QA address");
  await form.getByRole("button", { name: ru.labels.save, exact: true }).click();
    await expect(form.locator(".premium-select-trigger")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("listbox")).toBeVisible();
  await page.getByRole("option", { name: /Иссык-Куль|QA Region/ }).click();
  const amenity = form.locator(".premium-checkbox[name='amenities']").first();
  await amenity.focus(); await page.keyboard.press("Space"); await expect(amenity).toBeChecked();
  await form.getByRole("button", { name: ru.labels.save, exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/owner\/cabins\/\d+$/);
  await expect(page.getByRole("textbox", { name: ru.labels.description, exact: true })).toHaveValue("A cabin saved through the shared premium textarea.");
  await expect(page.locator("select:visible")).toHaveCount(0);
  await context.clearCookies();
  await authorize(context, process.env.QA_ADMIN_ID!);
  await page.goto("/ru/admin/regions");
  const region = page.locator(".admin-record").first();
  await region.locator("summary").click();
  const active = region.locator(".premium-checkbox");
  await expect(active).toBeChecked();
  await active.focus(); await page.keyboard.press("Space");
  await expect(active).not.toBeChecked();
  for (const locale of ["ru", "kg", "en"]) {
    await page.setViewportSize({ width: 320, height: 900 });
    for (const path of ["account?tab=profile", "admin/translations", "admin/settings"]) {
      await page.goto(`/${locale}/${path}`);
      await expect(page.locator("h1").first()).toBeVisible();
      await expect(page.locator("select:visible")).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("every admin Select exposes readable options, a selected indicator and Escape focus restoration", async ({ page, context }) => {
  test.setTimeout(180000);
  const errors = monitor(page);
  await authorize(context, process.env.QA_ADMIN_ID!);
  for (const section of ["", "regions", "amenities", "users", "owners", "cabins", "bookings", "reviews", "audit", "translations", "settings", "notifications"]) {
    await page.goto(`/ru/admin${section ? `/${section}` : ""}`);
    await expect(page.locator(".admin-content:visible")).toBeVisible();
    const triggers = page.locator(".admin-content:visible .premium-select-trigger");
    const count = await triggers.count();
    for (let index = 0; index < count; index++) {
      const trigger = triggers.nth(index);
      if (!await trigger.isVisible()) continue; // Collapsed record editors are opened below.
      await trigger.click();
      await expect(page.getByRole("listbox")).toBeVisible();
      const labels = await page.getByRole("option").allTextContents();
      expect(labels.length).toBeGreaterThan(0);
      expect(labels.every(label => label.trim().length > 0)).toBe(true);
      await expect(page.getByRole("option", { selected: true }).locator(".premium-option-check")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(trigger).toBeFocused();
    }
    const record = page.locator(".admin-content:visible details").first();
    if (await record.count()) {
      await record.locator("summary").first().click();
      const selects = record.locator(".premium-select-trigger");
      for (let index = 0; index < await selects.count(); index++) {
        await selects.nth(index).click();
        await expect(page.getByRole("listbox")).toBeVisible();
        expect((await page.getByRole("option").allTextContents()).every(label => label.trim().length > 0)).toBe(true);
        await page.keyboard.press("Escape");
        await expect(selects.nth(index)).toBeFocused();
      }
    }
  }
  expect(errors).toEqual([]);
});
