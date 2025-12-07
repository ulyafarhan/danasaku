// UI: Transaction Card
import { Utils } from '../../../core/utils.js';
import { deleteTransaction } from '../../../modules/transaction/use-cases/deleteTransaction.js';
import { router } from '../../../core/router.js';
import { loadCSS } from '../../../core/cssLoader.js';

// UI: Transaction Card
loadCSS('/src/ui/components/shared/TransactionCard.css');

// Komponen: Transaction Card
export const TransactionCard = {
    // Render transaksi ke dalam bentuk kartu
    render(transaction) {
        // Render transaksi ke dalam bentuk kartu
        const amountDisplay = Utils.formatCurrency(transaction.amount); // Format Rupiah
        const isExpense = transaction.type === 'EXPENSE'; // Pengeluaran
        const typeClass = isExpense ? 'expense' : 'income'; // Kelas pengeluaran atau pemasukan
        
        // Render ikon SVG berdasarkan tipe transaksi
        const iconSvg = isExpense 
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7 7 7-7"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7-7-7 7"/></svg>`;

        // Format tanggal dan waktu
        const timeStr = new Date(transaction.timestamp * 1000).toLocaleTimeString('id-ID', {
            hour: '2-digit', minute:'2-digit'
        });

        // Unique ID untuk tombol
        const btnEditId = `edit-${transaction.id}`;
        const btnDelId = `del-${transaction.id}`;

        // Render kartu transaksi ke dalam bentuk string HTML
        setTimeout(() => {
            // Attach event listener setelah render (trik simpel tanpa framework)
            const btnEdit = document.getElementById(btnEditId); // Tombol Edit
            const btnDel = document.getElementById(btnDelId); // Tombol Hapus
            
            // Event listener untuk tombol Edit
            if(btnEdit) btnEdit.onclick = (e) => {
                // Mencegah klik kartu
                e.stopPropagation(); // Mencegah klik kartu
                router.navigate(`#form?id=${transaction.id}`); // Navigasi ke halaman Edit
            };

            // Event listener untuk tombol Hapus
            if(btnDel) btnDel.onclick = async (e) => { 
                // Mencegah klik kartu
                e.stopPropagation();
                if(confirm('Hapus transaksi ini permanen?')) {
                    // Hapus transaksi dari server
                    await deleteTransaction(transaction.id);
                    // Refresh halaman otomatis via EventBus di HistoryPage/DashboardPage
                }
            };
        }, 0);

        // Render kartu transaksi ke dalam bentuk string HTML
        return `
            <div class="transaction-card">
                <div class="transaction-icon ${typeClass}">
                    ${iconSvg}
                </div>
                <div class="transaction-details">
                    <h4 class="transaction-description">${transaction.category}</h4>
                    <span class="transaction-date">${timeStr} • ${transaction.note || '-'}</span>
                </div>
                <div class="transaction-right">
                    <div class="transaction-amount ${typeClass}">
                        ${isExpense ? '-' : '+'} ${amountDisplay}
                    </div>
                    <div class="card-actions">
                        <button id="${btnEditId}" class="btn-icon-sm edit" title="Edit">✏️</button>
                        <button id="${btnDelId}" class="btn-icon-sm delete" title="Hapus">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }
};