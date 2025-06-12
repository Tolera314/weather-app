// This is a simple service worker for basic offline functionality

const CACHE_NAME = "weather-app-v1"
const urlsToCache = [
  "/",
  "/settings",
  "/manifest.json",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener("fetch", (event) => {
  // For API requests, try network first, then fall back to cache
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request)
      }),
    )
  } else {
    // For other requests, try cache first, then fall back to network
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone())
              return fetchResponse
            })
          })
        )
      }),
    )
  }
})

// Clean up old caches when a new service worker is activated
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

