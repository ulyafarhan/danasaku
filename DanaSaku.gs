/**
 // @fileoverview
 // File ini berisi konfigurasi aplikasi DanaSaku yang ada di Aplikasi Google Script.
 // Konfigurasi ini mencakup ID Spreadsheet, nama sheet, token Telegram, ID chat Telegram, dan APP_SECRET.
 // Semua nilai ini harus disimpan di file .env untuk keamanan.
/**

const CONFIG = {
  SPREADSHEET_ID: 'Saya Sembunyikan di .env',
  SHEET_NAME: 'Transactions',
  TELEGRAM_TOKEN: 'Saya Sembunyikan di .env',
  TELEGRAM_CHAT_ID: 'Saya Sembunyikan di .env',
  APP_SECRET: 'Saya Sembunyikan di .env'
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (!e || !e.postData) return createJSONOutput({ status: 'error', message: 'No data' });

    const payload = JSON.parse(e.postData.contents);
    if (payload.authKey !== CONFIG.APP_SECRET) {
      return createJSONOutput({ status: 'error', message: 'Unauthorized: Salah PIN bos!' });
    }

    const action = payload.action || 'create';
    const data = payload.data;

    const doc = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = doc.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = doc.insertSheet(CONFIG.SHEET_NAME);
      // Header sesuai struktur 7 kolom (Tanpa Nominal)
      sheet.appendRow(['ID Transaksi', 'Tanggal', 'Pemasukan', 'Pengeluaran', 'Kategori', 'Catatan', 'Timestamp']);
    }

    let result;

    if (action === 'create') {
      // --- LOGIC CREATE ---
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, data.length, data[0].length).setValues(data);
      
      // Kirim Notifikasi Create
      sendTelegram(data, 'create');
      
      result = { status: 'success', type: 'create', count: data.length };

    } else if (action === 'update') {
      // --- LOGIC UPDATE ---
      const rowIndex = findRowIndexById(sheet, data.id);
      if (rowIndex !== -1) {
        const isIncome = data.type === 'INCOME';
        const incomeVal = isIncome ? data.amount : '';
        const expenseVal = !isIncome ? data.amount : '';

        // Update data di sheet
        const rowData = [[
          data.dateDisplay, 
          incomeVal,
          expenseVal, 
          data.category, 
          data.note, 
          data.timestamp
        ]];
        sheet.getRange(rowIndex, 2, 1, 6).setValues(rowData);
        
        // Kirim Notifikasi Update
        sendTelegram(data, 'update');
        
        result = { status: 'success', type: 'update' };
      } else {
        result = { status: 'error', message: 'ID not found' };
      }

    } else if (action === 'delete') {
      // --- LOGIC DELETE ---
      const rowIndex = findRowIndexById(sheet, data.id);
      if (rowIndex !== -1) {
        // Ambil info baris sebelum dihapus untuk notifikasi (opsional, biar tau apa yg dihapus)
        // Kolom 1-7: ID, Tgl, Masuk, Keluar, Kat, Catatan, Time
        const oldDataRange = sheet.getRange(rowIndex, 1, 1, 7).getValues()[0];
        const deletedInfo = {
          category: oldDataRange[4],
          note: oldDataRange[5],
          amount: Number(oldDataRange[2] || oldDataRange[3] || 0),
          type: oldDataRange[2] ? 'INCOME' : 'EXPENSE'
        };

        sheet.deleteRow(rowIndex);
        
        // Kirim Notifikasi Delete
        sendTelegram(deletedInfo, 'delete');
        
        result = { status: 'success', type: 'delete' };
      } else {
        result = { status: 'error', message: 'ID not found' };
      }
    }

    return createJSONOutput(result);

  } catch (error) {
    return createJSONOutput({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// Helper: Cari baris berdasarkan ID
function findRowIndexById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      return i + 1;
    }
  }
  return -1;
}

function createJSONOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// --- FUNGSI TELEGRAM BARU (Support Create, Update, Delete) ---
function sendTelegram(data, action) {
  if (!CONFIG.TELEGRAM_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;

  let message = '';

  if (action === 'create') {
    // Data berupa Array of Arrays (Batch)
    message = '✅ <b>Transaksi Baru Dicatat</b>\n\n';
    let totalBatch = 0;

    data.forEach(row => {
      // Struktur: [ID, Tanggal, Pemasukan, Pengeluaran, Kategori, Catatan, Time]
      // Index:     0     1         2           3           4         5       6
      const income = Number(row[2] || 0);
      const expense = Number(row[3] || 0);
      const category = row[4];
      const note = row[5] || '-';
      
      const amount = income || expense;
      const icon = income ? '📈' : '📉';
      
      totalBatch += amount;
      
      message += `${icon} <b>${category}</b>\n`;
      message += `Rp ${formatRupiah(amount)}\n`;
      if(note !== '-') message += `Ket: ${note}\n`;
      message += `----------------\n`;
    });
    
    // message += `Total Batch: Rp ${formatRupiah(totalBatch)}`;

  } else if (action === 'update') {
    // Data berupa Object
    message = '✏️ <b>Transaksi Diperbarui</b>\n\n';
    const icon = data.type === 'INCOME' ? '📈' : '📉';
    
    message += `${icon} <b>${data.category}</b>\n`;
    message += `Nominal: Rp ${formatRupiah(data.amount)}\n`;
    message += `Catatan: ${data.note || '-'}\n`;
    message += `<i>Data telah diperbarui di Spreadsheet.</i>`;

  } else if (action === 'delete') {
    // Data berupa Object (Info yang dihapus)
    message = '🗑️ <b>Transaksi Dihapus</b>\n\n';
    const icon = data.type === 'INCOME' ? '📈' : '📉';
    
    message += `${icon} <b>${data.category}</b>\n`;
    message += `Nominal: Rp ${formatRupiah(data.amount)}\n`;
    message += `Catatan: ${data.note || '-'}\n`;
    message += `<i>Data telah dihapus permanen.</i>`;
  }

  // Kirim ke Telegram
  try {
    UrlFetchApp.fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'post',
      payload: {
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML' // Agar bisa pakai Bold/Italic
      }
    });
  } catch (e) {
    console.log("Telegram Error: " + e.toString());
  }
}

// Helper Format Rupiah Sederhana
function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID').format(num);
}