// Bootstrapper: Inisialisasi App & SW Register

import { APP_CONFIG } from './config/appConfig.js';
import { router } from './core/router.js';
import { DashboardPage } from './ui/pages/dashboard/DashboardPage.js';
import { FormPage } from './ui/pages/form/FormPage.js';
import { syncTransactions } from './modules/transaction/use-cases/syncTransactions.js'; // Fallback sync

document.addEventListener('DOMContentLoaded', () => {
    // 1. Init Routes
    router.addRoute('#dashboard', DashboardPage);
    router.addRoute('#form', FormPage);
    if (!window.location.hash) window.location.hash = '#dashboard';

    // 2. Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { type: 'module' })
            .then(reg => console.log('SW Registered!', reg))
            .catch(err => console.error('SW Fail:', err));
    }

    // 3. Online Detection Listener (Fallback if Background Sync API fails)
    window.addEventListener('online', () => {
        console.log('Online detected. Attempting sync...');
        syncTransactions();
    });
    
    // Initial Sync Check
    if (navigator.onLine) {
        syncTransactions();
    }
});