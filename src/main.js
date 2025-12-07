import { APP_CONFIG } from './config/appConfig.js';
import { router } from './core/router.js';
import { DashboardPage } from './ui/pages/dashboard/DashboardPage.js';
import { FormPage } from './ui/pages/form/FormPage.js';
import { HistoryPage } from './ui/pages/history/HistoryPage.js';
import { syncTransactions } from './modules/transaction/use-cases/syncTransactions.js';

document.addEventListener('DOMContentLoaded', () => {
    router.addRoute('#dashboard', DashboardPage);
    router.addRoute('#form', FormPage);
    router.addRoute('#history', HistoryPage);

    if (!window.location.hash) window.location.hash = '#dashboard';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { type: 'module' })
            .catch(err => console.error('SW Fail:', err));
    }

    window.addEventListener('online', syncTransactions);
    
    if (navigator.onLine) syncTransactions();
});