// Controller Halaman Dashboard

import { calculateBalance } from '../../../modules/transaction/use-cases/calculateBalance.js';
import { getTransactionList } from '../../../modules/transaction/use-cases/getTransactionList.js';
import { TransactionCard } from '../../components/shared/TransactionCard.js';
import { Utils } from '../../../core/utils.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { eventBus } from '../../../core/eventBus.js';
import { MainLayout } from '../../layout/MainLayout.js';

// Page Controller: Dashboard
export const DashboardPage = {
    
    // Register listener for real-time updates
    initListeners() {
        eventBus.on('transaction:created', () => this.render(document.getElementById('app')));
    },

    async render(container) {
        await loadCSS('/src/ui/pages/dashboard/Dashboard.css');
        
        this.initListeners();

        try {
            const balanceData = await calculateBalance();
            const transactions = await getTransactionList();

            const balanceHTML = this.renderBalance(balanceData);
            const listHTML = transactions.map(t => TransactionCard.render(t)).join('');

            container.innerHTML = `
                <div class="dashboard-page">
                    <header>
                        <h2>Selamat Datang</h2>
                    </header>
                    ${balanceHTML}
                    <div class="transaction-history">
                        <h3>Riwayat Terbaru (${transactions.length} items)</h3>
                        ${transactions.length > 0 ? listHTML : '<p class="empty-state">Belum ada transaksi.</p>'}
                    </div>
                </div>
            `;
        } catch (error) {
            container.innerHTML = `<h1>Error Loading Dashboard: ${error.message}</h1>`;
        }
    },

    renderBalance(data) {
        return `
            <div class="balance-summary">
                <div class="card total">
                    <h4>Saldo Bersih</h4>
                    <p class="amount">${Utils.formatCurrency(data.netBalance)}</p>
                </div>
                <div class="card income">
                    <h4>Pemasukan</h4>
                    <p class="amount">${Utils.formatCurrency(data.totalIncome)}</p>
                </div>
                <div class="card expense">
                    <h4>Pengeluaran</h4>
                    <p class="amount">${Utils.formatCurrency(data.totalExpense)}</p>
                </div>
            </div>
        `;
    }
};

const balanceData = await calculateBalance();
const transactions = await getTransactionList();

// Gunakan Template Literals untuk konten dalam
const content = `
    <div class="dashboard-page">
        </div>
`;

container.innerHTML = await MainLayout.render(content);