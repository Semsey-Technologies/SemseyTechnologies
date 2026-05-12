const CACHE_NAME = 'semsey-tech-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/projects.html',
  '/contact.html',
  '/settings.html',
  '/assets/theme/theme.css',
  '/assets/theme/theme.js',
  '/assets/theme/animations.css',
  '/assets/theme/presets.js',
  '/assets/theme/settings.js',
  '/assets/theme/settings.css',
  '/assets/theme/retro90s.js',
  '/assets/theme/retro90s.css',
  '/assets/theme/menu-loader.js',
  '/assets/theme/retro-presets.js',
  '/images/logo/logo.png'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force new SW to take over immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  self.clients.claim(); // Take control of all open tabs immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// Fetch Assets
self.addEventListener('fetch', (event) => {
  // NETWORK-FIRST for HTML/Navigation
  // This ensures users always get the latest page content if online
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Optional: Update the cache with the fresh version
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request)) // Fallback to cache if offline
    );
    return;
  }

  // CACHE-FIRST for Static Assets (CSS, JS, Images)
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
