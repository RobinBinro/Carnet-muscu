// Service worker : rend l'appli utilisable hors ligne.
// Les fichiers sont servis depuis le cache du téléphone (lancement immédiat), puis mis à jour
// en arrière-plan : une nouvelle version publiée apparaît donc au lancement suivant.
const CACHE = 'carnet-muscu-v1';
const SHELL = [
  "./",
  "index.html",
  "firebase-config.js",
  "vendor/firebase.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
  "fonts/barlow-condensed-latin-600-normal.woff2",
  "fonts/barlow-condensed-latin-700-normal.woff2",
  "fonts/barlow-condensed-latin-800-normal.woff2",
  "fonts/barlow-latin-400-normal.woff2",
  "fonts/barlow-latin-500-normal.woff2",
  "fonts/barlow-latin-600-normal.woff2",
  "fonts/barlow-latin-700-normal.woff2"
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // Firebase et le reste du réseau passent normalement
  event.respondWith(caches.open(CACHE).then(async cache => {
    const key = req.mode === 'navigate' ? 'index.html' : req;
    const cached = await cache.match(key, {ignoreSearch: true});
    const fresh = fetch(req, {cache: 'no-cache'}).then(res => { if (res && res.ok) cache.put(key, res.clone()); return res; });
    if (cached) { event.waitUntil(fresh.catch(() => {})); return cached; }
    return fresh;
  }));
});
