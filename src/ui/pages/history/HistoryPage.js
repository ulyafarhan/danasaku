import { getTransactionList } from '../../../modules/transaction/use-cases/getTransactionList.js';
import { TransactionCard } from '../../components/shared/TransactionCard.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { MainLayout } from '../../layout/MainLayout.js';

export const HistoryPage = {
    async render(container) {
        await loadCSS('/src/ui/pages/history/History.css');
        await loadCSS('/src/ui/components/shared/TransactionCard.css'); // Pastikan CSS kartu dimuat
        
        try {
            const transactions = await getTransactionList();
            const groupedHTML = this.renderGroupedList(transactions);
            
            const content = `
                <div class="history-page">
                    <div class="history-header-main">
                        <h2>Riwayat Transaksi</h2>
                    </div>
                    <div class="timeline-container">
                        ${transactions.length > 0 ? groupedHTML : '<div class="empty-state">👋 Belum ada transaksi tercatat.</div>'}
                    </div>
                </div>
            `;
            
            container.innerHTML = await MainLayout.render(content);
        } catch (error) {
            container.innerHTML = `Error: ${error.message}`;
        }
    },

    renderGroupedList(transactions) {
        const groups = {};
        
        // Grouping Logic
        transactions.forEach(t => {
            if (!groups[t.dateDisplay]) groups[t.dateDisplay] = [];
            groups[t.dateDisplay].push(t);
        });

        // Render HTML
        return Object.keys(groups).map(date => {
            // Format Tanggal Cantik (e.g., "Senin, 25 Okt 2023")
            const dateObj = new Date(date);
            const niceDate = dateObj.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });

            return `
                <div class="date-group">
                    <div class="sticky-date">
                        <span>${niceDate}</span>
                    </div>
                    <div class="transaction-list-card">
                        ${groups[date].map(t => TransactionCard.render(t)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
};