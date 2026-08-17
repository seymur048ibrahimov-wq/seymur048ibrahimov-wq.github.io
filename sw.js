// ===== BakuGo Service Worker =====
// Yalnız statik "app shell" faylları keşlənir (HTML qabığı, manifest, ikonlar).
// Firebase/Firestore sorğuları (canlı qiymət, sifariş statusu və s.) HEÇ VAXT
// keşlənmir — onlar həmişə şəbəkədən təzə çəkilir.

const CACHE_NAME = "bakugo-cache-v1"; // versiyanı hər yeni deploy-da artırın (v2, v3...)

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/icon-1024.png"
];

// Quraşdırma: app shell-i keşə yaz
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// Aktivləşmə: köhnə keş versiyalarını təmizlə
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Sorğuların idarə olunması
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Yalnız GET sorğularını idarə et
  if (req.method !== "GET") return;

  // Firebase/Firestore/Google API sorğularına toxunma - həmişə canlı şəbəkədən keçsin
  if (
    url.hostname.includes("firestore.googleapis.com") ||
    url.hostname.includes("firebaseio.com") ||
    url.hostname.includes("googleapis.com") ||
    url.hostname.includes("gstatic.com") && url.pathname.includes("firebase")
  ) {
    return;
  }

  // Naviqasiya sorğuları (səhifə açılışı): əvvəlcə şəbəkə, olmasa keşdən son görülən halı ver
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", resClone));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Digər statik fayllar (ikon, font, css və s.): keş varsa onu ver, yoxdursa şəbəkəyə get
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Yalnız uğurlu, eyni-mənşəli cavabları keşlə
          if (res && res.status === 200 && url.origin === self.location.origin) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
