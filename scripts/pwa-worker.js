/* global self, caches */
const VERSION = "__PWA_VERSION__";
const PRECACHE_ASSETS = /* __PWA_ASSETS__ */ [];
const CACHE_PREFIX = "a-frame-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}${VERSION}`;
const LOCALES = ["kg", "ru", "en"];
const LOCALE_KEY = "/__pwa_locale";

self.addEventListener("install", (event) => {
  // Fail installation if any required asset is missing; the old worker stays usable.
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE_ASSETS.map(url => new Request(url, { credentials: "omit", cache: "reload" })));
  })());
  // Updates wait until existing tabs close, keeping their old client chunks valid.
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const name of await caches.keys()) {
      if (name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME) {
        const previous = await caches.open(name);
        const locale = await previous.match(LOCALE_KEY);
        if (locale) await cache.put(LOCALE_KEY, locale);
        await caches.delete(name);
      }
    }
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SET_LOCALE" && LOCALES.includes(event.data.locale)) {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put(LOCALE_KEY, new Response(event.data.locale))));
  }
});

async function offlineHome(url) {
  const cache = await caches.open(CACHE_NAME);
  const requested = url.pathname.split("/")[1];
  const saved = await cache.match(LOCALE_KEY);
  const locale = LOCALES.includes(requested) ? requested : saved ? await saved.text() : "ru";
  return await cache.match(`/${locale}/offline`) || Response.error();
}

async function navigate(request, url) {
  try {
    // Never cache normal HTML: it can contain an account, favorites or bookings.
    const response = await fetch(request);
    if (response.status < 500) return response;
  } catch {
    // Network unavailable. Only the public, prebuilt home is an offline fallback.
  }
  return offlineHome(url);
}

async function asset(request, url) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch {
    // Next Image URLs vary by screen size; use the bundled original when offline.
    if (url.pathname === "/_next/image") {
      const original = url.searchParams.get("url");
      if (original?.startsWith("/images/") || original === "/brand/a-frame-logo.png") {
        const fallback = await cache.match(original);
        if (fallback) return fallback;
      }
    }
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // API calls, mutations, RSC responses and external resources remain network-only.
  if (request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/") || request.headers.has("RSC") || url.searchParams.has("_rsc")) return;
  if (request.mode === "navigate") {
    event.respondWith(navigate(request, url));
  } else if (PRECACHE_ASSETS.includes(url.pathname) || url.pathname === "/_next/image") {
    event.respondWith(asset(request, url));
  }
});
