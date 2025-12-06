// Validasi Dan Simpan Transaksi

import { TransactionRepo } from '../../../data/repositories/transactionRepo.js';
import { Utils } from '../../../core/utils.js';
import { eventBus } from '../../../core/eventBus.js';

// Business Use Case: Create, Validate, and Save
export async function createTransaction(formData) {
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Nominal transaksi harus lebih dari nol.');
    }

    if (!formData.type || !['INCOME', 'EXPENSE'].includes(formData.type)) {
        throw new Error('Tipe transaksi tidak valid.');
    }

    const newTransaction = {
        id: Utils.generateUUID(),
        timestamp: Utils.getCurrentTimestamp(),
        dateDisplay: formData.dateDisplay || Utils.formatDate(new Date()),
        type: formData.type,
        category: formData.category || 'Lain-lain',
        amount: parseFloat(formData.amount),
        note: formData.note || '',
        syncStatus: 0 
    };

    try {
        await TransactionRepo.addTransaction(newTransaction);
        // Inform UI/other modules that a new transaction exists
        eventBus.emit('transaction:created', newTransaction); 
        return true;
    } catch (error) {
        throw new Error('Gagal menyimpan transaksi lokal.');
    }
}