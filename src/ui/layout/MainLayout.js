import { loadCSS } from '../../core/cssLoader.js';
import { BottomNav } from '../components/mobile/BottomNav.js';
import { Sidebar } from '../components/desktop/Sidebar.js';

export const MainLayout = {
    async render(contentHTML) {
        // Load semua CSS penting
        await Promise.all([
            loadCSS('/src/ui/layout/MainLayout.css'),
            loadCSS('/src/ui/components/mobile/BottomNav.css'),
            loadCSS('/src/ui/components/desktop/Sidebar.css'),
            loadCSS('/src/ui/components/shared/Button.css'),
            loadCSS('/src/styles/variables.css')
        ]);
        
        const currentHash = window.location.hash || '#dashboard';

        return `
            <div class="layout-wrapper">
                ${Sidebar.render(currentHash)}
                
                <div class="main-container">
                    <main class="app-content">
                        ${contentHTML}
                    </main>
                    
                    ${BottomNav.render(currentHash)}
                </div>
            </div>
        `;
    }
};