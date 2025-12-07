// Use Case: Membuat Transaksi Baru
import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { Utils } from '../../../core/utils.js';
import { eventBus } from '../../../core/eventBus.js';
import { syncTransactions } from './syncTransactions.js'; 

export async function createTransaction(formData) {
    // Validasi Input Transaksi di Form 
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        // Validasi Nominal: Pastikan ada nilai dan lebih dari 0
        throw new Error('Nominal harus lebih dari 0'); // Validasi Nominal
    }

    // Membuat Objek Transaksi Baru
    const newTransaction = {
        id: Utils.generateUUID(), // Generate UUID
        timestamp: Utils.getCurrentTimestamp(), // Format: YYYY-MM-DD HH:mm:ss
        dateDisplay: formData.dateDisplay || Utils.formatDate(new Date()), // Format: YYYY-MM-DD
        type: formData.type, // INCOME / EXPENSE
        category: formData.category || 'Lain-lain', // Default: Lain-lain
        amount: parseFloat(formData.amount), // Format: 1234.56
        note: formData.note || '-', // Default: '-'
        syncStatus: 0 // 0 = Belum Sync
    };

    try {
        // 1. Simpan ke IndexedDB (Lokal)
        await TransactionRepo.addTransaction(newTransaction);
        
        // 2. Kabari UI untuk update
        eventBus.emit('transaction:created', newTransaction); 

        // 3. Coba Sync ke Telegram (Background Process)
        // Kita tidak pakai 'await' agar UI tidak nge-lag nunggu sinyal
        if (navigator.onLine) {
            syncTransactions().then(res => {
                console.log('Auto-sync status:', res);
            }).catch(err => console.error('Auto-sync fail', err));
        }

        // 4. Return Success
        return true;
    } catch (error) {
        // 5. Handle Error
        console.error(error);
        throw new Error('Gagal menyimpan ke database lokal.');
    }
}