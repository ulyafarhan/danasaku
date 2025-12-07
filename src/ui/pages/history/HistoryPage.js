import { getTransactionList } from '../../../modules/transaction/use-cases/getTransactionList.js';
import { TransactionCard } from '../../components/shared/TransactionCard.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { MainLayout } from '../../layout/MainLayout.js';
import Loader from '../../components/shared/Loader.js';
import { eventBus } from '../../../core/eventBus.js';

export const HistoryPage = {
    // Flag untuk mencegah duplikasi listener
    listenersInitialized: false,

    initListeners() {
        // Jika sudah di-init, jangan jalankan lagi
        if (this.listenersInitialized) return;

        // Handler untuk refresh halaman
        const refreshHandler = () => {
             // Hanya refresh jika user sedang berada di halaman history
             if(window.location.hash.startsWith('#history')) {
                 this.render(document.getElementById('app'));
             }
        };
        
        // Dengar event dari module lain
        eventBus.on('transaction:deleted', refreshHandler);
        eventBus.on('transaction:updated', refreshHandler);
        eventBus.on('sync:complete', refreshHandler); // Tambahan: Refresh jika sync background selesai
        
        this.listenersInitialized = true;
    },

    // State lokal untuk filter
    currentFilter: 'ALL', // 'ALL', 'INCOME', 'EXPENSE'
    cachedTransactions: [],

    async render(container) {
        // 1. Panggil Listener agar aktif
        this.initListeners();

        Loader.show();
        await loadCSS('/src/ui/pages/history/History.css');
        await loadCSS('/src/ui/components/shared/TransactionCard.css'); // Pastikan CSS kartu ada
        
        try {
            // Ambil data terbaru
            this.cachedTransactions = await getTransactionList();
            
            // Render kerangka halaman
            const content = `
                <div class="history-page">
                    <div class="history-header">
                        <h2>Riwayat Transaksi</h2>
                    </div>
                    
                    <div class="filter-bar" id="filter-container">
                        ${this.renderFilters()}
                    </div>

                    <div id="timeline-container" class="timeline-container">
                        </div>
                </div>
            `;
            
            container.innerHTML = await MainLayout.render(content);
            
            // Render isi list sesuai filter aktif
            this.updateTimeline();
            
            // Pasang event listener untuk filter
            this.attachEvents();

        } catch (error) {
            container.innerHTML = `<div class="p-4 error-message">Error: ${error.message}</div>`;
        } finally {
            Loader.hide();
        }
    },

    renderFilters() {
        const filters = [
            { id: 'ALL', label: 'Semua' },
            { id: 'INCOME', label: 'Pemasukan' },
            { id: 'EXPENSE', label: 'Pengeluaran' }
        ];

        return filters.map(f => `
            <button class="filter-chip ${this.currentFilter === f.id ? 'active' : ''}" 
                    data-filter="${f.id}">
                ${f.label}
            </button>
        `).join('');
    },

    updateTimeline() {
        const container = document.getElementById('timeline-container');
        if (!container) return;

        // 1. Filter Data
        const filteredData = this.cachedTransactions.filter(t => {
            if (this.currentFilter === 'ALL') return true;
            return t.type === this.currentFilter;
        });

        // 2. Render Empty State jika kosong
        if (filteredData.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>Tidak ada data</h3>
                    <p>Belum ada transaksi untuk kategori ini.</p>
                </div>
            `;
            return;
        }

        // 3. Render List
        container.innerHTML = this.renderGroupedList(filteredData);
    },

    attachEvents() {
        const filterContainer = document.getElementById('filter-container');
        if (!filterContainer) return;
        
        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-chip');
            if (!btn) return;

            // Update State
            this.currentFilter = btn.dataset.filter;

            // Update UI Tombol
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update List
            this.updateTimeline();
        });
    },

    renderGroupedList(transactions) {
        const groups = {};
        
        // Grouping by Date
        transactions.forEach(t => {
            if (!groups[t.dateDisplay]) groups[t.dateDisplay] = [];
            groups[t.dateDisplay].push(t);
        });

        return Object.keys(groups).map(date => {
            const dateObj = new Date(date);
            const niceDate = dateObj.toLocaleDateString('id-ID', { 
                weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' 
            });

            return `
                <div class="date-group">
                    <div class="date-header">
                        <span class="date-label">${niceDate}</span>
                    </div>
                    <div class="transaction-list">
                        ${groups[date].map(t => TransactionCard.render(t)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }
};