export const BottomNav = {
    render(activeRoute) {
        const isActive = (route) => activeRoute.startsWith(route) ? 'active' : '';

        return `
            <nav class="bottom-nav">
                <a href="#dashboard" class="nav-item ${isActive('#dashboard')}">
                    <span class="icon">🏠</span>
                    <span class="label">Beranda</span>
                </a>
                <a href="#form" class="nav-button-add" aria-label="Tambah Transaksi">
                    <span class="icon">+</span>
                </a>
                <a href="#history" class="nav-item ${isActive('#history')}">
                    <span class="icon">📜</span>
                    <span class="label">Riwayat</span>
                </a>
            </nav>
        `;
    }
};