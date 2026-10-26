import { chromium, devices } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// Read-only browser measurements against an already running production server.
// Authentication, booking writes and admin mutations belong to the isolated QA runner.
const baseURL = process.env.PERFORMANCE_URL || "http://localhost:3115";
const label = process.argv[2] || "current";
if (!/^[a-z0-9_-]+$/i.test(label)) throw new Error("Use a simple artifact label.");
const output = resolve("performance-results", label);
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.E2E_BROWSER_CHANNEL || "chrome", headless: true });
const report = { baseURL, browser: browser.version(), measuredAt: new Date().toISOString(), profiles: [] };
const profiles = [
  { name: "desktop", viewport: { width: 1440, height: 900 }, cpu: 1 },
  { name: "mobile", ...devices["Pixel 7"], defaultBrowserType: undefined, cpu: 4 },
];
const paint = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
// Browser-side readiness avoids accessibility snapshots from repeated assertions
// distorting CPU-throttled measurements. Functional assertions live in E2E tests.
const visible = (page, selector) => page.waitForFunction(selector =>
  [...document.querySelectorAll(selector)].some(element => element.getClientRects().length > 0), selector,
{ polling: 50, timeout: 45000 });

try {
  for (const { name, cpu, ...options } of profiles) {
    const context = await browser.newContext({ ...options, baseURL, serviceWorkers: "block" });
    await context.addInitScript(() => {
      window.__audit = { longTasks: [], interactions: [], lcp: null, cls: 0 };
      document.addEventListener("click", event => {
        const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
        if (anchor) window.__audit.click = { href: anchor.href, time: performance.now() };
      }, true);
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.__audit.longTasks.push({ start: entry.startTime, ms: entry.duration });
      }).observe({ type: "longtask", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.interactionId) window.__audit.interactions.push({ name: entry.name, ms: entry.duration, inputDelay: entry.processingStart - entry.startTime });
        }
      }).observe({ type: "event", buffered: true, durationThreshold: 16 });
      new PerformanceObserver(list => {
        const entry = list.getEntries().at(-1);
        window.__audit.lcp = { ms: entry.startTime, url: entry.url, tag: entry.element?.tagName };
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__audit.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    const page = await context.newPage();
    page.setDefaultTimeout(45000);
    const cdp = await context.newCDPSession(page);
    await cdp.send("Performance.enable");
    if (process.env.PERFORMANCE_CPU_PROFILE === "true") {
      await cdp.send("Profiler.enable");
      await cdp.send("Profiler.start");
    }
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
    await cdp.send("Tracing.start", { categories: "devtools.timeline,v8,blink.user_timing,loading", transferMode: "ReturnAsStream" });
    const errors = [], network = [], failures = [];
    let documents = 0;
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") errors.push(`${message.text()} (${message.location().url})`); });
    page.on("request", request => { if (request.isNavigationRequest() && request.frame() === page.mainFrame()) documents++; });
    page.on("requestfailed", request => failures.push({ path: new URL(request.url()).pathname, error: request.failure()?.errorText }));
    page.on("response", response => {
      const request = response.request(), url = new URL(response.url());
      network.push({ path: url.pathname, query: url.search, type: request.resourceType(), status: response.status(), prefetch: Boolean(request.headers()["next-router-prefetch"]), timing: request.timing() });
    });
    const start = performance.now();
    const response = await page.goto("/ru", { waitUntil: "load" });
    await visible(page, ".hero");
    await page.locator(".hero-image").evaluate(image => image.decode());
    await visible(page, ".search-panel");
    await visible(page, ".desktop-nav, .mobile-menu-button");
    await paint(page);
    const initial = await page.evaluate(() => {
      const entries = performance.getEntriesByType("resource");
      const nav = performance.getEntriesByType("navigation")[0];
      const scripts = entries.filter(entry => entry.initiatorType === "script");
      return {
        ttfb: nav.responseStart, domContentLoaded: nav.domContentLoadedEventEnd,
        fcp: performance.getEntriesByName("first-contentful-paint")[0]?.startTime,
        ...window.__audit,
        scriptBytes: scripts.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        scripts: scripts.map(entry => ({ path: new URL(entry.name).pathname, bytes: entry.encodedBodySize })),
        hero: { width: document.querySelector(".hero-image").naturalWidth, src: document.querySelector(".hero-image").currentSrc },
      };
    });
    initial.readyMs = Math.round(performance.now() - start);
    initial.status = response.status();
    await page.screenshot({ path: resolve(output, `${name}-home.png`) });
    const initialDocuments = documents;
    const transitions = [];
    const memory = [];
    async function navigate(href, ready, { footer = false } = {}) {
      if (options.isMobile && !footer) await page.locator(".mobile-menu-button:visible").click();
      const scope = footer ? page.locator(".site-footer:visible") : page.locator(options.isMobile ? "#mobile-navigation:visible" : ".desktop-nav:visible");
      const link = scope.locator(`a[href='${href}']`).first();
      let pointerBlocked = false;
      try { await link.click({ timeout: 3000 }); }
      catch (error) {
        if (!String(error).includes("intercepts pointer events")) throw error;
        // Record real overlay failures; keyboard navigation lets the audit continue.
        pointerBlocked = true;
        await link.focus();
        await link.press("Enter");
      }
      await page.waitForURL(new URL(href, baseURL).href);
      const urlMs = await page.evaluate(() => Math.round(performance.now() - window.__audit.click.time));
      await visible(page, ready);
      await paint(page);
      const contentMs = await page.evaluate(() => Math.round(performance.now() - window.__audit.click.time));
      transitions.push({ href, urlMs, contentMs, pointerBlocked });
    }
    for (let round = 0; round < 2; round++) {
      await navigate("/ru/catalog", ".catalog-page-results");
      const cards = page.locator(".catalog-page-results:visible .cabin-image-button");
      const cabin = await cards.count() ? await cards.first().getAttribute("href") : null;
      if (cabin && round === 0) {
        await cards.first().click();
        await visible(page, ".property-heading");
        await paint(page);
        transitions.push({ href: cabin, contentMs: await page.evaluate(() => Math.round(performance.now() - window.__audit.click.time)) });
      }
      await navigate("/ru/portfolio", ".portfolio-gallery, .product-empty");
      await navigate("/ru/destinations", "#destinations");
      await navigate("/ru/how-it-works", "#how-it-works");
      await navigate("/ru/privacy", ".information-page", { footer: true });
      await navigate("/ru/terms", ".information-page", { footer: true });
      await navigate("/ru", ".hero");
      await cdp.send("HeapProfiler.collectGarbage");
      const snapshot = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(item => [item.name, item.value]));
      memory.push({ round: round + 1, heapBytes: snapshot.JSHeapUsedSize, nodes: snapshot.Nodes, listeners: snapshot.JSEventListeners });
    }
    const runtime = await page.evaluate(() => ({
      ...window.__audit,
      overflow: document.documentElement.scrollWidth > innerWidth,
      resources: performance.getEntriesByType("resource").map(entry => ({ path: new URL(entry.name).pathname, bytes: entry.encodedBodySize, type: entry.initiatorType })),
    }));
    const metrics = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(item => [item.name, item.value]));
    if (process.env.PERFORMANCE_CPU_PROFILE === "true") {
      const { profile } = await cdp.send("Profiler.stop");
      writeFileSync(resolve(output, `${name}.cpuprofile`), JSON.stringify(profile));
    }
    const traceComplete = new Promise(resolve => cdp.once("Tracing.tracingComplete", resolve));
    await cdp.send("Tracing.end");
    const { stream } = await traceComplete;
    let trace = "";
    while (true) { const chunk = await cdp.send("IO.read", { handle: stream }); trace += chunk.data; if (chunk.eof) break; }
    await cdp.send("IO.close", { handle: stream });
    writeFileSync(resolve(output, `${name}-trace.json`), trace);
    writeFileSync(resolve(output, `${name}-network.json`), JSON.stringify({ network, failures }, null, 2));
    const result = { name, cpu, initial, transitions, memory, extraDocuments: documents - initialDocuments, runtime, metrics, errors, failures };
    report.profiles.push(result);
    writeFileSync(resolve(output, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ profile: name, initial: { readyMs: initial.readyMs, fcp: initial.fcp, lcp: initial.lcp, scriptBytes: initial.scriptBytes }, transitions, extraDocuments: result.extraDocuments, longTaskCount: runtime.longTasks.length, errors }, null, 2));
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`Artifacts: ${output}`);
