// Router: Pengatur Navigasi SPA
import { eventBus } from './eventBus.js';

class Router {
    constructor() {
        // Inisialisasi Router
        this.routes = {};
        this.currentRoute = null;
        this.appContainer = document.getElementById('app');
        // Event Listeners
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    addRoute(path, pageController) {
        // Add Route: Membuat rute baru
        this.routes[path] = pageController;
    }

    async handleRoute() {
        // Handle Route: Memproses rute saat ini
        const hash = window.location.hash || '#dashboard';
        const path = hash.split('?')[0]; 

        if (this.routes[path]) {
            // Bersihkan Container
            this.appContainer.innerHTML = '';
            
            // Render Halaman
            const page = this.routes[path];
            if (page.render) {
                await page.render(this.appContainer);
            }
            
            this.currentRoute = path;
            eventBus.emit('route:changed', path);
        } else {
            window.location.hash = '#dashboard';
        }
    }

    // Fungsi untuk navigasi ke rute tertentu
    navigate(path) {
        window.location.hash = path;
    }
}
// Export Router
export const router = new Router();