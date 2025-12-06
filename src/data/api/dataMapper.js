// Transformasi JSON Lokal <-> Array Spreadsheet

// Transform: Local Object -> Spreadsheet Row Array
export const DataMapper = {
    toSheetRow(transaction) {
        return [
            transaction.id,            // Col A
            transaction.dateDisplay,   // Col B
            transaction.type,          // Col C
            transaction.category,      // Col D
            transaction.amount,        // Col E
            transaction.note,          // Col F
            transaction.timestamp      // Col G
        ];
    }
};