/**
 // @fileoverview
 // File ini berisi konfigurasi aplikasi DanaSaku yang ada di Aplikasi Google Script.
 // Konfigurasi ini mencakup ID Spreadsheet, nama sheet, token Telegram, ID chat Telegram, dan APP_SECRET.
 // Semua nilai ini harus disimpan di file .env untuk keamanan.
/**

const CONFIG = {
  SPREADSHEET_ID: 'Disembunyikan',
  SHEET_NAME: 'Transactions',
  TELEGRAM_TOKEN: 'Disembunyikan',
  TELEGRAM_CHAT_ID: 'Disembunyikan',
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

// --- FUNGSI TELEGRAM PROFESIONAL ---
function sendTelegram(data, action) {
  if (!CONFIG.TELEGRAM_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;

  const now = new Date();
  const timeString = Utilities.formatDate(now, "Asia/Jakarta", "dd MMMM yyyy | HH:mm 'WIB'");

  let message = '';

  if (action === 'create') {
    // --- SKENARIO: DATA BARU (BATCH) ---
    message = `<b>LAPORAN TRANSAKSI BARU</b>\n`;
    message += `Waktu Pelaporan: ${timeString}\n`;
    message += `Status: Berhasil Disimpan\n`;
    message += `==============================\n\n`;

    data.forEach(row => {
      // Struktur: [ID, Tanggal, Pemasukan, Pengeluaran, Kategori, Catatan, Time]
      // Index:     0     1         2           3           4         5       6
      const income = Number(row[2] || 0);
      const expense = Number(row[3] || 0);
      const category = row[4];
      const note = row[5] && row[5] !== '-' ? row[5] : 'Tidak ada catatan';
      
      const amount = income || expense;
      const typeLabel = income ? 'Pemasukan' : 'Pengeluaran';
      
      message += `<b>Jenis:</b> ${typeLabel}\n`;
      message += `<b>Kategori:</b> ${category}\n`;
      message += `<b>Nominal:</b> Rp ${formatRupiah(amount)}\n`;
      message += `<b>Keterangan:</b> ${note}\n`;
      message += `------------------------------\n`;
    });

  } else if (action === 'update') {
    // --- SKENARIO: PEMBARUAN DATA ---
    const typeLabel = data.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran';
    const note = data.note && data.note !== '-' ? data.note : 'Tidak ada catatan';

    message = `<b>NOTIFIKASI PEMBARUAN DATA</b>\n`;
    message += `Waktu Perubahan: ${timeString}\n`;
    message += `Status: Data Telah Diperbarui\n`;
    message += `==============================\n\n`;
    
    message += `<b>RINCIAN TERKINI:</b>\n`;
    message += `<b>Jenis Transaksi:</b> ${typeLabel}\n`;
    message += `<b>Kategori:</b> ${data.category}\n`;
    message += `<b>Nominal:</b> Rp ${formatRupiah(data.amount)}\n`;
    message += `<b>Keterangan:</b> ${note}\n`;
    message += `\n<i>Sistem telah memperbarui data pada basis data spreadsheet.</i>`;

  } else if (action === 'delete') {
    // --- SKENARIO: PENGHAPUSAN DATA ---
    const typeLabel = data.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran';
    const note = data.note && data.note !== '-' ? data.note : 'Tidak ada catatan';

    message = `<b>NOTIFIKASI PENGHAPUSAN DATA</b>\n`;
    message += `Waktu Penghapusan: ${timeString}\n`;
    message += `Status: Dihapus Permanen\n`;
    message += `==============================\n\n`;
    
    message += `<b>ARSIP DATA YANG DIHAPUS:</b>\n`;
    message += `<b>Jenis Transaksi:</b> ${typeLabel}\n`;
    message += `<b>Kategori:</b> ${data.category}\n`;
    message += `<b>Nominal:</b> Rp ${formatRupiah(data.amount)}\n`;
    message += `<b>Keterangan:</b> ${note}\n`;
    message += `\n<i>Data transaksi di atas telah dihapus dari sistem dan tidak dapat dipulihkan.</i>`;
  }

  // Kirim ke Telegram
  try {
    UrlFetchApp.fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'post',
      payload: {
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML' 
      }
    });
  } catch (e) {
    console.log("Telegram Error: " + e.toString());
  }
}

// Helper Format Rupiah (Lebih Rapi)
function formatRupiah(num) {
  // Format angka Indonesia (menggunakan titik sebagai pemisah ribuan)
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}