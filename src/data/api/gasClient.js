// Fetch Wrapper ke Google Apps Script

import { APP_CONFIG } from '../../config/appConfig.js';

// API Wrapper for Google Apps Script
export const GASClient = {
    async sendBatch(rows) {
        if (!APP_CONFIG.API_URL) {
            console.warn('API_URL belum dikonfigurasi.');
            return false;
        }

        try {
            const response = await fetch(APP_CONFIG.API_URL, {
                method: 'POST',
                mode: 'no-cors', // Penting untuk GAS Web App sederhana
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data: rows })
            });
            
            // Mode 'no-cors' tidak mengembalikan detail response JSON
            // Kita asumsikan sukses jika tidak throw error
            return true;
        } catch (error) {
            console.error('Sync Error:', error);
            throw error;
        }
    }
};