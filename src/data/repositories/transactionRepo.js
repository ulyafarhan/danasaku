// CRUD Logic ke IndexedDB

import { IDBConnection } from '../database/idbConnection.js';
import { APP_CONFIG } from '../../config/appConfig.js';

// Transaction Repository
export const TransactionRepo = {
    async addTransaction(data) {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readwrite');
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            
            const request = store.add(data);
            
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    },

    async getAllTransactions() {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readonly');
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            const index = store.index('by_timestamp'); // Sort by time default
            
            const request = index.getAll(); // Get all data
            
            request.onsuccess = () => {
                // Reverse to show newest first
                resolve(request.result.reverse());
            };
            request.onerror = () => reject(request.error);
        });
    },

    async getUnsyncedTransactions() {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readonly');
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            const index = store.index('by_sync_status');
            
            // 0 = Pending Sync
            const request = index.getAll(0); 
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async markAsSynced(idList) {
        const db = await IDBConnection.getDB();
        const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readwrite');
        const store = tx.objectStore(APP_CONFIG.STORE_NAME);

        idList.forEach(id => {
            const getReq = store.get(id);
            getReq.onsuccess = () => {
                const data = getReq.result;
                if (data) {
                    data.syncStatus = 1; // 1 = Synced
                    store.put(data);
                }
            };
        });

        return new Promise((resolve) => {
            tx.oncomplete = () => resolve(true);
        });
    }
};