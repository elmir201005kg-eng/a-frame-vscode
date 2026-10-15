import { expect, type Locator, type Page } from "@playwright/test";

export async function chooseOption(page: Page, trigger: Locator, label: string, display = label) {
  await trigger.click();
  await page.getByRole("option", { name: label, exact: true }).click();
  await expect(trigger).toContainText(display);
}

export async function chooseDay(page: Page, value: string) {
  const calendar = page.locator(".premium-calendar-popover");
  for (let attempt = 0; attempt < 24; attempt++) {
    if (await calendar.locator(`button[data-date="${value}"]`).count()) {
      await calendar.locator(`button[data-date="${value}"]`).click();
      return;
    }
    const shown = await calendar.locator("button[data-date]").first().getAttribute("data-date");
    await calendar.locator(".calendar-nav").nth(shown && shown > value ? 0 : 1).click();
  }
  throw new Error(`Calendar could not reach ${value}`);
}

export async function chooseRange(page: Page, form: Locator, start: string, end: string) {
  await form.locator(".premium-range-field button").first().click();
  await chooseDay(page, start);
  await chooseDay(page, end);
  await expect(form.locator("input[name='checkIn']")).toHaveValue(start);
  await expect(form.locator("input[name='checkOut']")).toHaveValue(end);
}

export async function setGuests(page: Page, form: Locator, value: string) {
  await form.locator(".premium-guest-trigger").click();
  await page.locator(".premium-step-value input").fill(value);
  await page.keyboard.press("Escape");
  await expect(form.locator("input[name='guests']")).toHaveValue(value);
}
