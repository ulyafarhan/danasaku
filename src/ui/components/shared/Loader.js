import { loadCSS } from '../../../core/cssLoader.js';

loadCSS('/src/ui/components/shared/Loader.css');

const Loader = {
  render: () => `
    <div class="loader-overlay" id="app-loader">
      <div class="loader-spinner"></div>
    </div>
  `,
  show: () => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.add('active'); // Menggunakan class active sesuai CSS
      loader.style.display = 'flex';
    }
  },
  hide: () => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.classList.remove('active');
      setTimeout(() => {
        if (!loader.classList.contains('active')) {
            loader.style.display = 'none';
        }
      }, 300); // Sesuaikan dengan durasi transisi CSS
    }
  },
};

export default Loader;