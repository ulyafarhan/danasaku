import { APP_CONFIG } from '../../config/appConfig.js';

// Schema: Objek Transaksi
export function onUpgradeNeeded(db) {
    if (!db.objectStoreNames.contains(APP_CONFIG.STORE_NAME)) {
        const store = db.createObjectStore(APP_CONFIG.STORE_NAME, { keyPath: 'id' });
        
        // Index Kueri: Tanggal, Kategori, Status Sync, Timestamp
        store.createIndex('by_date', 'dateDisplay', { unique: false });
        store.createIndex('by_sync_status', 'syncStatus', { unique: false });
        store.createIndex('by_timestamp', 'timestamp', { unique: false });
    }
}