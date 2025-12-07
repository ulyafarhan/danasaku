import { getTransactionList } from '../../../modules/transaction/use-cases/getTransactionList.js';
import { TransactionCard } from '../../components/shared/TransactionCard.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { MainLayout } from '../../layout/MainLayout.js';
import Loader from '../../components/shared/Loader.js';

export const HistoryPage = {
    async render(container) {
        Loader.show();
        await loadCSS('/src/ui/pages/history/History.css');
        
        try {
            const transactions = await getTransactionList();
            const groupedHTML = this.renderGroupedList(transactions);
            
            const content = `
                <div class="history-page">
                    <div class="history-header">
                        <h2>Riwayat Transaksi</h2>
                    </div>
                    
                    <div class="filter-bar">
                        <div class="filter-chip active">Semua</div>
                        <div class="filter-chip">Pemasukan</div>
                        <div class="filter-chip">Pengeluaran</div>
                        <div class="filter-chip">Bulan Ini</div>
                    </div>

                    <div class="timeline-container">
                        ${transactions.length > 0 
                            ? groupedHTML 
                            : `
                                <div class="empty-state">
                                    <div class="empty-icon">📝</div>
                                    <h3>Belum ada data</h3>
                                    <p>Transaksi yang kamu buat akan muncul di sini.</p>
                                </div>
                              `
                        }
                    </div>
                </div>
            `;
            
            container.innerHTML = await MainLayout.render(content);
        } catch (error) {
            container.innerHTML = `<div class="p-4 error-message">Error: ${error.message}</div>`;
        } finally {
            Loader.hide();
        }
    },

    renderGroupedList(transactions) {
        const groups = {};
        
        // Grouping berdasarkan tanggal
        transactions.forEach(t => {
            if (!groups[t.dateDisplay]) groups[t.dateDisplay] = [];
            groups[t.dateDisplay].push(t);
        });

        // Render HTML
        return Object.keys(groups).map(date => {
            const dateObj = new Date(date);
            // Format: "Senin, 20 Okt"
            const niceDate = dateObj.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
            });

            return `
                <div class="date-group">
                    <div class="date-header">
                        <span class="date-label">${niceDate}</span>
                    </div>
                    <div class="transaction-list">
                        ${groups[date].map(t => TransactionCard.render(t)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
};