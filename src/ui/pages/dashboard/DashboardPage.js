import { calculateBalance } from '../../../modules/transaction/use-cases/calculateBalance.js';
import { getTransactionList } from '../../../modules/transaction/use-cases/getTransactionList.js';
import { TransactionCard } from '../../components/shared/TransactionCard.js';
import { Utils } from '../../../core/utils.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { eventBus } from '../../../core/eventBus.js';
import { MainLayout } from '../../layout/MainLayout.js';
import Loader from '../../components/shared/Loader.js';

export const DashboardPage = {
    // Flag untuk mencegah duplikasi listener
    listenersInitialized: false,

    initListeners() {
        // Jika sudah di-init, jangan jalankan lagi
        if (this.listenersInitialized) return;

        // Handler untuk refresh halaman
        const refreshHandler = () => {
             // Hanya refresh jika user sedang berada di halaman dashboard
             // Handle case hash kosong (default ke dashboard) atau #dashboard
             const hash = window.location.hash;
             if(hash === '#dashboard' || hash === '' || hash === '#') {
                 this.render(document.getElementById('app'));
             }
        };

        // Dengar semua event perubahan data
        eventBus.on('transaction:created', refreshHandler);
        eventBus.on('transaction:updated', refreshHandler);
        eventBus.on('transaction:deleted', refreshHandler);
        eventBus.on('sync:complete', refreshHandler);
        
        this.listenersInitialized = true;
    },

    async render(container) {
        // 1. Panggil Listener agar aktif
        this.initListeners();

        Loader.show();
        await loadCSS('/src/ui/pages/dashboard/Dashboard.css');
        // Pastikan CSS kartu juga dimuat karena dipakai di list transaksi
        await loadCSS('/src/ui/components/shared/TransactionCard.css'); 

        try {
            const [balanceData, transactions] = await Promise.all([
                calculateBalance(),
                getTransactionList()
            ]);

            const balanceHTML = this.renderBalance(balanceData);
            const listHTML = transactions.slice(0, 5).map(t => TransactionCard.render(t)).join('');

            const content = `
                <div class="dashboard-page">
                    <header class="dashboard-header">
                        <h2>Ringkasan Keuangan</h2>
                    </header>
                    
                    ${balanceHTML}

                    <div class="section-title">
                        <h3>Transaksi Terakhir</h3>
                        <a href="#history" class="btn-link">Lihat Semua</a>
                    </div>
                    
                    <div class="recent-transactions">
                        ${transactions.length > 0 
                            ? listHTML 
                            : '<div class="no-transactions">Belum ada transaksi tercatat.</div>'}
                    </div>
                </div>
            `;

            container.innerHTML = await MainLayout.render(content);
        } catch (error) {
            container.innerHTML = `<div class="p-4 text-center error-message">Error: ${error.message}</div>`;
        } finally {
            Loader.hide();
        }
    },

    renderBalance(data) {
        return `
            <div class="balance-card">
                <div class="balance-label">Saldo Bersih Saat Ini</div>
                <div class="balance-amount">${Utils.formatCurrency(data.netBalance)}</div>
            </div>

            <div class="quick-actions">
                <div class="card-summary income" style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; box-shadow: var(--shadow-sm); border-left: 4px solid var(--color-success);">
                    <div style="font-size: 0.8rem; color: var(--color-text-secondary);">Pemasukan</div>
                    <div style="font-weight: 700; color: var(--color-success); font-size: 1.1rem;">${Utils.formatCurrency(data.totalIncome)}</div>
                </div>
                <div class="card-summary expense" style="flex: 1; background: #fff; padding: 15px; border-radius: 12px; box-shadow: var(--shadow-sm); border-left: 4px solid var(--color-error);">
                    <div style="font-size: 0.8rem; color: var(--color-text-secondary);">Pengeluaran</div>
                    <div style="font-weight: 700; color: var(--color-error); font-size: 1.1rem;">${Utils.formatCurrency(data.totalExpense)}</div>
                </div>
            </div>
        `;
    }
};