// Injector CSS dinamis per komponen
// Core: Dynamic CSS Injector
const loadedStyles = new Set();

// Fungsi untuk memuat CSS dinamis
export function loadCSS(href) {
    // Memeriksa apakah CSS sudah dimuat
    if (loadedStyles.has(href)) return Promise.resolve();

    // Membuat elemen link untuk memuat CSS
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        // Menambahkan event listener untuk memeriksa ketika CSS selesai dimuat
        link.onload = () => {
            loadedStyles.add(href);
            resolve();
        };

        // Menambahkan event listener untuk memeriksa ketika terjadi error
        link.onerror = reject;
        document.head.appendChild(link);
    });
}