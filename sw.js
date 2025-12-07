// Service Worker: Caching & Background Sync
import { syncTransactions } from './src/modules/transaction/use-cases/syncTransactions.js';

// Constants
const CACHE_NAME = 'danasaku-v1-static';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/main.js',
    '/src/styles/reset.css',
    '/src/styles/variables.css',
    '/src/styles/utilities.css'
];

// --- Logika Install Service Worker ---
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// --- Logika Activate Service Worker ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

// --- Logika Fetch Request (Stale-while-revalidate) ---
self.addEventListener('fetch', (event) => {
    // Skip non-GET or cross-origin requests
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            const networkFetch = fetch(event.request).then(response => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                return response;
            });
            return cached || networkFetch;
        })
    );
});

// --- Logika Sync Event (Background Sync) ---
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});