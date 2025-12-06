// Helper: Format Rupiah, Generate UUID, Date

// Core: Utilities
export const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    getCurrentTimestamp() {
        return Math.floor(Date.now() / 1000);
    },

    formatDate(dateObj) {
        return dateObj.toISOString().split('T')[0];
    }
};