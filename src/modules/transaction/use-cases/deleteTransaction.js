// Use Case: Menghapus Transaksi
import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { GASClient } from '../../../data/api/gasClient.js';
import { eventBus } from '../../../core/eventBus.js';

export async function deleteTransaction(id) {
    // 1. Hapus Lokal
    await TransactionRepo.deleteTransaction(id);
    
    // 2. Update UI
    eventBus.emit('transaction:deleted', id);

    // 3. Hapus di Cloud
    if (navigator.onLine) {
        GASClient.deleteTransaction(id)
            .then(() => console.log('Cloud delete success'))
            .catch(err => console.error('Cloud delete failed', err));
    }
}