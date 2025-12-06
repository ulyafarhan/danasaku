// Container Sidebar + Content + BottomNav

import { loadCSS } from '../../core/cssLoader.js';

export const MainLayout = {
    async render(contentHTML) {
        await loadCSS('/src/ui/layout/MainLayout.css');
        
        // Cek halaman aktif untuk highlight menu
        const hash = window.location.hash || '#dashboard';
        const isDashboard = hash.startsWith('#dashboard');
        const isForm = hash.startsWith('#form');

        return `
            <div class="app-container">
                <main class="app-content">
                    ${contentHTML}
                </main>
                
                <nav class="bottom-nav">
                    <a href="#dashboard" class="nav-item ${isDashboard ? 'active' : ''}">
                        <span class="icon">🏠</span>
                        <span class="label">Beranda</span>
                    </a>
                    <a href="#form" class="nav-button-add">
                        <span class="icon">+</span>
                    </a>
                    <a href="#history" class="nav-item">
                        <span class="icon">📜</span>
                        <span class="label">Riwayat</span>
                    </a>
                </nav>
            </div>
        `;
    }
};