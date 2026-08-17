// BakuGo Service Worker - sadə offline keş
const CACHE_NAME = "bakugo-cache-v1";
const URLS_TO_CACHE = [
  "/index.html",
  "/manifest.json",
  "/icons/icon-384.png",
  "/icons/icon-512.png",
  "/icons/icon-1024.png"
];

self.addEventListener("install", function (event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

// Firestore/Firebase sorğuları KEŞLƏNMİR - həmişə canlı gedir.
// Yalnız statik fayllar (html, manifest, iconlar) keşlənir.
self.addEventListener("fetch", function (event) {
  const url = event.request.url;

  if (url.includes("firestore") || url.includes("googleapis") || url.includes("firebaseio")) {
    return; // canlı data - keşə toxunma
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return (
        cached ||
        fetch(event.request).catch(function () {
          return caches.match("/index.html");
        })
      );
    })
  );
});
