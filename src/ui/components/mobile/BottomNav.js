export const BottomNav = {
    render(activeRoute) {
        const isActive = (route) => activeRoute.startsWith(route) ? 'active' : '';

        return `
            <nav class="bottom-nav">
                <a href="#dashboard" class="nav-item ${isActive('#dashboard')}">
                    <div class="nav-item-icon">🏠</div>
                    <span class="nav-item-label">Beranda</span>
                </a>
                <a href="#form" class="nav-item ${isActive('#form')}">
                    <div class="nav-item-icon" style="background: var(--color-primary); color: white; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">+</div>
                    <span class="nav-item-label">Tambah</span>
                </a>
                <a href="#history" class="nav-item ${isActive('#history')}">
                    <div class="nav-item-icon">📜</div>
                    <span class="nav-item-label">Riwayat</span>
                </a>
            </nav>
        `;
    }
};