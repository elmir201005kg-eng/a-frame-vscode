import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import { createHash, randomBytes } from "node:crypto";
import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { Pool } from "pg";
import { adminSections } from "../lib/admin-navigation";

test.skip(!process.env.QA_SCHEMA, "Run with node scripts/spacing-qa.mjs and its isolated database fixtures.");
const connection = new URL(process.env.E2E_DATABASE_URL!);
const schema = connection.searchParams.get("schema");
if (!schema || !/^aframe_qa_[a-f0-9]{12}$/.test(schema) || schema !== process.env.QA_SCHEMA) {
  throw new Error("Spacing checks may only write to the runner's isolated QA schema.");
}
const pool = new Pool({ connectionString: connection.toString(), options: `-c search_path=${schema}`, connectionTimeoutMillis: 10000, statement_timeout: 15000 });
const phase = process.env.SPACING_QA_PHASE === "before" ? "before" : "after";
const widths = (process.env.SPACING_QA_WIDTHS || "320,375,390,430,768,1024,1440").split(",").map(Number);
const root = `.next/spacing-qa/${phase}`;
let traveler: string, cabinId: string, bookingId: string;

test.beforeAll(async () => {
  traveler = (await pool.query(`INSERT INTO users(email,first_name,last_name,phone,password_hash,role,updated_at)
    SELECT $1,'Айдана','Тестовая фамилия для проверки переноса','+996555123456',password_hash,'USER',NOW()
    FROM users WHERE id=$2 ON CONFLICT(email) DO UPDATE SET first_name=EXCLUDED.first_name RETURNING id`, ["spacing@qa.invalid", process.env.QA_OWNER_ID])).rows[0].id;
  cabinId = (await pool.query("SELECT id FROM cabins WHERE slug='qa-cabin-1'")).rows[0].id;
  await pool.query("UPDATE cabins SET description=$1,description_kg=$1,description_en=$1 WHERE id=$2", [
    "Уютный домик для отдыха в Кыргызстане. Просторная гостиная, кухня и терраса с видом на горы.\n\n" +
    "Это длинное описание проверяет, что весь динамический текст доступен на узких экранах и не обрезается высотой контейнера. ".repeat(8), cabinId,
  ]);
  await pool.query("INSERT INTO favorites(user_id,cabin_id) VALUES($1,$2) ON CONFLICT DO NOTHING", [traveler, cabinId]);
  bookingId = (await pool.query(`INSERT INTO bookings(booking_number,user_id,cabin_id,check_in,check_out,guests_count,
    guest_name,guest_phone,guest_email,price_per_night,nights,subtotal,total_amount,status,updated_at)
    VALUES($1,$2,$3,CURRENT_DATE-20,CURRENT_DATE-18,2,'Айдана Тестовая фамилия','+996555123456',
    'traveler@qa.invalid',1100,2,2200,2200,'COMPLETED',NOW())
    ON CONFLICT(booking_number) DO UPDATE SET guest_name=EXCLUDED.guest_name RETURNING id`,
  ["SPACING-AUDIT", traveler, cabinId])).rows[0].id;
  await mkdir(root, { recursive: true });
});
test.afterAll(async () => { await pool.end(); });

async function authorized(browser: Browser, width: number, userId?: string) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", serviceWorkers: "block" });
  if (userId) {
    const token = randomBytes(32).toString("hex");
    await pool.query("INSERT INTO sessions(id,user_id,expires_at,admin_verified_at) VALUES($1,$2,NOW()+INTERVAL '1 hour',NOW())",
      [createHash("sha256").update(token).digest("hex"), userId]);
    await context.addCookies([{ name: "a-frame-session", value: token, url: `http://localhost:${process.env.E2E_PORT || 3123}`, httpOnly: true, sameSite: "Lax" }]);
  }
  return context;
}

function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => {
    if (message.type() === "error" && /hydrat|did not match|maximum update depth/i.test(message.text())) errors.push(message.text());
  });
  return errors;
}

async function inspectPaths(context: BrowserContext, paths: string[], width: number, role: string) {
  const records: Awaited<ReturnType<typeof inspect>>[] = [];
  // Keep one active tab: Chromium can time out a View Transition in a
  // background tab while another tab is being captured.
  const page = await context.newPage();
  const errors = monitor(page);
  try {
    for (const path of paths) records.push(await inspect(page, path, width, role));
    expect(errors, `${role}/${width}: browser errors`).toEqual([]);
  } finally { await page.close(); }
  return records;
}

async function inspect(page: Page, path: string, width: number, role: string) {
  await writeFile(`${root}/progress.json`, JSON.stringify({ width, role, path, time: new Date().toISOString() }));
  const response = await page.goto(path, { waitUntil: "load" });
  await expect(page.locator("h1:visible, .admin-section-heading h2:visible").first()).toBeVisible();
  await expect(page.locator(".site-header[aria-busy]")).toHaveCount(0);
  await page.evaluate(() => document.fonts.ready);
  const metrics = await page.evaluate(() => {
    const visible = (e: Element) => e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().height > 0;
    const rect = (e: Element) => e.getBoundingClientRect();
    const main = document.querySelector("main");
    const footer = document.querySelector(".site-footer");
    const header = document.querySelector(".site-header:not([aria-busy])");
    const sections = [...document.querySelectorAll(".reassurance-row,.cabins-section,.destinations-section,.story-section,.benefits-section,.how-section,.owner-section,.faq-section")];
    const heading = document.querySelector(".product-page-heading");
    const copy = document.querySelector(".footer-copyright");
    return {
      documentHeight: document.documentElement.scrollHeight,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      mainHeight: main ? rect(main).height : null,
      mainPadding: main ? [getComputedStyle(main).paddingTop, getComputedStyle(main).paddingBottom] : [],
      mainMinHeight: main ? getComputedStyle(main).minHeight : null,
      footerHeight: footer ? rect(footer).height : null,
      footerCentered: footer && copy ? Math.abs((rect(copy).left + rect(copy).right - rect(footer).left - rect(footer).right) / 2) < 2 : null,
      headerHeight: header ? rect(header).height : null,
      headingGap: heading ? parseFloat(getComputedStyle(heading).marginBottom) : null,
      sections: sections.map((e, index) => ({
        name: e.className, height: rect(e).height,
        gapBefore: index ? rect(e).top - rect(sections[index - 1]).bottom : null,
        marginTop: getComputedStyle(e).marginTop, marginBottom: getComputedStyle(e).marginBottom,
      })),
      clippedText: [...document.querySelectorAll(".property-description,.review-card p,.product-notice,.notification-card p,.booking-list-card h2")]
        .filter(e => visible(e) && (e.scrollHeight > e.clientHeight + 2 || e.scrollWidth > e.clientWidth + 2)).map(e => e.className || e.tagName),
      overflowing: [...document.querySelectorAll("body *")].filter(e => {
        if (!visible(e) || e.closest(".records-table-wrap,.admin-table-scroll,.property-gallery-thumbs,[data-radix-popper-content-wrapper]")) return false;
        return rect(e).left < -1 || rect(e).right > innerWidth + 1;
      }).slice(0, 12).map(e => `${e.tagName}.${e.className}`),
      cardHeights: [...document.querySelectorAll(".cabin-card")].filter(visible).map(e => rect(e).height),
      authHeight: document.querySelector(".auth-layout") ? rect(document.querySelector(".auth-layout")!).height : null,
    };
  });
  expect(response?.status(), path).toBeLessThan(path.endsWith("not-a-page") ? 500 : 400);
  if (phase === "after") {
    expect.soft(metrics.overflow, `${role} ${path} at ${width}: ${metrics.overflowing.join(", ")}`).toBe(false);
    expect.soft(metrics.clippedText, `${role} ${path} at ${width}: dynamic text clipping`).toEqual([]);
    if (metrics.footerCentered !== null) expect(metrics.footerCentered).toBe(true);
    if (metrics.headingGap !== null) expect(metrics.headingGap).toBeLessThanOrEqual(24);
    if (path === "/ru") {
      for (const section of metrics.sections.slice(1)) expect(section.gapBefore, section.name).toBeLessThanOrEqual(width < 768 ? 40 : 64);
    }
  }
  await appendFile(`${root}/measurements.jsonl`, JSON.stringify({ path, role, width, ...metrics }) + "\n");
  if ([320, 390, 1440].includes(width)) {
    const name = `${role}-${path.replace(/[^a-zA-Z0-9-]+/g, "_")}`;
    // Finish the route transition before capturing. Viewport shots preserve
    // the emulated screen size; full-page captures are available on request.
    await page.evaluate(async () => {
      const current = document as Document & { activeViewTransition?: { finished: Promise<void> } };
      await current.activeViewTransition?.finished.catch(() => {});
    });
    await page.screenshot({ path: `${root}/${width}-${name}.png`, fullPage: phase === "before" || process.env.SPACING_QA_FULL_PAGE === "true", animations: "disabled", caret: "initial" });
  }
  return { path, role, width, ...metrics };
}

for (const width of widths) {
  test(`spacing audit: all route layouts at ${width}px`, async ({ browser }) => {
    test.setTimeout(300000);
    const records = [];
    const roleRoutes: { role: string; id?: string; paths: string[] }[] = [
      { role: "public", paths: ["", "catalog", "catalog?q=zzzz-no-results", "cabins/qa-cabin-1", "login", "register", "terms", "privacy", "admin-login", "offline", "not-a-page"] },
      { role: "traveler", id: traveler, paths: ["account", "account?tab=profile", "account?tab=favorites", "account?tab=payments", "account?tab=notifications", "account?tab=settings", "owner", "booking?cabin=qa-cabin-1", `bookings/${bookingId}`] },
      { role: "owner", id: process.env.QA_OWNER_ID, paths: ["owner", "owner?tab=cabins", "owner?tab=bookings", "owner?tab=profile", "owner/cabins/new", `owner/cabins/${cabinId}`] },
      { role: "admin", id: process.env.QA_ADMIN_ID, paths: ["admin", ...adminSections.filter(s => s !== "dashboard").map(s => `admin/${s}`)] },
    ];
    for (const { role, id, paths } of roleRoutes) {
      const context = await authorized(browser, width, id);
      try {
        records.push(...await inspectPaths(context, paths.map(path => `/ru${path ? "/" + path : ""}`), width, role));
      } finally { await context.close(); }
    }
    await writeFile(`${root}/${width}.json`, JSON.stringify(records, null, 2));
    console.log(`${phase}: ${records.length} routes checked at ${width}px; overflows: ${records.filter(r => r.overflow).map(r => r.path).join(", ") || "none"}`);
  });
}

test("spacing audit: Kyrgyz and English layouts with long content", async ({ browser }) => {
  test.skip(phase === "before", "Baseline route matrix is sufficient before styling changes.");
  test.setTimeout(300000);
  const records = [];
  for (const locale of ["kg", "en"]) {
    for (const width of [320, 430, 1440]) {
      const context: BrowserContext = await authorized(browser, width);
      const signedIn = await authorized(browser, width, traveler);
      try {
        for (const [role, current, paths] of [
          ["public", context, ["", "catalog", "cabins/qa-cabin-1", "login", "register", "terms", "privacy", "admin-login"]],
          ["traveler", signedIn, ["account?tab=settings", "account?tab=favorites", "booking?cabin=qa-cabin-1", `bookings/${bookingId}`]],
        ] as const) {
          records.push(...await inspectPaths(current, paths.map(path => `/${locale}${path ? "/" + path : ""}`), width, role));
        }
      } finally { await context.close(); await signedIn.close(); }
    }
  }
  await writeFile(`${root}/translations.json`, JSON.stringify(records, null, 2));
  console.log(`${records.length} translated route/width combinations checked.`);
});
