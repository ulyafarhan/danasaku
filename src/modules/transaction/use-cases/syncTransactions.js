// Logika Batch Upload

import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { DataMapper } from '../../../data/api/dataMapper.js';
import { GASClient } from '../../../data/api/gasClient.js';
import { eventBus } from '../../../core/eventBus.js';

// Business Use Case: Batch Upload Logic
export async function syncTransactions() {
    try {
        const pendingData = await TransactionRepo.getUnsyncedTransactions();
        
        if (pendingData.length === 0) return { success: true, count: 0 };

        // Transform data
        const payloadRows = pendingData.map(DataMapper.toSheetRow);

        // Send to Cloud
        await GASClient.sendBatch(payloadRows);

        // Update Local Status
        const ids = pendingData.map(d => d.id);
        await TransactionRepo.markAsSynced(ids);

        console.log(`Synced ${ids.length} items.`);
        
        // Notify UI (if running in main thread)
        if (typeof window !== 'undefined') {
            eventBus.emit('sync:complete', { count: ids.length });
        }

        return { success: true, count: ids.length };

    } catch (error) {
        console.error('Sync Job Failed:', error);
        return { success: false, error };
    }
}