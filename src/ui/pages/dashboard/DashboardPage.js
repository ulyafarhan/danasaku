import { calculateBalance } from '../../../modules/transaction/use-cases/calculateBalance.js';
import { getTransactionList } from '../../../modules/transaction/use-cases/getTransactionList.js';
import { TransactionCard } from '../../components/shared/TransactionCard.js';
import { Utils } from '../../../core/utils.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { eventBus } from '../../../core/eventBus.js';
import { MainLayout } from '../../layout/MainLayout.js';
import Loader from '../../components/shared/Loader.js';

export const DashboardPage = {
    initListeners() {
        // Hapus listener lama sebelum menambah yang baru untuk mencegah duplikasi jika diperlukan
        // Sederhananya, kita pasang listener ulang saat render
        eventBus.on('transaction:created', () => {
             if(window.location.hash === '#dashboard') this.render(document.getElementById('app'));
        });
    },

    async render(container) {
        Loader.show(); // Tampilkan loader
        await loadCSS('/src/ui/pages/dashboard/Dashboard.css');
        this.initListeners();

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
            Loader.hide(); // Sembunyikan loader
        }
    },

    renderBalance(data) {
        // Menggunakan desain 1 Kartu Utama + Info Pemasukan/Pengeluaran di bawahnya atau di dalamnya
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