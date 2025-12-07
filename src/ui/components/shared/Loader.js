// Core: Loader
import { loadCSS } from '../../../core/cssLoader.js';

// UI: Loader
loadCSS('/src/ui/components/shared/Loader.css');

const Loader = {
    // Render komponen Loader
  render: () => `
    <div class="loader-overlay" id="app-loader">
      <div class="loader-spinner"></div>
    </div>
  `,
  // Tampilkan loader
  show: () => {
    const loader = document.getElementById('app-loader');
    if (loader) {
        // Tampilkan loader
      loader.classList.add('active'); // Menggunakan class active sesuai CSS
      loader.style.display = 'flex'; // Tampilkan loader
    }
  },
  // Sembunyikan loader
  hide: () => {
    const loader = document.getElementById('app-loader');
    if (loader) {
        // Sembunyikan loader
      loader.classList.remove('active');
      setTimeout(() => {
        if (!loader.classList.contains('active')) {
            // Sembunyikan loader
            loader.style.display = 'none';
        }
      }, 300); // Sesuaikan dengan durasi transisi CSS
    }
  },
};

export default Loader;