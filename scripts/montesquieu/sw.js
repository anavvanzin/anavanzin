const CACHE_PREFIX = 'anavanzin-montesquieu-';
const CACHE_NAME = CACHE_PREFIX + '__VERSION__';
const PRECACHE = __PRECACHE__;
const BASE = '/montesquieu/';

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE);
    } catch {
      // Quota exhaustion or cache write failure must not block worker activation.
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(BASE)
      || request.headers.has('range') || /\.(mp3|mp4)$/.test(url.pathname) || url.pathname.startsWith(BASE + 'api/')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok) {
        try {
          await cache.put(request, response.clone());
        } catch {
          // Cache storage failure must not discard a successful network response.
        }
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') return (await cache.match(BASE)) || Response.error();
      return Response.error();
    }
  })());
});
