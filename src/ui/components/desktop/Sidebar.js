export const Sidebar = {
    render(activeRoute) {
        const isActive = (route) => activeRoute.startsWith(route) ? 'active' : '';

        return `
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h2>DanaSaku</h2>
                    <p>Finance Ledger</p>
                </div>
                <nav class="sidebar-menu">
                    <a href="#dashboard" class="menu-item ${isActive('#dashboard')}">
                        <span class="icon">🏠</span> Beranda
                    </a>
                    <a href="#form" class="menu-item ${isActive('#form')}">
                        <span class="icon">➕</span> Input Transaksi
                    </a>
                    <a href="#history" class="menu-item ${isActive('#history')}">
                        <span class="icon">📜</span> Riwayat Data
                    </a>
                </nav>
            </aside>
        `;
    }
};