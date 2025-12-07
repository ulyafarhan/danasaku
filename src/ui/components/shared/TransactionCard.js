import { Utils } from '../../../core/utils.js';

export const TransactionCard = {
    render(transaction) {
        const amountDisplay = Utils.formatCurrency(transaction.amount);
        const isExpense = transaction.type === 'EXPENSE';
        const typeClass = isExpense ? 'expense' : 'income';
        
        const icon = isExpense 
            ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>`
            : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;

        return `
            <div class="transaction-item">
                <div class="icon-circle ${typeClass}">
                    ${icon}
                </div>
                <div class="details">
                    <span class="category">${transaction.category}</span>
                    <span class="note">${transaction.note || 'Tanpa catatan'}</span>
                </div>
                <div class="value">
                    <span class="amount ${typeClass}">
                        ${isExpense ? '-' : '+'} ${amountDisplay}
                    </span>
                    <span class="time">${new Date(transaction.timestamp * 1000).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            </div>
        `;
    }
};