import { createTransaction } from '../../../modules/transaction/use-cases/createTransaction.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { router } from '../../../core/router.js';
import { MainLayout } from '../../layout/MainLayout.js';
import Loader from '../../components/shared/Loader.js';
import { Button } from '../../components/shared/Button.js';

export const FormPage = {
    async render(container) {
        Loader.show();
        await loadCSS('/src/ui/pages/form/Form.css');
        
        const content = this.renderFormTemplate();
        container.innerHTML = await MainLayout.render(content);
        
        this.attachFormHandler();
        Loader.hide();
    },

    renderFormTemplate() {
        return `
            <div class="form-page">
                <div class="form-header">
                    <h2>Input Transaksi</h2>
                    <p>Catat pemasukan atau pengeluaranmu</p>
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
                                    <label for="type-expense">
                                        <span>📉</span> Pengeluaran
                                    </label>
                                </div>
                                <div class="type-option income">
                                    <input type="radio" name="type" id="type-income" value="INCOME">
                                    <label for="type-income">
                                        <span>📈</span> Pemasukan
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="category">Kategori</label>
                            <input type="text" id="category" class="form-input" list="category-options" required placeholder="Contoh: Makan, Bensin, Gaji...">
                            <datalist id="category-options">
                                <option value="Makan & Minum">
                                <option value="Transportasi">
                                <option value="Belanja">
                                <option value="Tagihan & Utilitas">
                                <option value="Hiburan">
                                <option value="Kesehatan">
                                <option value="Gaji">
                                <option value="Investasi">
                            </datalist>
                        </div>

                        <div class="form-group">
                            <label class="form-label" for="note">Catatan (Opsional)</label>
                            <textarea id="note" class="form-textarea" rows="3" placeholder="Tulis detail tambahan..."></textarea>
                        </div>

                        <div style="margin-top: 32px;">
                            ${Button.render({
                                text: 'Simpan Transaksi',
                                type: 'submit',
                                variant: 'primary',
                                fullWidth: true,
                                icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`
                            })}
                            
                            <button type="button" id="btn-cancel" class="btn btn-link w-full" style="margin-top: 12px;">
                                Batal & Kembali
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    },

    attachFormHandler() {
        const form = document.getElementById('transaction-form');
        const btnCancel = document.getElementById('btn-cancel');
        const btnSubmit = form.querySelector('button[type="submit"]');

        btnCancel.addEventListener('click', () => router.navigate('#dashboard'));

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ambil data
            const typeSelected = form.querySelector('input[name="type"]:checked').value;
            const formData = {
                amount: form.querySelector('#amount').value,
                type: typeSelected,
                category: form.querySelector('#category').value,
                note: form.querySelector('#note').value,
            };

            // Loading State (Manual krn kita pakai Button.render string)
            btnSubmit.innerHTML = '<div class="btn-spinner"></div> Menyimpan...';
            btnSubmit.disabled = true;

            try {
                await createTransaction(formData);
                
                // Feedback
                form.reset();
                Loader.hide(); // Jaga-jaga
                
                // Redirect
                router.navigate('#dashboard');

            } catch (error) {
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = 'Simpan Transaksi';
                alert(`Gagal menyimpan: ${error.message}`);
            }
        });
    }
};