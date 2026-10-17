import { test, expect, type Page } from "@playwright/test";
import { formMessages } from "../app/i18n/forms";
import { addDays, bishkekToday } from "../lib/stay-dates";
import { chooseRange } from "./form-controls";

function hydrationErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /hydration|hydrated|did not match/i.test(message.text())) errors.push(message.text());
  });
  return errors;
}

for (const locale of ["kg", "en", "ru"] as const) {
  test(`form locale: ${locale} matches server HTML through hydration and reload`, async ({ page }) => {
    test.setTimeout(120000);
    const errors = hydrationErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of ["", "/catalog", "/cabins/qa-cabin-1"]) {
      const response = await page.goto(`/${locale}${path}`);
      expect(response?.ok()).toBe(true);
      const html = await response!.text();
      // Inspect the actual server response, including streamed HTML, before any
      // client rendering can conceal an incorrect language by replacing it.
      const serverDates = await page.evaluate(source => {
        const document = new DOMParser().parseFromString(source, "text/html");
        return [...document.querySelectorAll(".premium-date-range .premium-date-trigger")].map(button => ({
          text: button.querySelector("span")?.textContent,
          label: button.getAttribute("aria-label"),
        }));
      }, html);
      expect(serverDates, `SSR date controls for /${locale}${path}`).toHaveLength(2);
      for (const date of serverDates) {
        expect(date.text).toBe(formMessages[locale].selectDate);
        expect(date.label).toContain(formMessages[locale].selectDate);
      }
      if (path === "/catalog") await page.locator(".catalog-filter-toggle").click();
      const triggers = page.locator(".premium-date-range .premium-date-trigger");
      await expect(triggers).toHaveText([formMessages[locale].selectDate, formMessages[locale].selectDate]);
      await triggers.first().click();
      await expect(page.locator(".premium-calendar-hint")).toHaveText(formMessages[locale].rangeHint);
      await page.keyboard.press("Escape");
      await page.reload();
      await expect(triggers).toHaveText([formMessages[locale].selectDate, formMessages[locale].selectDate]);
      expect(errors).toEqual([]);
    }
  });
}

test("form locale: language changes keep calendar and guest controls consistent", async ({ page }) => {
  test.setTimeout(120000);
  const errors = hydrationErrors(page);
  await page.goto("/ru");
  for (const locale of ["kg", "en", "ru"] as const) {
    await page.locator(".language-switcher:visible .premium-select-trigger").click();
    await page.getByRole("option").and(page.locator(`[lang='${locale === "kg" ? "ky" : locale}']`)).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}$`));
    // Cache Components retains previous routes in hidden Activity trees.
    const form = page.locator(".search-form:visible");
    const dates = form.locator(".premium-date-trigger");
    await expect(dates).toHaveText([formMessages[locale].selectDate, formMessages[locale].selectDate]);
    await chooseRange(page, form, addDays(bishkekToday(), 10), addDays(bishkekToday(), 12));
    await expect(form.locator("input[name='checkIn']")).toHaveValue(addDays(bishkekToday(), 10));
    await expect(dates.first()).not.toHaveText(formMessages[locale].selectDate);
    await form.locator(".premium-guest-trigger").click();
    await page.getByRole("button", { name: formMessages[locale].increase, exact: true }).click();
    await expect(form.locator("input[name='guests']")).toHaveValue("1");
    await page.keyboard.press("Escape");
    await form.evaluate(element => (element as HTMLFormElement).reset());
    await expect(dates).toHaveText([formMessages[locale].selectDate, formMessages[locale].selectDate]);
    expect(errors).toEqual([]);
  }
});
