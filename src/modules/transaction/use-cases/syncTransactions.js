// Use Case: Batch Upload Transaksi
import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { DataMapper } from '../../../data/api/dataMapper.js';
import { GASClient } from '../../../data/api/gasClient.js';
import { eventBus } from '../../../core/eventBus.js';

// Use Case: Kirim Transaksi ke Cloud
export async function syncTransactions() {
    try {
        // Mengambil transaksi yang belum disinkronkan
        const pendingData = await TransactionRepo.getUnsyncedTransactions();
        // Jika tidak ada transaksi yang belum disinkronkan, kembalikan
        if (pendingData.length === 0) return { success: true, count: 0 };

        // Jika ada transaksi yang belum disinkronkan, transformasi data
        const payloadRows = pendingData.map(DataMapper.toSheetRow);

        // Kirim ke GAS
        await GASClient.sendBatch(payloadRows);

        // Update status disinkronkan
        const ids = pendingData.map(d => d.id);
        await TransactionRepo.markAsSynced(ids);

        // Logika notifikasi UI
        console.log(`Synced ${ids.length} items.`);
        
        // Kirim notifikasi ke UI
        if (typeof window !== 'undefined') {
            eventBus.emit('sync:complete', { count: ids.length });
        }

        // Kirim notifikasi ke Telegram
        return { success: true, count: ids.length };

    } catch (error) {
        // Logika notifikasi error
        console.error('Sync Job Failed:', error);
        return { success: false, error };
    }
}