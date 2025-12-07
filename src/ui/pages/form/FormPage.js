import { createTransaction } from '../../../modules/transaction/use-cases/createTransaction.js';
import { updateTransaction } from '../../../modules/transaction/use-cases/updateTransaction.js';
import { TransactionRepo } from '../../../repositories/transactionRepo.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { router } from '../../../core/router.js';
import { MainLayout } from '../../layout/MainLayout.js';
import Loader from '../../components/shared/Loader.js';
import { Button } from '../../components/shared/Button.js';

export const FormPage = {
    // State
    editId: null,
    currentTransaction: null,

    async render(container) {
        Loader.show();
        await loadCSS('/src/ui/pages/form/Form.css');
        
        // Cek apakah mode EDIT (ada ?id=...)
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.split('?')[1]);
        this.editId = params.get('id');

        // Jika Edit, ambil data dulu
        if (this.editId) {
            this.currentTransaction = await TransactionRepo.getTransactionById(this.editId);
        } else {
            this.currentTransaction = null;
        }
        
        const content = this.renderFormTemplate();
        
        // Render Layout ke DOM
        container.innerHTML = await MainLayout.render(content);
        
        // Populate Form jika Edit
        if (this.currentTransaction) {
            this.populateForm(this.currentTransaction);
        }

        // Pasang Event Listener (Pass container agar pencarian elemen lebih akurat)
        this.attachFormHandler(container);
        
        Loader.hide();
    },

    populateForm(data) {
        // Helper aman untuk set value
        const setValue = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };

        setValue('amount', data.amount);
        setValue('category', data.category); // Select akan otomatis terpilih
        setValue('note', data.note);
        
        // Radio Button
        if (data.type === 'EXPENSE') {
            const el = document.getElementById('type-expense');
            if (el) el.checked = true;
        } else {
            const el = document.getElementById('type-income');
            if (el) el.checked = true;
        }
    },

    renderFormTemplate() {
        const isEdit = !!this.currentTransaction;
        const title = isEdit ? 'Edit Transaksi' : 'Input Transaksi';
        const btnText = isEdit ? 'Update Transaksi' : 'Simpan Transaksi';

        return `
            <div class="form-page">
                <div class="form-header">
                    <h2>${title}</h2>
                    <p>${isEdit ? 'Perbarui data transaksi ini' : 'Catat keuanganmu hari ini'}</p>
                </div>

                <div class="form-card">
                    <form id="transaction-form">
                        
                        <div class="form-group">
                            <label class="form-label" for="amount">Nominal</label>
                            <div class="amount-wrapper">
                                <span class="amount-prefix">Rp</span>
                                <input type="number" id="amount" class="form-input hero-amount" required min="500" placeholder="0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Jenis Transaksi</label>
                            <div class="type-switch">
                                <div class="type-option expense">
                                    <input type="radio" name="type" id="type-expense" value="EXPENSE" checked>
                                    <label for="type-expense"><span>📉</span> Pengeluaran</label>
                                </div>
                                <div class="type-option income">
                                    <input type="radio" name="type" id="type-income" value="INCOME">
                                    <label for="type-income"><span>📈</span> Pemasukan</label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="category">Kategori</label>
                            <div class="select-wrapper">
                                <select id="category" class="form-select" required>
                                    <option value="" disabled selected>Pilih Kategori...</option>
                                    <option value="Makanan">Makanan</option>
                                    <option value="Transportasi">Transportasi</option>
                                    <option value="Alat Mandi">Alat Mandi</option>
                                    <option value="Listrik dan Kuota">Listrik dan Kuota</option>
                                    <option value="Hiburan">Hiburan</option>
                                    <option value="Gaji dan Kiriman">Gaji dan Kiriman</option>
                                    <option value="Keperluan Kuliah">Keperluan Kuliah</option>
                                    <option value="Lain-lain">Lain-lain</option>
                                </select>
                                
                                <div class="select-arrow">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M6 9l6 6 6-6"/>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="note">Catatan</label>
                            <textarea id="note" class="form-textarea" rows="2" placeholder="Keterangan..."></textarea>
                        </div>

                        <div style="margin-top: 32px; display: flex; flex-direction: column; gap: 12px;">
                            ${Button.render({
                                text: btnText,
                                type: 'submit',
                                variant: 'primary',
                                fullWidth: true,
                                icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`
                            })}
                            
                            ${Button.render({
                                text: 'Batal',
                                type: 'button',
                                variant: 'secondary',
                                fullWidth: true,
                                onClick: "window.location.hash='#dashboard'"
                            })}
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    attachFormHandler(container) {
        // Cari form di dalam container, bukan document global
        // Ini mencegah error 'null' jika elemen belum sepenuhnya ter-index browser
        const form = container.querySelector('#transaction-form');
        
        // Pengecekan Keamanan: Jika form tidak ketemu, berhenti agar tidak crash
        if (!form) {
            console.error("Critical Error: Form element not found in DOM!");
            return;
        }

        const btnSubmit = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ambil data dengan selektor aman (opsional chaining)
            const amountEl = form.querySelector('#amount');
            const typeEl = form.querySelector('input[name="type"]:checked');
            const categoryEl = form.querySelector('#category');
            const noteEl = form.querySelector('#note');

            if (!amountEl || !typeEl || !categoryEl) {
                alert("Mohon lengkapi data form.");
                return;
            }

            const formData = {
                amount: amountEl.value,
                type: typeEl.value,
                category: categoryEl.value,
                note: noteEl.value,
            };

            const originalText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = '<div class="btn-spinner"></div> Menyimpan...';
            btnSubmit.disabled = true;

            try {
                if (this.editId && this.currentTransaction) {
                    const updatedData = {
                        ...this.currentTransaction,
                        ...formData,
                        amount: parseFloat(formData.amount)
                    };
                    await updateTransaction(updatedData);
                } else {
                    await createTransaction(formData);
                }

                form.reset();
                router.navigate('#dashboard');

            } catch (error) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalText;
                alert(`Gagal: ${error.message}`);
            }
        });
    }
};