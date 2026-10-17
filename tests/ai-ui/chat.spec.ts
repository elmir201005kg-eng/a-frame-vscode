import { test, expect } from "@playwright/test";

const labels = {
  ru: { open: "Открыть AI-консультанта", clear: "Очистить переписку", placeholder: "Спросите о домиках и бронировании…", send: "Отправить сообщение", question: "Как забронировать домик?", offline: "Справка · без AI", answer: "Выберите домик в каталоге", refusal: "Я могу помочь только с вопросами", quick: "📅 Как забронировать?" },
  kg: { open: "AI жардамчыны ачуу", clear: "Кат алышууну тазалоо", placeholder: "Үйлөр жана брондоо тууралуу сураңыз…", send: "Билдирүү жөнөтүү", question: "Үйдү кантип брондойм?", offline: "Маалымат · AI жок", answer: "Каталогдон үй тандап", refusal: "боюнча гана суроолорго", quick: "📅 Кантип брондойм?" },
  en: { open: "Open AI assistant", clear: "Clear conversation", placeholder: "Ask about cabins and bookings…", send: "Send message", question: "How do I book a cabin?", offline: "Help · AI offline", answer: "Choose a cabin in the catalog", refusal: "I can only help with questions", quick: "📅 How do I book?" },
};
for (const locale of ["ru", "kg", "en"] as const) {
  test(`${locale}: real API fallback, localized refusal, reload and clear`, async ({ page }) => {
    const t = labels[locale];
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(`/${locale}`);
    await expect(page.locator("[data-ai-widget]")).toHaveCSS("position", "fixed");
    await page.getByRole("button", { name: t.open, exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: t.quick, exact: true }).click();
    await expect(dialog.getByRole("log")).toContainText(t.answer);
    await expect(dialog.getByRole("log")).toContainText(t.offline);
    await dialog.getByRole("textbox").fill("Write Python code");
    await dialog.getByRole("button", { name: t.send }).click();
    await expect(dialog.getByRole("log")).toContainText(t.refusal);
    await page.reload();
    await page.getByRole("button", { name: t.open, exact: true }).click();
    await expect(dialog.getByRole("log")).toContainText(t.answer);
    await expect(dialog.getByRole("log")).toContainText(t.refusal);
    await dialog.getByRole("button", { name: t.clear }).click();
    await expect(dialog.getByRole("log")).not.toContainText(t.answer);
    await expect(dialog.getByRole("button", { name: t.quick, exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("mobile chat fits the viewport and retains the site's language on navigation", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/ru");
  await page.getByRole("button", { name: labels.ru.open, exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull(); expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(360); expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/ai/mobile-chat.png" });
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.locator(".language-switcher").getByRole("combobox").click();
  await page.getByRole("option", { name: /Кыргызча/ }).click();
  await expect(page).toHaveURL(/\/kg/);
  await page.getByRole("button", { name: labels.kg.open, exact: true }).click();
  await expect(page.getByRole("textbox", { name: labels.kg.placeholder })).toBeVisible();
});

test("network failure can be retried without duplicate user messages", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: labels.en.open, exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  let calls = 0;
  await page.route("**/api/ai/chat", async route => { if (++calls === 1) await route.abort("failed"); else await route.continue(); });
  await dialog.getByRole("textbox").fill(labels.en.question);
  await dialog.getByRole("button", { name: labels.en.send }).click();
  await expect(dialog.getByRole("alert")).toContainText("Could not get a reply");
  await dialog.getByRole("button", { name: "Try again" }).click();
  await expect(dialog.getByRole("log")).toContainText(labels.en.answer);
  await expect(dialog.getByText(labels.en.question, { exact: true })).toHaveCount(1);
  await page.screenshot({ path: "test-results/ai/desktop-chat.png" });
});

test("clearing during a request discards late responses and stops the typing state", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: labels.en.open, exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/ai/chat", async route => { await gate; await route.fulfill({ json: { message: "Late response", mode: "faq", links: [] } }).catch(() => {}); });
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill(labels.en.question);
  await dialog.getByRole("button", { name: labels.en.send }).click();
  await expect(dialog.getByText("AI is typing…")).toBeVisible();
  await dialog.getByRole("button", { name: labels.en.clear }).click();
  release();
  await expect(dialog.getByText("AI is typing…")).not.toBeVisible();
  await expect(dialog.getByText("Late response")).not.toBeVisible();
  await expect(dialog.getByRole("textbox")).toBeEnabled();
});
