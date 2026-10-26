import { test, expect } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { Pool } from "pg";
import en from "../app/i18n/locales/en/common.json" with { type: "json" };

const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema") || "public";
if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(schema)) throw new Error("Invalid test database schema");
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}` });
const accounts = new Set<string>();
const password = "Aframe-qa-2026!";
const base = `http://localhost:${process.env.E2E_PORT || 3107}`;

test.afterAll(async () => {
  for (const email of accounts) {
    const user = (await pool.query("SELECT id FROM users WHERE email = $1", [email])).rows[0];
    if (user) {
      await pool.query("DELETE FROM sessions WHERE user_id = $1", [user.id]);
      await pool.query("DELETE FROM owner_profiles WHERE user_id = $1", [user.id]);
      await pool.query("DELETE FROM users WHERE id = $1", [user.id]);
    }
  }
  await pool.end();
});

test("registration, hashed session, reload, logout, invalid password and session rotation", async ({ page, context }) => {
  const email = `auth-qa-${randomBytes(8).toString("hex")}@example.com`;
  accounts.add(email);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && /hydration|hydrated|did not match/i.test(message.text())) errors.push(message.text()); });
  await page.goto("/ru/register");
  await page.getByLabel("Имя", { exact: true }).fill("QA Traveller");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Телефон", { exact: true }).fill("+996 555 123456");
  await page.getByLabel("Пароль", { exact: true }).fill(password);
  await page.getByLabel("Повторите пароль", { exact: true }).fill("different-password");
  await page.getByRole("button", { name: "Создать аккаунт", exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/register/);
  await expect.poll(async () => {
    const nativeError = await page.getByLabel("Повторите пароль", { exact: true }).evaluate((element) => (element as HTMLInputElement).validationMessage);
    return nativeError || (await page.locator(".auth-form [role='alert']").allTextContents()).join("").trim();
  }).toBe("Пароли не совпадают.");
  await page.getByLabel("Пароль", { exact: true }).fill(password);
  await page.getByLabel("Повторите пароль", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Создать аккаунт", exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/account$/);
  const cookie = (await context.cookies()).find((cookie) => cookie.name === "a-frame-session")!;
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.sameSite).toBe("Lax");
  const user = (await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email])).rows[0];
  expect(user.password_hash).toMatch(/^scrypt-v1\$/);
  expect(user.password_hash).not.toContain(password);
  const session = (await pool.query("SELECT id, user_id FROM sessions WHERE id = $1", [createHash("sha256").update(cookie.value).digest("hex")])).rows[0];
  expect(session?.user_id).toBe(user.id);
  await page.reload();
  const avatar = page.getByRole("button", { name: /Ваш личный кабинет: QA Traveller/ });
  await expect(avatar).toBeVisible();
  await avatar.click();
  await expect(page.getByRole("link", { name: "Мой профиль", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Мои бронирования", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(avatar).toBeFocused();
  await page.setViewportSize({ width: 320, height: 900 });
  await expect(avatar).toBeVisible();
  await avatar.click();
  await expect(page.locator("#header-account-dropdown").getByRole("link", { name: "Настройки", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.getByRole("button", { name: "Выйти", exact: true }).click();
  await expect(page).toHaveURL(/\/ru$/);
  expect((await pool.query("SELECT id FROM sessions WHERE id = $1", [session.id])).rows).toHaveLength(0);
  await context.addCookies([{ name: cookie.name, value: cookie.value, url: base }]);
  await page.goto("/ru/account");
  await expect(page).toHaveURL(/\/ru\/login/);
  await context.clearCookies();
  await page.goto("/ru/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Пароль", { exact: true }).fill("Wrong-password-123");
  await page.getByRole("button", { name: "Войти", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Пароль", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Войти", exact: true }).click();
  await expect(page).toHaveURL(/\/ru\/account/);
  const fresh = (await context.cookies()).find((item) => item.name === cookie.name)!;
  expect(fresh.value).not.toBe(cookie.value);
  await pool.query("UPDATE sessions SET expires_at = $1 WHERE user_id = $2", [new Date(0), user.id]);
  await page.reload();
  await expect(page).toHaveURL(/\/ru\/login/);
  expect(errors).toEqual([]);
});

test("owner registration preserves the existing owner profile and dashboard flow", async ({ page }) => {
  const email = `auth-qa-owner-${randomBytes(8).toString("hex")}@example.com`;
  accounts.add(email);
  await page.goto("/en/register?role=OWNER");
  await expect(page.locator(".auth-form input[name='role']:checked")).toHaveValue("OWNER");
  await expect(page.locator(".auth-form input[name='role'][value='OWNER']")).toBeEnabled();
  await page.locator(".auth-form input[name='role'][value='OWNER']").focus();
  await expect(page.locator(".auth-form input[name='role'][value='OWNER']")).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".auth-form input[name='role'][value='USER']")).toBeChecked();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".auth-form input[name='role'][value='OWNER']")).toBeChecked();
  await page.getByLabel(en.labels.name, { exact: true }).fill("QA Owner");
  await page.getByLabel(en.labels.email, { exact: true }).fill(email);
  await page.getByLabel(en.labels.phone, { exact: true }).fill("+996 555 123456");
  await page.getByLabel(en.labels.password, { exact: true }).fill(password);
  await page.getByLabel(en.labels.confirmPassword, { exact: true }).fill(password);
  await page.locator(".auth-form button[type='submit']").click();
  await expect(page).toHaveURL(/\/en\/owner$/);
  const profiles = await pool.query("SELECT o.id FROM owner_profiles o JOIN users u ON u.id = o.user_id WHERE u.email = $1 AND u.role = 'OWNER'", [email]);
  expect(profiles.rows).toHaveLength(1);
});

for (const locale of ["ru", "kg", "en"]) {
  test(`${locale}: auth tabs, desktop/tablet/mobile layout and hydration`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error" && /hydration|hydrated|did not match/i.test(message.text())) errors.push(message.text()); });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      for (const mode of ["login", "register"]) {
        await page.goto(`/${locale}/${mode}`);
        await expect(page.locator(".auth-tabs a[aria-current='page']")).toHaveAttribute("href", new RegExp(`/${mode}`));
        await expect(page.locator(".header-sign-in")).toBeVisible();
        await expect(page.locator(".google-auth-button")).toBeVisible();
        await expect.poll(() => page.locator(".google-auth-button img").evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      }
    }
    await page.locator(".auth-tabs a").first().click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/login`));
    await page.goto(`/${locale}/login?error=constructor`);
    await expect(page.locator(".auth-form [role='alert']")).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("Google OAuth uses PKCE and nonce, rejects CSRF, handles cancellation and consumes state", async ({ request }) => {
  const start = await request.post("/api/auth/google", { form: { locale: "en", next: "/en/account", role: "USER" }, headers: { origin: base }, maxRedirects: 0 });
  expect(start.status()).toBe(303);
  const target = new URL(start.headers().location);
  expect(target.origin).toBe("https://accounts.google.com");
  expect(target.searchParams.get("scope")).toBe("openid email profile");
  expect(target.searchParams.get("code_challenge_method")).toBe("S256");
  expect(target.searchParams.get("code_challenge")).toMatch(/^[\w-]{43}$/);
  expect(target.searchParams.get("state")).toMatch(/^[a-f0-9]{64}$/);
  expect(target.searchParams.get("nonce")).toMatch(/^[a-f0-9]{64}$/);
  expect(target.searchParams.has("client_secret")).toBe(false);
  expect(target.searchParams.get("redirect_uri")).toBe(`${base}/api/auth/callback/google`);
  const cancelled = await request.get(`/api/auth/callback/google?state=${target.searchParams.get("state")}&error=access_denied`, { maxRedirects: 0 });
  expect(cancelled.headers().location).toContain("error=googleCancelled");
  const replay = await request.get(`/api/auth/callback/google?state=${target.searchParams.get("state")}&error=access_denied`, { maxRedirects: 0 });
  expect(replay.headers().location).toContain("error=googleSessionExpired");
  const denied = await request.post("/api/auth/google", { form: { locale: "en" }, headers: { origin: "https://attacker.example" }, maxRedirects: 0 });
  expect(denied.headers().location).toContain("error=forbidden");
  const retry = await request.post("/api/auth/google", { form: { locale: "en" }, headers: { origin: base }, maxRedirects: 0 });
  expect(new URL(retry.headers().location).origin).toBe("https://accounts.google.com");
  const tampered = await request.get("/api/auth/callback/google?state=" + "0".repeat(64) + "&code=invalid", { maxRedirects: 0 });
  expect(tampered.headers().location).toContain("error=googleSessionExpired");
  const fresh = await request.post("/api/auth/google", { form: { locale: "en", next: "/en/%2e%2e/login" }, headers: { origin: base }, maxRedirects: 0 });
  const state = new URL(fresh.headers().location).searchParams.get("state");
  const invalidCode = await request.get(`/api/auth/callback/google?state=${state}&code=invalid-grant`, { maxRedirects: 0 });
  expect(invalidCode.headers().location).toContain("error=googleFailed");
  expect(invalidCode.headers().location).toContain("next=%2Fen%2Faccount");
  expect((await request.storageState()).cookies.some((cookie) => cookie.name === "a-frame-session")).toBe(false);
});
