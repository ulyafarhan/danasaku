import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { Utils } from '../../../core/utils.js';
import { eventBus } from '../../../core/eventBus.js';
import { syncTransactions } from './syncTransactions.js'; 

export async function createTransaction(formData) {
    // Validasi Sederhana
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Nominal harus lebih dari 0');
    }

    // Persiapan Objek Data
    const newTransaction = {
        id: Utils.generateUUID(),
        timestamp: Utils.getCurrentTimestamp(),
        dateDisplay: formData.dateDisplay || Utils.formatDate(new Date()),
        type: formData.type,
        category: formData.category || 'Lain-lain',
        amount: parseFloat(formData.amount),
        note: formData.note || '-',
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

        return true;
    } catch (error) {
        console.error(error);
        throw new Error('Gagal menyimpan ke database lokal.');
    }
}