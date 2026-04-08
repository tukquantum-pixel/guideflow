const CACHE_NAME = 'pathy-guideflow-pwa-v1';

// Recursos críticos a cachear estáticamente
const PRECACHE_URLS = [
    '/',
    '/grabar',
    '/mis-rutas',
    '/perfil',
    '/manifest.ts',
    '/icon-192.png',
    '/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // Intentamos precachear los estáticos de forma no bloqueante
            // Si alguno falla, el SW se instala igual
            return Promise.allSettled(
                PRECACHE_URLS.map(url => 
                    fetch(url).then(response => {
                        if (response.ok) return cache.put(url, response);
                    }).catch(err => console.warn('Precache falló para', url))
                )
            );
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia Network First, Fallback to Cache
self.addEventListener('fetch', (event) => {
    // Solo manejamos peticiones GET
    if (event.request.method !== 'GET') return;

    // Excluir peticiones API dinámicas, autenticación, y NextJS webpack HMR en dev
    const url = new URL(event.request.url);
    if (
        url.pathname.startsWith('/api/') || 
        url.pathname.startsWith('/_next/webpack-hmr') ||
        url.pathname.includes('/login')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // Si la red tiene éxito, cacheamos la nueva versión
                // Solo si es una respuesta válida (ok)
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Si la red falla (offline), buscamos en caché
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Si no está en caché y es navegación puro HTML, devolvemos un caché fallback (ej: root)
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }
                    
                    // Si no queda otra, tira un Response fallback ficticio
                    return new Response('Offline Mode', { status: 503, statusText: 'Service Unavailable' });
                });
            })
    );
});
