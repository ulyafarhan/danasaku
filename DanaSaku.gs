const CONFIG = {
  SPREADSHEET_ID: '',
  SHEET_NAME: 'Transactions',
  TELEGRAM_TOKEN: '',
  TELEGRAM_CHAT_ID: ''
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJSONOutput({ status: 'error', message: 'No data received' });
    }

    const payload = JSON.parse(e.postData.contents);
    const dataRows = payload.data;

    if (!dataRows || dataRows.length === 0) {
      return createJSONOutput({ status: 'empty', message: 'No transaction data' });
    }

    const doc = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = doc.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      sheet = doc.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow(['ID', 'Tanggal', 'Tipe', 'Kategori', 'Nominal', 'Catatan', 'Timestamp']);
    }

    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow + 1, 1, dataRows.length, dataRows[0].length).setValues(dataRows);

    sendTelegram(dataRows);

    return createJSONOutput({ status: 'success', saved: dataRows.length });

  } catch (error) {
    return createJSONOutput({ status: 'error', message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

function sendTelegram(rows) {
  if (!CONFIG.TELEGRAM_TOKEN || !CONFIG.TELEGRAM_CHAT_ID) return;

  let message = 'DanaSaku Audit\n\n';
  let totalBatch = 0;

  rows.forEach(row => {
    const category = row[3];
    const amount = Number(row[4]);
    const note = row[5] || '-';
    
    totalBatch += amount;
    const fmtAmount = new Intl.NumberFormat('id-ID').format(amount);

    message += `Kategori: ${category}\n`;
    message += `Nominal: Rp ${fmtAmount}\n`;
    message += `Catatan: ${note}\n`;
    message += `----------------\n`;
  });

  const fmtTotal = new Intl.NumberFormat('id-ID').format(totalBatch);
  message += `Total: Rp ${fmtTotal}`;

  try {
    UrlFetchApp.fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage`, {
      method: 'post',
      payload: {
        chat_id: CONFIG.TELEGRAM_CHAT_ID,
        text: message
      }
    });
  } catch (e) {}
}

function createJSONOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}