import { Utils } from '../../../core/utils.js';
import { loadCSS } from '../../../core/cssLoader.js';

// Memastikan CSS diload jika komponen ini dipanggil terpisah (optional safety)
loadCSS('/src/ui/components/shared/TransactionCard.css');

export const TransactionCard = {
    render(transaction) {
        const amountDisplay = Utils.formatCurrency(transaction.amount);
        const isExpense = transaction.type === 'EXPENSE';
        const typeClass = isExpense ? 'expense' : 'income';
        
        // Icon SVG yang lebih modern
        const iconSvg = isExpense 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7 7 7-7"/></svg>` // Panah Bawah
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7-7-7 7"/></svg>`; // Panah Atas

        const timeStr = new Date(transaction.timestamp * 1000).toLocaleTimeString('id-ID', {
            hour: '2-digit', 
            minute:'2-digit'
        });

        return `
            <div class="transaction-card">
                <div class="transaction-icon ${typeClass}">
                    ${iconSvg}
                </div>
                <div class="transaction-details">
                    <h4 class="transaction-description">${transaction.category}</h4>
                    <span class="transaction-date">${timeStr} • ${transaction.note || 'Tanpa catatan'}</span>
                </div>
                <div class="transaction-amount ${typeClass}">
                    ${isExpense ? '-' : '+'} ${amountDisplay}
                </div>
            </div>
        `;
    }
};