export const DataMapper = {
    toSheetRow(transaction) {
        const isIncome = transaction.type === 'INCOME';
        // Jika Pemasukan, isi kolom Pemasukan, kosongkan Pengeluaran. Begitu sebaliknya.
        const incomeVal = isIncome ? transaction.amount : ''; 
        const expenseVal = !isIncome ? transaction.amount : '';

        return [
            transaction.id,            // Col A: ID
            transaction.dateDisplay,   // Col B: Tanggal
            incomeVal,                 // Col C: Pemasukan
            expenseVal,                // Col D: Pengeluaran
            transaction.category,      // Col E: Kategori
            transaction.note,          // Col G: Catatan
            transaction.timestamp      // Col H: Timestamp
        ];
    }
};