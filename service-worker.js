const CACHE_NAME = 'stadt-land-fluss-v1.2';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './stadt-land-fluss.js',
  './manifest.json',
  './icons/logo48.png',
  './icons/logo72.png',
  './icons/logo96.png',
  './icons/logo144.png',
  './icons/logo168.png',
  './icons/logo192.png',
  'https://fonts.googleapis.com/css?family=Montserrat'
];

// Install event - cache all files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
