import { Utils } from '../../../core/utils.js';

// Dumb Component: Renders a single transaction object
export const TransactionCard = {
    render(transaction) {
        const amountDisplay = Utils.formatCurrency(transaction.amount);
        const typeClass = transaction.type === 'INCOME' ? 'income' : 'expense';
        const syncIcon = transaction.syncStatus === 1 ? '✅' : '⏳';

        return `
            <div class="transaction-card ${typeClass}">
                <div class="main-info">
                    <span class="category">${transaction.category}</span>
                    <span class="amount ${typeClass}">${amountDisplay}</span>
                </div>
                <div class="meta-info">
                    <span class="note">${transaction.note || '-'}</span>
                    <span class="date-status">${transaction.dateDisplay} ${syncIcon}</span>
                </div>
            </div>
        `;
    }
};