if (!self.define) {
  let e, s = {};
  const n = (n, r) => (n = new URL(n + ".js", r).href, s[n] || new Promise(s => {
    if ("document" in self) {
      const e = document.createElement("script");
      e.src = n, e.onload = s, document.head.appendChild(e)
    } else e = n, importScripts(n), s()
  }).then(() => {
    let e = s[n];
    if (!e) throw new Error(`Module ${n} didn't register its module`);
    return e
  }));
  self.define = (r, i) => {
    const a = e || ("document" in self ? document.currentScript.src : "") || location.href;
    if (s[a]) return;
    let c = {};
    const d = e => n(e, a), g = {
      module: {uri: a},
      exports: c,
      require: d
    };
    s[a] = Promise.all(r.map(e => g[e] || d(e))).then(e => (i(...e), c))
  }
}

define(["./workbox-f1770938"], function (workbox) {
  "use strict";

  // Take control immediately on install/activate
  self.skipWaiting();
  workbox.clientsClaim();

  // Routes that should NEVER be cached - always go to network
  const NETWORK_ONLY_PATTERNS = [
    /^\/admin(\/|$)/,          // All admin pages
    /^\/instructor(\/|$)/,     // All instructor pages
    /^\/student(\/|$)/,        // All student pages
    /^\/api\//,                // All API routes
    /\?_rsc=/,                 // Next.js RSC prefetch requests
    /[?&]_rsc=/,               // RSC with other params
  ];

  // Register a network-only handler for protected/dynamic routes
  workbox.registerRoute(
    ({ url, request }) => {
      const pathname = url.pathname;
      const search = url.search;
      const fullUrl = pathname + search;
      return NETWORK_ONLY_PATTERNS.some(pattern => pattern.test(fullUrl)) ||
             request.headers.get('RSC') === '1';
    },
    new workbox.NetworkOnly()
  );

  // Cache Google Fonts
  workbox.registerRoute(
    /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    new workbox.StaleWhileRevalidate({
      cacheName: "google-fonts-stylesheets",
      plugins: [new workbox.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })]
    }),
    "GET"
  );

  workbox.registerRoute(
    /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    new workbox.CacheFirst({
      cacheName: "google-fonts-webfonts",
      plugins: [new workbox.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536000 })]
    }),
    "GET"
  );

  // Cache Next.js static assets (JS/CSS chunks) - safe to cache, hash-busted
  workbox.registerRoute(
    /\/_next\/static\/.+/i,
    new workbox.CacheFirst({
      cacheName: "next-static-assets",
      plugins: [new workbox.ExpirationPlugin({ maxEntries: 128, maxAgeSeconds: 31536000 })]
    }),
    "GET"
  );

  // Cache static images in /public
  workbox.registerRoute(
    /\/images\/.+\.(?:jpg|jpeg|gif|png|svg|ico|webp)/i,
    new workbox.CacheFirst({
      cacheName: "static-image-assets",
      plugins: [new workbox.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592000 })]
    }),
    "GET"
  );

  // Public pages only (home, booking, fleet, gallery etc.) - NetworkFirst so fresh content
  workbox.registerRoute(
    ({ url }) => {
      const pathname = url.pathname;
      // Only cache truly public pages, exclude all app/admin/instructor/student paths
      return (
        url.origin === self.location.origin &&
        !NETWORK_ONLY_PATTERNS.some(p => p.test(pathname)) &&
        !pathname.startsWith('/api/') &&
        !pathname.startsWith('/_next/') // handled above
      );
    },
    new workbox.NetworkFirst({
      cacheName: "public-pages",
      networkTimeoutSeconds: 5,
      plugins: [new workbox.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 3600 })]
    }),
    "GET"
  );
});
