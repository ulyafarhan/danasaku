import { loadCSS } from '../../core/cssLoader.js';
import { BottomNav } from '../components/mobile/BottomNav.js';
import { Sidebar } from '../components/desktop/Sidebar.js';
import Loader from '../components/shared/Loader.js'; // Import Loader

export const MainLayout = {
    async render(contentHTML) {
        // Load CSS Utama
        await Promise.all([
            loadCSS('/src/styles/variables.css'),
            loadCSS('/src/styles/reset.css'),
            loadCSS('/src/styles/typography.css'),
            loadCSS('/src/styles/utilities.css'),
            loadCSS('/src/ui/layout/MainLayout.css'),
            loadCSS('/src/ui/components/mobile/BottomNav.css'),
            loadCSS('/src/ui/components/desktop/Sidebar.css'),
            loadCSS('/src/ui/components/shared/Button.css'),
        ]);

        // Render komponen Loader sekali di layout utama
        const loaderHTML = Loader.render();
        const currentHash = window.location.hash || '#dashboard';

        return `
            ${loaderHTML}
            <div class="main-layout">
                ${Sidebar.render(currentHash)}
                
                <main class="main-content">
                    <div class="container">
                        ${contentHTML}
                    </div>
                </main>
                
                ${BottomNav.render(currentHash)}
            </div>
        `;
    }
};