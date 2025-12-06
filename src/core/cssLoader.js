// Injector CSS dinamis per komponen

// Core: Dynamic CSS Injector
const loadedStyles = new Set();

export function loadCSS(href) {
    if (loadedStyles.has(href)) return Promise.resolve();

    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        link.onload = () => {
            loadedStyles.add(href);
            resolve();
        };
        
        link.onerror = reject;
        document.head.appendChild(link);
    });
}