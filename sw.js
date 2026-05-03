const CACHE_NAME = 'dg-office-v5';
const ASSETS = ['/', '/index.html', '/css/style.css', '/css/admin.css', '/css/toolbar.css', '/js/device.js', '/js/characters.js', '/js/app.js', '/js/security.js', '/js/admin.js', '/js/toolbar.js', '/assets/office-bg.png', '/assets/icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
