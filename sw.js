// Service worker AGRILAYAK: simpan semua berkas di HP agar bisa dibuka tanpa internet.
// Naikkan angka VERSI jika kamu mengganti index.html, supaya HP memuat versi terbaru.
const VERSI = 'agrilayak-v12-hp-1';
const BERKAS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(BERKAS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok && new URL(req.url).origin === location.origin) {
          const salin = res.clone();
          caches.open(VERSI).then(c => c.put(req, salin));
        }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : undefined);
    })
  );
});
