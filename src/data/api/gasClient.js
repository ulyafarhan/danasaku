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
            // Lakukan HTTP request ke GAS
            const response = await fetch(APP_CONFIG.API_URL, {
                method: 'POST',
                redirect: 'follow', // Penting: Ikuti redirect 302 dari Google
                headers: { 
                    'Content-Type': 'text/plain;charset=utf-8' 
                },
                body: JSON.stringify(securedPayload)
            });

            // Cek apakah HTTP request sukses (200 OK)
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
            }

            // Parse jawaban JSON dari server
            const result = await response.json();

            // Cek logika sukses dari server (cek status: 'success' dari DanaSaku.gs)
            if (result.status !== 'success') {
                throw new Error(result.message || 'Server menolak permintaan (Unauthorized/Error).');
            }

            return true;

        } catch (error) {
            console.error('GAS Error:', error);
            // Lempar error ke atas agar UI tahu kalau ini gagal
            // (Nanti ikon centang bisa berubah jadi silang/merah)
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