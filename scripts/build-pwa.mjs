import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve(process.env.NEXT_DIST_DIR || ".next");
const workerPath = process.env.NEXT_PUBLIC_PWA_WORKER_PATH || "/sw.js";
if (!/^\/[a-zA-Z0-9_.-]+\.js$/.test(workerPath)) throw new Error("PWA worker must be a JavaScript file at the site root.");
const locales = ["kg", "ru", "en"];
const assets = new Set(["/manifest.webmanifest", "/icon", "/apple-icon", "/brand/a-frame-logo.png"]);

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(absolute));
    else result.push(absolute);
  }
  return result;
}

// Include client chunks and the local font so lazy interactions also work offline.
for (const file of await files(path.join(dist, "static"))) {
  if (/\.(?:js|css|woff2?|ttf|png|webp|svg)$/.test(file)) {
    assets.add(`/_next/static/${path.relative(path.join(dist, "static"), file).split(path.sep).join("/")}`);
  }
}
for (const file of await files(path.resolve("public/pwa"))) {
  assets.add(`/pwa/${path.basename(file)}`);
}
for (const locale of locales) {
  const html = await readFile(path.join(dist, "server/app", locale, "offline.html"), "utf8");
  if (!html.includes('data-offline-page="true"') || !html.includes('id="hero-title"')) {
    throw new Error(`The ${locale} offline home must be fully prerendered.`);
  }
  assets.add(`/${locale}/offline`);
  for (const match of html.matchAll(/(?:src|href)="(\/images\/[^"?#]+)"/g)) assets.add(match[1]);
}

const precache = [...assets].sort();
const buildId = await readFile(path.join(dist, "BUILD_ID"), "utf8");
const template = await readFile(path.resolve("scripts/pwa-worker.js"), "utf8");
const hash = createHash("sha256").update(buildId).update(template).update(JSON.stringify(precache));
for (const asset of precache.filter(asset => asset.startsWith("/pwa/") || asset.startsWith("/images/") || asset.startsWith("/brand/"))) {
  hash.update(await readFile(path.resolve(`public${asset}`)));
}
const worker = template
  .replace('"__PWA_VERSION__"', JSON.stringify(hash.digest("hex").slice(0, 16)))
  .replace("/* __PWA_ASSETS__ */ []", JSON.stringify(precache));
await writeFile(path.resolve(`public${workerPath}`), worker);
console.log(`[PWA] Generated versioned worker with ${precache.length} offline assets and all three home pages.`);
