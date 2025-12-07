// Agregasi Saldo

import { TransactionRepo } from '../../../repositories/transactionRepo.js';

// Business Use Case: Aggregate Data
export async function calculateBalance() {
    const transactions = await TransactionRepo.getAllTransactions();
    
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
        if (t.type === 'INCOME') {
            totalIncome += t.amount;
        } else if (t.type === 'EXPENSE') {
            totalExpense += t.amount;
        }
    });

    const netBalance = totalIncome - totalExpense;

    return {
        totalIncome,
        totalExpense,
        netBalance
    };
}