export const Sidebar = {
    render(activeRoute) {
        const isActive = (route) => activeRoute.startsWith(route) ? 'active' : '';

        return `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="sidebar-logo">DanaSaku</div>
                </div>
                <nav class="sidebar-nav">
                    <a href="#dashboard" class="nav-link ${isActive('#dashboard')}">
                        <span class="nav-link-icon">🏠</span> Beranda
                    </a>
                    <a href="#form" class="nav-link ${isActive('#form')}">
                        <span class="nav-link-icon">➕</span> Tambah Data
                    </a>
                    <a href="#history" class="nav-link ${isActive('#history')}">
                        <span class="nav-link-icon">📜</span> Riwayat
                    </a>
                </nav>
            </aside>
        `;
    }
};