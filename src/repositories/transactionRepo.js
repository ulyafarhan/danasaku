// CRUD Logic ke IndexedDB

import { IDBConnection } from '../data/database/idbConnection.js';
import { APP_CONFIG } from '../config/appConfig.js';

// Repository: Transaction
export const TransactionRepo = {
    /**
     * Menambahkan transaksi baru ke IndexedDB
     * @param {Object} data - Data transaksi yang akan ditambahkan
     * @returns {Promise<Object>} - Promise yang mengembalikan data transaksi yang ditambahkan
     */
    async addTransaction(data) {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            // Membuat transaksi baru
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readwrite');
            // Membuat object store
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            // Menambahkan data
            const request = store.add(data);
            // Menangani event success
            request.onsuccess = () => resolve(data);
            // Menangani event error
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Mengambil semua transaksi dari IndexedDB
     * @returns {Promise<Array>} - Promise yang mengembalikan array transaksi
     */
    async getAllTransactions() {
        // Membuat transaksi baru
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            // Membuat transaksi baru
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readonly');
            // Membuat object store
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            // Mengambil semua data
            const index = store.index('by_timestamp');
            // Mengambil semua data dari index by_timestamp
            const request = index.getAll();
            // Menangani event success
            request.onsuccess = () => resolve(request.result.reverse());
            // Menangani event error
            request.onerror = () => reject(request.error);
        });
    },

    async getUnsyncedTransactions() {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            // Membuat transaksi baru
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readonly');
            // Membuat object store
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            // Mengambil semua data
            const index = store.index('by_sync_status');
            // Mengambil semua data dari index by_sync_status   
            const request = index.getAll(0); 
            // Menangani event success
            request.onsuccess = () => resolve(request.result);
            // Menangani event error
            request.onerror = () => reject(request.error);
        });
    },

    async markAsSynced(idList) {
        const db = await IDBConnection.getDB();
        const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readwrite');
        const store = tx.objectStore(APP_CONFIG.STORE_NAME);
        idList.forEach(id => {
            // Membuat request get
            const getReq = store.get(id);
            // Menangani event success
            getReq.onsuccess = () => {
                // Mengambil data transaksi
                const data = getReq.result;
                if (data) {
                    // Mengubah status sync menjadi 1
                    data.syncStatus = 1;
                    store.put(data);
                }
            };
        });
        // Menangani event complete
        return new Promise((resolve) => { tx.oncomplete = () => resolve(true); });
    },

    /**
     * Mengambil transaksi berdasarkan ID
     * @param {string} id - ID transaksi yang akan diambil
     * @returns {Promise<Object>} - Promise yang mengembalikan data transaksi
     */
    async getTransactionById(id) {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            // Membuat transaksi baru
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readonly');
            // Membuat object store
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            // Mengambil data transaksi
            const request = store.get(id);
            // Menangani event success
            request.onsuccess = () => resolve(request.result);
            // Menangani event error
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Mengupdate transaksi di IndexedDB
     * @param {Object} data - Data transaksi yang akan diupdate
     * @returns {Promise<Object>} - Promise yang mengembalikan data transaksi yang diupdate
     */
    async updateTransaction(data) {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            // Membuat transaksi baru
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readwrite');
            // Membuat object store
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            // 'put' akan menimpa data jika ID sama
            const request = store.put(data); 
            // Menangani event success
            request.onsuccess = () => resolve(data);
            // Menangani event error
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Menghapus transaksi di IndexedDB
     * @param {string} id - ID transaksi yang akan dihapus
     * @returns {Promise<boolean>} - Promise yang mengembalikan true jika berhasil dihapus
     */
    async deleteTransaction(id) {
        const db = await IDBConnection.getDB();
        return new Promise((resolve, reject) => {
            // Membuat transaksi baru
            const tx = db.transaction(APP_CONFIG.STORE_NAME, 'readwrite');
            // Membuat object store
            const store = tx.objectStore(APP_CONFIG.STORE_NAME);
            // Menggunakan 'delete' untuk menghapus data
            const request = store.delete(id);
            // Menangani event success
            request.onsuccess = () => resolve(true);
            // Menangani event error    
            request.onerror = () => reject(request.error);
        });
    }
};