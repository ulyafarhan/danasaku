import { APP_CONFIG } from '../../config/appConfig.js';

// Klien Google Apps Script
export const GASClient = {
    // Metode POST: Kirim data ke GAS
    async _post(payload) {
        if (!APP_CONFIG.API_URL) return false;
        // Tambahkan kunci rahasia ke payload
        const securedPayload = {
            ...payload,
            authKey: APP_CONFIG.APP_SECRET 
        };
        try {
            await fetch(APP_CONFIG.API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            return true;
        } catch (error) {
            console.error('GAS Error:', error);
            throw error;
        }
    },

    // Metode POST: Kirim batch transaksi ke GAS
    async sendBatch(rows) {
        return this._post({ action: 'create', data: rows });
    },

    // Metode POST: Update transaksi di GAS
    async updateTransaction(transaction) {
        return this._post({ action: 'update', data: transaction });
    },

    // Metode POST: Hapus transaksi di GAS
    async deleteTransaction(id) {
        return this._post({ action: 'delete', data: { id } });
    }
};