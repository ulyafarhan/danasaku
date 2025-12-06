// Pengatur Navigasi SPA

// Core: SPA Router
import { eventBus } from './eventBus.js';

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.appContainer = document.getElementById('app');
        
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    addRoute(path, pageController) {
        this.routes[path] = pageController;
    }

    async handleRoute() {
        const hash = window.location.hash || '#dashboard';
        const path = hash.split('?')[0]; 

        if (this.routes[path]) {
            // Clean previous view
            this.appContainer.innerHTML = '';
            
            // Execute Controller
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

    navigate(path) {
        window.location.hash = path;
    }
}

export const router = new Router();