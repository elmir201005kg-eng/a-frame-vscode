import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { after, test } from "node:test";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { encodeReply } from "react-server-dom-webpack/client.node";

// The QA runner supplies a fresh isolated database schema. These probes exercise
// the actual production entry without calls to payment/OAuth providers.
process.env.NODE_ENV = "production";
const { default: app } = await import("../api/index.mjs");
const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
const origin = "https://deployment.example";
const request = (pathname, init) => app.fetch(new Request(origin + pathname, init));
const withDatabase = process.env.DEPLOYMENT_TEST_WITH_DATABASE === "true";
after(async () => { await globalThis.prisma?.$disconnect(); });

test("Vercel publishes only the client build and sends dynamic paths to the RSC function", async () => {
  assert.equal(config.framework, null);
  assert.equal(config.outputDirectory, "dist/client");
  const filesystem = config.routes.findIndex(route => route.handle === "filesystem");
  assert.ok(filesystem >= 0);
  assert.deepEqual(config.routes[filesystem + 1], { src: "/(.*)", dest: "/api/index" });
  const offline = config.routes.findIndex(route => route.dest === "/$1/offline/index.html");
  const rsc = config.routes.findIndex(route => route.has?.some(condition => condition.type === "header" && condition.key === "rsc" && condition.value === "1"));
  const mutations = config.routes.findIndex(route => route.methods?.includes("POST"));
  assert.ok(rsc >= 0 && rsc < offline && rsc < filesystem, "RSC requests must reach the function before static HTML");
  assert.ok(mutations >= 0 && mutations < offline && mutations < filesystem, "Form actions and API mutations must reach the function before static files");
  assert.equal(config.routes[rsc].dest, "/api/index");
  assert.equal(config.routes[mutations].dest, "/api/index");
  assert.equal(typeof app.fetch, "function");
  for (const file of ["rsc/index.js", "ssr/index.js", "rsc/__vite_rsc_assets_manifest.js", "ssr/__vite_rsc_assets_manifest.js"])
    assert.ok((await stat(path.join("dist", file))).isFile());
  assert.ok((await readdir("dist/client/assets")).some(file => file.endsWith(".js")));
});

test("public home pages, catalog and existing pages return HTTP 200 through the production function", { skip: !withDatabase, timeout: 60000 }, async () => {
  const root = await request("/", { headers: { "accept-language": "ru" } });
  assert.equal(root.status, 302);
  assert.equal(root.headers.get("location"), "/ru");
  for (const locale of ["kg", "ru", "en"]) {
    for (const suffix of ["", "/catalog", "/destinations", "/how-it-works", "/portfolio", "/privacy", "/terms", "/login", "/register", "/admin-login", "/cabins/deployment-qa-cabin"]) {
      const pathname = `/${locale}${suffix}`;
      const response = await request(pathname);
      assert.equal(response.status, 200, pathname);
      assert.match(response.headers.get("content-type"), /^text\/html/, pathname);
      const html = await response.text();
      assert.ok(html.includes("<!DOCTYPE html>"), pathname);
      assert.ok(!html.includes("404 · A-FRAME KG"), pathname);
      if (!suffix) assert.ok(html.includes('id="hero-title"'), pathname);
      if (suffix === "/catalog" || suffix.startsWith("/cabins/")) assert.ok(html.includes("Deployment QA Cabin"), pathname);
    }
    const rsc = await request(`/${locale}`, { headers: { RSC: "1" } });
    assert.equal(rsc.status, 200);
    assert.match(rsc.headers.get("content-type"), /^text\/x-component/);
    await rsc.text();
  }
});

test("database-backed API, payment authorization and administrative access remain protected", { skip: !withDatabase }, async () => {
  const checkIn = new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10);
  const checkOut = new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10);
  const availability = await request(`/api/availability?cabinId=${process.env.QA_DEPLOYMENT_CABIN_ID}&checkIn=${checkIn}&checkOut=${checkOut}&guests=2`);
  assert.equal(availability.status, 200);
  assert.equal((await availability.json()).available, true);
  const payment = await request("/api/finik/create-payment", { method: "POST", headers: { origin, "content-type": "application/json" }, body: "{}" });
  assert.equal(payment.status, 401);
  assert.deepEqual(await payment.json(), { error: "unauthorized" });
  for (const pathname of ["/ru/admin", "/ru/admin/cabins", "/ru/admin/bookings", "/ru/account", "/ru/owner", "/ru/owner/cabins/new", "/ru/owner/cabins/1", "/ru/booking?cabin=deployment-qa-cabin", "/ru/bookings/1"]) {
    const response = await request(pathname);
    assert.equal(response.status, 303, pathname);
    assert.match(response.headers.get("location"), /^\/ru\/(admin-login|login)/, pathname);
  }
});

test("unknown pages retain the application's localized 404 response", { skip: !withDatabase }, async () => {
  const response = await request("/ru/deployment-page-does-not-exist");
  assert.equal(response.status, 404);
  assert.match(response.headers.get("content-type"), /^text\/html/);
  assert.ok((await response.text()).includes("404 · A-FRAME KG"));
});

test("the production HTTP server serves public assets and offline files with their cache headers", { timeout: 30000 }, async context => {
  const probe = createServer();
  await new Promise((resolve, reject) => { probe.once("error", reject); probe.listen(0, "127.0.0.1", resolve); });
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const child = spawn(process.execPath, ["server/start.mjs", "--port", String(port)], { env: process.env, stdio: "ignore", windowsHide: true });
  let spawnError;
  child.once("error", error => { spawnError = error; });
  context.after(async () => {
    if (child.pid && child.exitCode === null && child.signalCode === null) {
      const exited = new Promise(resolve => child.once("exit", resolve));
      child.kill();
      await exited;
    }
  });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (spawnError) throw spawnError;
    if (child.exitCode !== null) throw new Error("The production HTTP server exited before startup.");
    try { ready = (await fetch(base + "/manifest.webmanifest")).ok; } catch { /* Wait for the listener. */ }
    if (ready) break;
    await delay(200);
  }
  assert.ok(ready, "The production HTTP listener must become ready");
  for (const pathname of ["/images/hero.webp", "/fonts/manrope-variable.ttf", "/ru/offline", "/en/offline", "/kg/offline"]) {
    const response = await fetch(base + pathname);
    assert.equal(response.status, 200, pathname);
    assert.ok((await response.arrayBuffer()).byteLength > 0, pathname);
  }
  const rsc = await fetch(base + "/ru/offline", { headers: { RSC: "1" } });
  assert.equal(rsc.status, 200);
  assert.match(rsc.headers.get("content-type"), /^text\/x-component/);
  assert.ok((await rsc.text()).includes("/ru/offline"));
  const js = (await readdir("dist/client/assets")).find(file => file.endsWith(".js"));
  const asset = await fetch(base + "/assets/" + js);
  assert.equal(asset.status, 200);
  assert.match(asset.headers.get("content-type"), /javascript/);
  assert.match(asset.headers.get("cache-control"), /immutable/);
  const head = await fetch(base + "/assets/" + js, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
  const worker = await fetch(base + "/sw.js");
  assert.equal(worker.status, 200);
  assert.match(worker.headers.get("cache-control"), /no-cache/);
  assert.equal(worker.headers.get("service-worker-allowed"), "/");
  if (withDatabase) {
    const home = await fetch(base + "/", { headers: { "accept-language": "ru" } });
    assert.equal(home.status, 200);
    assert.equal(new URL(home.url).pathname, "/ru");
    assert.ok((await home.text()).includes('id="hero-title"'));
    const privateFile = await fetch(base + "/rsc/index.js");
    assert.equal(privateFile.status, 404);
    assert.match(privateFile.headers.get("content-type"), /^text\/html/);
  }
});

test("production localization preserves query strings, cookies and the three languages", async () => {
  for (const locale of ["kg", "ru", "en"]) {
    const response = await request("/?next=%2Fru%2Faccount", { headers: { "accept-language": locale } });
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), `/${locale}?next=%2Fru%2Faccount`);
    assert.ok(response.headers.getSetCookie().some(cookie => cookie.includes(`=${locale};`)));
  }
  const saved = await request("/", { headers: { cookie: "a-frame-kg-locale=en", "accept-language": "ru" } });
  assert.equal(saved.headers.get("location"), "/en");
});

test("SSR, hydration assets and streamed RSC render all languages without a static fallback", async () => {
  for (const locale of ["kg", "ru", "en"]) {
    const response = await request(`/${locale}/offline`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^text\/html/);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    const html = await response.text();
    assert.ok(html.includes(`lang="${locale === "kg" ? "ky" : locale}"`));
    assert.ok(html.includes('data-offline-page="true"'));
    assert.ok(html.includes('id="hero-title"'));
    const scripts = [...html.matchAll(/src="(\/assets\/[^"?#]+\.js)"/g)];
    assert.ok(scripts.length > 0);
    for (const [, src] of scripts) assert.ok((await stat(path.join("dist/client", src))).isFile());

    const rsc = await request(`/${locale}/offline?probe=1`, { headers: { RSC: "1" } });
    assert.equal(rsc.status, 200);
    assert.match(rsc.headers.get("content-type"), /^text\/x-component/);
    assert.match(rsc.headers.get("vary"), /RSC/);
    assert.ok((await rsc.text()).includes(`/${locale}/offline?probe=1`));
    const offline = await readFile(`dist/client/${locale}/offline/index.html`, "utf8");
    assert.ok(offline.includes('data-offline-page="true"'));
  }
});

test("protected routes still redirect anonymous visitors to login", async () => {
  for (const locale of ["kg", "ru", "en"]) {
    const response = await request(`/${locale}/account`);
    assert.equal(response.status, 303);
    assert.ok(response.headers.get("location").startsWith(`/${locale}/login?next=`));
  }
});

test("API routing, methods, same-origin protection and multipart bodies reach the server", async () => {
  const missing = await request("/api/deployment-probe?value=1");
  assert.equal(missing.status, 404);
  assert.deepEqual(await missing.json(), { error: "notFound" });
  const method = await request("/api/auth/google");
  assert.equal(method.status, 405);
  assert.equal(method.headers.get("allow"), "POST");
  const blocked = await request("/api/deployment-probe", { method: "POST", headers: { origin: "https://other.example" }, body: "probe" });
  assert.equal(blocked.status, 403);
  const allowed = await request("/api/deployment-probe", { method: "POST", headers: { origin }, body: "probe" });
  assert.equal(allowed.status, 404);
  const form = new FormData();
  form.set("locale", "ru");
  const action = await request("/ru/offline", { method: "POST", headers: { origin }, body: form });
  assert.equal(action.status, 400);
  assert.equal(await action.text(), "Invalid action");
});

test("server actions preserve multipart arguments, redirects and separate session/locale cookies", async () => {
  const sources = await Promise.all((await readdir("dist/rsc/assets"))
    .filter(file => file.startsWith("auth-") && file.endsWith(".js"))
    .map(file => readFile(path.join("dist/rsc/assets", file), "utf8")));
  const id = sources.map(source => /registerServerReference\(logoutAction,\s*"([^"]+)",\s*"logoutAction"\)/.exec(source)?.[1]).find(Boolean);
  assert.ok(id, "The production build must retain the logout server reference");
  const actionId = `${id}#logoutAction`;
  const checkCookies = response => {
    const cookies = response.headers.getSetCookie();
    assert.equal(cookies.length, 2);
    assert.ok(cookies.some(cookie => cookie.startsWith("a-frame-session=;") && cookie.includes("Max-Age=0") && cookie.includes("HttpOnly")));
    assert.ok(cookies.some(cookie => cookie.startsWith("a-frame-kg-locale=en;")));
    assert.equal(response.headers.get("cache-control"), "no-store");
  };

  const progressiveForm = new FormData();
  progressiveForm.set(`$ACTION_ID_${actionId}`, "");
  progressiveForm.set("locale", "en");
  const html = await request("/en/offline", { method: "POST", headers: { origin }, body: progressiveForm });
  assert.equal(html.status, 303);
  assert.equal(html.headers.get("location"), "/en");
  checkCookies(html);

  const form = new FormData();
  form.set("locale", "en");
  const rsc = await request("/en/offline", {
    method: "POST",
    headers: { origin, RSC: "1", "X-Server-Action": actionId },
    body: await encodeReply([form]),
  });
  assert.equal(rsc.status, 200);
  assert.equal(rsc.headers.get("x-redirect"), "/en");
  assert.deepEqual(await rsc.json(), { redirect: "/en" });
  checkCookies(rsc);
});

test("Sharp endpoints retain their server-side source files", async () => {
  for (const pathname of ["/icon", "/apple-icon", "/api/image?src=%2Fimages%2Fhero.webp&w=640&q=75"]) {
    const response = await request(pathname);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /^image\//);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
  const manifest = await request("/manifest.webmanifest");
  assert.equal(manifest.status, 200);
  assert.ok((await manifest.json()).name.includes("A-FRAME"));
});
