/* Kern offline support. The whole course is cached on install, read from index.html so new lesson files are
   picked up without editing this file. Pages and files come from the network first, so a deploy shows up at
   once; the cache is the fallback when offline. Fonts and CDN libraries are served from the cache and
   refreshed in the background. */
var CACHE = "kern-v2";   // v2: the React build. A new name clears the old cached files on activate.

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    return fetch("./", { cache: "no-cache" }).then(function (res) {
      return res.clone().text().then(function (html) {
        var files = ["./", "manifest.webmanifest", "brand/icon-192.png"], re = /(?:src|href)="(?:\.\/)?((?:assets|brand)\/[^"#?]+)"/g, m;
        while ((m = re.exec(html))) if (files.indexOf(m[1]) < 0) files.push(m[1]);
        return cache.put("./", res).then(function () { return cache.addAll(files.slice(1)); });
      });
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url), same = url.origin === location.origin;
  if (same) {
    // network first; fall back to the cache, and for the course page, to the cached course.
    // Only the course itself (the scope root or index.html) is stored as "./"; other pages keep their own entry.
    var scope = new URL(self.registration.scope).pathname;
    var home = req.mode === "navigate" && (url.pathname === scope || url.pathname === scope + "index.html");
    // always revalidate with the server, so a stale HTTP cache never hides a new deploy
    e.respondWith(fetch(req.mode === "navigate" ? req : new Request(req, { cache: "no-cache" })).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(home ? "./" : req, copy); }); }
      return res;
    }).catch(function () {
      return caches.match(home ? "./" : req, { ignoreSearch: true });
    }));
    return;
  }
  if (/^(fonts\.googleapis\.com|fonts\.gstatic\.com|unpkg\.com|cdn\.jsdelivr\.net)$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res.ok || res.type === "opaque") c.put(req, res.clone()); return res; });
        return hit ? (net.catch(function () {}), hit) : net;
      });
    }));
  }
});
