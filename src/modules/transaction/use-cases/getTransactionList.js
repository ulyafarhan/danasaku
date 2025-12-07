// Query & Filtering

import { TransactionRepo } from '../../../repositories/transactionRepo.js';

// Business Use Case: Query Transactions
export async function getTransactionList() {
    // Saat ini, hanya membungkus getAll. Logika filtering akan ditambahkan di sini jika diperlukan
    const list = await TransactionRepo.getAllTransactions();
    return list;
}