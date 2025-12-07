// Main Application Entry Point
import { APP_CONFIG } from './config/appConfig.js';
import { router } from './core/router.js';
import { DashboardPage } from './ui/pages/dashboard/DashboardPage.js';
import { FormPage } from './ui/pages/form/FormPage.js';
import { HistoryPage } from './ui/pages/history/HistoryPage.js';
import { syncTransactions } from './modules/transaction/use-cases/syncTransactions.js';
import { LoginPage } from './ui/pages/auth/LoginPage.js'; 

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    // Cek Sesi Login
    const savedPin = localStorage.getItem('danasaku_pin');
    
    if (savedPin !== APP_CONFIG.APP_SECRET) {
        // Jika belum login, tampilkan Halaman Login
        // Kita oper fungsi 'initApp' sebagai callback agar dijalankan setelah sukses login
        LoginPage.render(initApp);
    } else {
        // Jika sudah login, langsung masuk
        initApp();
    }
});

// Fungsi Inisialisasi Utama Aplikasi (Router, SW, dll)
function initApp() {
    // 1. Reset Struktur HTML
    document.body.innerHTML = '<div id="app"></div>';

    // 2. [PENTING] Hubungkan ulang Router ke elemen #app yang baru
    // Tanpa baris ini, Router mengisi elemen hantu yang sudah terhapus!
    router.appContainer = document.getElementById('app'); 

    // 3. Daftarkan Rute
    router.addRoute('#dashboard', DashboardPage);
    router.addRoute('#form', FormPage);
    router.addRoute('#history', HistoryPage);

    // 4. Atur Hash Default
    if (!window.location.hash) window.location.hash = '#dashboard';
    
    // 5. Jalankan Router Manual (Karena event 'load' sudah lewat)
    router.handleRoute(); 

    // 6. Service Worker & Sync
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', { type: 'module' })
            .catch(err => console.error('SW Fail:', err));
    }

    window.addEventListener('online', syncTransactions);
    if (navigator.onLine) syncTransactions();
}