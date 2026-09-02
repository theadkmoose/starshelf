// StarShelf service worker
// Bump this version whenever cached assets change so old caches are cleared.
const CACHE_VERSION = 'starshelf-v1';
const CACHE_NAME = `starshelf-cache-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './book.html',
  './stephen-king.html',
  './reddit-top-2025.html',
  './css/style.css',
  './js/app.js',
  './js/book.js',
  './js/book-meta.js',
  './js/nav.js',
  './js/score.js',
  './js/stephen-king.js',
  './js/reddit-top-2025.js',
  './manifest.webmanifest',
  './icon.svg',
  './icon-192.png',
  './apple-touch-icon.png',
  './images/placeholder-cover.svg',
  './books.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {
      // Ignore individual asset failures so install doesn't fail the whole shell.
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('starshelf-cache-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Network-first for the catalog data so users get fresh content when online,
  // falling back to the cached copy (and updating it) when offline.
  if (url.pathname.endsWith('/books.json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else (app shell, styles, scripts, images, covers),
  // with a background refresh so updates still propagate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
