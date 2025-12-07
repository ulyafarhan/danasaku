// Use Case: Query Transaksi
import { TransactionRepo } from '../../../repositories/transactionRepo.js';

export async function getTransactionList() {
    // Mengambil semua transaksi
    // Logika filtering akan ditambahkan di sini jika diperlukan
    const list = await TransactionRepo.getAllTransactions();
    return list;
}