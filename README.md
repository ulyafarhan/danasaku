# DOKUMENTASI TEKNIS SISTEM: DANASAKU

## 1. Deskripsi Sistem
**DanaSaku** adalah sebuah platform aplikasi pencatatan dan manajemen keuangan pribadi yang dirancang menggunakan pendekatan *Progressive Web App* (PWA) dengan kapabilitas *Offline-First*. Sistem ini bertujuan untuk memberikan kemudahan bagi pengguna dalam melacak arus kas (pemasukan dan pengeluaran) secara seketika, baik dalam keadaan terhubung ke jaringan internet maupun tanpa koneksi internet.

Keunikan dari sistem ini terletak pada arsitektur *backend*-nya yang nirserver (*serverless*). Sistem tidak menggunakan peladen basis data konvensional (seperti MySQL atau PostgreSQL), melainkan memanfaatkan **Google Sheets** sebagai pusat penyimpanan data utama melalui antarmuka **Google Apps Script (GAS)**, serta menggunakan **IndexedDB** pada peramban klien untuk kapabilitas luring (*offline*).

## 2. Arsitektur dan Teknologi Pendukung
Sistem ini dibangun secara mandiri (*custom build*) tanpa bergantung pada kerangka kerja JavaScript pihak ketiga seperti React atau Vue. Hal ini memastikan aplikasi berjalan sangat ringan dan memiliki kontrol penuh terhadap manajemen memori.

* **Antarmuka Pengguna (Frontend):** Vanilla JavaScript (ES6+), HTML5, dan CSS3 murni.
* **Pola Arsitektur Frontend:** Pendekatan *Clean Architecture* berbasis Modul, dipisahkan menjadi *Core*, *Data*, *Modules (Use-Cases)*, *Repositories*, dan *UI*.
* **Sistem PWA:** Terintegrasi dengan *Service Worker* (`sw.js`) dan Manifes Web (`manifest.json`) untuk memungkinkan instalasi aplikasi di perangkat seluler maupun desktop.
* **Penyimpanan Luring (Local Storage):** *IndexedDB* dikonfigurasi secara natif melalui pembungkus (wrapper) khusus (`idbConnection.js` dan `idbSchema.js`).
* **Pusat Data (Backend/API):** Google Apps Script (`DanaSaku.gs`) yang bertindak sebagai REST API untuk menjembatani aplikasi dengan fail lembar kerja Google Sheets.
* **Manajemen Keadaan (State Management):** Menggunakan pola *Event Bus* (`eventBus.js`) untuk komunikasi antar komponen tanpa keterikatan erat (*loose coupling*).
* **Perutean (Routing):** *Custom Router* sisi klien (`router.js`) untuk menghasilkan pengalaman *Single Page Application* (SPA).

## 3. Fitur yang Tersedia
Hingga versi pengembangan saat ini, sistem DanaSaku memiliki modul dan fungsionalitas berikut:

* **Dasbor Utama (Dashboard):** Menampilkan metrik utama seperti total saldo (kalkulasi pemasukan dikurangi pengeluaran) dan ringkasan transaksi terakhir secara interaktif.
* **Manajemen Transaksi (CRUD):** * Pembuatan transaksi baru (pemasukan/pengeluaran) beserta nominal dan keterangannya.
    * Pembacaan riwayat transaksi secara mendetail.
    * Penyuntingan dan penghapusan transaksi.
* **Sistem Antarmuka Adaptif:** Memiliki pemisahan komponen navigasi cerdas. Menggunakan *Bottom Navigation* untuk perangkat seluler dan *Sidebar* untuk perangkat desktop.
* **Mode Luring Otomatis (Offline Mode):** Pengguna dapat menambah, mengedit, atau menghapus transaksi saat tidak ada internet. Perubahan akan disimpan secara lokal di dalam basis data IndexedDB.
* **Sinkronisasi Latar Belakang (Background Syncing):** Sistem secara otomatis akan melakukan sinkronisasi data dari IndexedDB ke Google Sheets ketika sistem mendeteksi kembalinya koneksi internet (modul `syncTransactions.js`).
* **Sistem Notifikasi:** Umpan balik visual untuk aktivitas pengguna, baik saat transaksi berhasil disimpan, dihapus, maupun peringatan konektivitas.

## 4. Bagaimana Sistem Bekerja (Alur Logika)

1.  **Inisialisasi Aplikasi:**
    Saat pengguna mengakses aplikasi, `main.js` akan memuat konfigurasi utama, mendaftarkan *Service Worker*, menginisialisasi rute, dan membangun skema basis data lokal pada IndexedDB.
2.  **Operasi Transaksi (Contoh: Menambah Data):**
    * Pengguna mengisi formulir pada `FormPage.js`.
    * UI memanggil *Use Case* `createTransaction.js`.
    * *Use Case* menginstruksikan `transactionRepo.js` untuk menyimpan data.
    * Repositori pertama-tama akan menyimpan data ke dalam **IndexedDB**.
    * Repositori kemudian memeriksa koneksi internet. Jika terhubung, permintaan HTTP akan dikirimkan melalui `gasClient.js` menuju ke *endpoint* Google Apps Script. Jika gagal atau luring, data ditandai sebagai *menunggu sinkronisasi* (pending sync).
3.  **Sinkronisasi Basis Data:**
    Saat konektivitas dipulihkan, *Event Bus* mendeteksi perubahan status jaringan, lalu memanggil fungsi `syncTransactions.js` yang akan mengirimkan tumpukan pembaruan lokal ke Google Sheets secara berurutan, lalu memperbarui status data lokal menjadi *terinkronisasi* (synced).
4.  **Sisi Server (DanaSaku.gs):**
    Google Apps Script menerima permintaan `POST` atau `GET`. Skrip ini kemudian memproses instruksi tersebut dengan melakukan operasi baca, tulis, ubah, atau hapus baris di dalam dokumen Google Sheets yang terhubung, kemudian mengembalikan respons berformat JSON ke aplikasi.

## 5. Struktur Direktori Utama
* `/DanaSaku.gs` : Skrip *backend* untuk dipasang pada Google Apps Script.
* `/index.html` : Kerangka utama *Single Page Application*.
* `/sw.js` : Skrip pelayan untuk *caching* aset dan kapabilitas luring (PWA).
* `/src/core/` : Modul infrastruktur utama (*Router, EventBus, CSS Loader, Utility*).
* `/src/data/` : Lapisan komunikasi basis data (Klien GAS untuk *online*, IndexedDB untuk *offline*, dan *Data Mapper*).
* `/src/modules/` : Logika bisnis dan spesifikasi *Use Case* (seperti `calculateBalance.js`, `syncTransactions.js`).
* `/src/repositories/` : Abstraksi manipulasi data (`transactionRepo.js`).
* `/src/styles/` : Arsitektur CSS murni yang disusun secara modular.
* `/src/ui/` : Lapisan presentasi yang memuat *Components*, *Layouts*, dan *Pages* (Dashboard, History, Form, Login).

## 6. Rencana Pengembangan Berikutnya (Future Roadmap)
Untuk meningkatkan utilitas dan skalabilitas sistem di masa depan, fokus pengembangan difokuskan pada:

1.  **Sistem Autentikasi dan Multi-Pengguna Lanjutan:**
    Mengonversi modul Login saat ini agar dapat terintegrasi dengan protokol *OAuth 2.0* (contoh: Google Sign-In) untuk memastikan keamanan data setiap pengguna.
2.  **Kategorisasi dan Analitik Visual:**
    Menambahkan tabel referensi kategori (Makanan, Transportasi, Gaji, dll.) serta mengimplementasikan pustaka visualisasi data (seperti Chart.js) untuk memberikan metrik berupa grafik donat atau grafik batang guna memetakan tren pengeluaran bulanan.
3.  **Peningkatan Integritas Penyelesaian Konflik (Conflict Resolution):**
    Memperbaiki mekanisme modul sinkronisasi agar memiliki mitigasi yang lebih baik apabila terjadi perubahan data pada perangkat ganda secara bersamaan sebelum proses penyelarasan ke Google Sheets.
4.  **Ekspor Data Terstruktur:**
    Memberikan fitur fungsionalitas untuk mengekspor riwayat transaksi ke dalam format PDF atau ekstensi fail CSV dari sisi antarmuka klien.

## 7. Instruksi Implementasi Google Apps Script
Untuk mengoperasikan sistem ini, pengaturan pada sisi *backend* diwajibkan:
1.  Buat lembar kerja (spreadsheet) baru di Google Sheets.
2.  Buka menu `Ekstensi > Apps Script`.
3.  Salin seluruh kode dari fail `DanaSaku.gs` dan tempelkan ke dalam editor Apps Script.
4.  Terapkan sebagai *Web App* (Web Application) dan atur hak akses *Execute As* menjadi "Me" dan *Who has access* menjadi "Anyone".
5.  Salin URL aplikasi yang dihasilkan dan masukkan sebagai variabel titik akhir (*endpoint url*) di dalam direktori fail `src/config/appConfig.js`.
