// Use Case: Mengupdate Transaksi
import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { GASClient } from '../../../data/api/gasClient.js';
import { eventBus } from '../../../core/eventBus.js';

export async function updateTransaction(transactionData) {
    // 1. Update Lokal
    // Pastikan syncStatus 1 (synced) agar tidak terkirim sebagai 'create' baru oleh sync job,
    // karena kita akan kirim update manual.
    transactionData.syncStatus = 1; 
    await TransactionRepo.updateTransaction(transactionData);
    
    // 2. Update UI
    eventBus.emit('transaction:updated', transactionData);

    // 3. Kirim ke Cloud (Fire & Forget)
    if (navigator.onLine) {
        GASClient.updateTransaction(transactionData)
            .then(() => console.log('Cloud update success'))
            .catch(err => console.error('Cloud update failed', err));
    }
}