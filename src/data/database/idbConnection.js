// Singleton: Koneksi Database

import { APP_CONFIG } from '../../config/appConfig.js';
import { onUpgradeNeeded } from './idbSchema.js';

// Singleton Database Connection
let dbInstance = null;

export const IDBConnection = {
    async getDB() {
        if (dbInstance) return dbInstance;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(APP_CONFIG.DB_NAME, APP_CONFIG.DB_VERSION);

            request.onupgradeneeded = (event) => {
                onUpgradeNeeded(event.target.result);
            };

            request.onsuccess = (event) => {
                dbInstance = event.target.result;
                resolve(dbInstance);
            };

            request.onerror = (event) => {
                console.error('IDB Error:', event.target.error);
                reject(event.target.error);
            };
        });
    }
};