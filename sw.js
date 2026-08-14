const CACHE = "scrivia-v10";
const ASSETS = ["/", "/index.html", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // API calls (Gladia, Claude) : toujours réseau, jamais de cache
  if (e.request.url.includes("api.gladia.io") || e.request.url.includes("api.anthropic.com")) return;

  // Réseau en priorité (toujours la dernière version si en ligne),
  // secours sur le cache uniquement si hors-ligne
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const resClone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, resClone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
