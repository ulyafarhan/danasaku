// Use Case: Menghitung Saldo
import { TransactionRepo } from '../../../repositories/transactionRepo.js';

export async function calculateBalance() {
    // Mengambil semua transaksi
    const transactions = await TransactionRepo.getAllTransactions();
    
    let totalIncome = 0;
    let totalExpense = 0;

    // Menghitung total pendapatan dan pengeluaran
    transactions.forEach(t => {
        if (t.type === 'INCOME') {
            totalIncome += t.amount;
        } else if (t.type === 'EXPENSE') {
            totalExpense += t.amount;
        }
    });

    // Menghitung saldo net
    const netBalance = totalIncome - totalExpense;

    // Mengembalikan hasil perhitungan
    return {
        totalIncome,
        totalExpense,
        netBalance
    };
}