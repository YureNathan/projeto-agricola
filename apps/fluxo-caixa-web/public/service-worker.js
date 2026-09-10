const CACHE_NAME = 'agrogestao-pwa-v2'

const APP_SHELL = [
    '/',
    '/app',
    '/manifest.webmanifest',
    '/pwa-icon.svg',
    '/favicon.svg',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) =>
                Promise.all(
                    APP_SHELL.map((url) =>
                        cache.add(url).catch(() => undefined),
                    ),
                ),
            )
            .then(() => self.skipWaiting()),
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) =>
                Promise.all(
                    cacheNames
                        .filter(
                            (cacheName) =>
                                cacheName !== CACHE_NAME,
                        )
                        .map((cacheName) =>
                            caches.delete(cacheName),
                        ),
                ),
            )
            .then(() => self.clients.claim()),
    )
})

self.addEventListener('fetch', (event) => {
    const { request } = event

    if (request.method !== 'GET') {
        return
    }

    if (new URL(request.url).origin !== self.location.origin) {
        return
    }

    event.respondWith(
        fetch(request)
            .then((resposta) => {
                if (resposta && resposta.ok) {
                    const copia = resposta.clone()

                    caches
                        .open(CACHE_NAME)
                        .then((cache) =>
                            cache.put(request, copia),
                        )
                        .catch(() => undefined)
                }

                return resposta
            })
            .catch(async () => {
                const emCache = await caches.match(request)

                if (emCache) {
                    return emCache
                }

                if (request.mode === 'navigate') {
                    const shell = await caches.match('/')

                    if (shell) {
                        return shell
                    }
                }

                return Response.error()
            }),
    )
})
