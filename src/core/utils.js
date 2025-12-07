// Helper Format Rupiah, Generate UUID, Date
export const Utils = {
    // Format Rupiah
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    generateUUID() {
        // Generate UUID
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    getCurrentTimestamp() {
        // Dalam detik
        return Math.floor(Date.now() / 1000);
    },

    formatDate(dateObj) {
        // Format: YYYY-MM-DD
        return dateObj.toISOString().split('T')[0];
    }
};