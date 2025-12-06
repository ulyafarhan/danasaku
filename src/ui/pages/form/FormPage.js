// Controller Input Transaksi

import { createTransaction } from '../../../modules/transaction/use-cases/createTransaction.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { router } from '../../../core/router.js';
import { MainLayout } from '../../layout/MainLayout.js';

// Page Controller: Transaction Form
export const FormPage = {
    async render(container) {
        await loadCSS('/src/ui/pages/form/Form.css');
        
        container.innerHTML = this.renderFormTemplate();
        this.attachFormHandler();
    },

    renderFormTemplate() {
        return `
            <div class="form-page">
                <h2>Catat Transaksi Baru</h2>
                <form id="transaction-form">
                    <div class="field-group">
                        <label for="amount">Nominal (Rp)</label>
                        <input type="number" id="amount" required min="1000">
                    </div>
                    <div class="field-group">
                        <label for="type">Tipe</label>
                        <select id="type" required>
                            <option value="EXPENSE">Pengeluaran</option>
                            <option value="INCOME">Pemasukan</option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label for="category">Kategori</label>
                        <input type="text" id="category" list="category-options" required>
                        <datalist id="category-options">
                            <option value="Makanan"></option>
                            <option value="Transportasi"></option>
                            <option value="Gaji"></option>
                        </datalist>
                    </div>
                    <div class="field-group">
                        <label for="note">Catatan</label>
                        <textarea id="note"></textarea>
                    </div>
                    <button type="submit" class="button-primary">Simpan Transaksi</button>
                    <p id="message-area" style="margin-top: 10px;"></p>
                </form>
            </div>
        `;
    },

    attachFormHandler() {
        const form = document.getElementById('transaction-form');
        const messageArea = document.getElementById('message-area');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                amount: form.querySelector('#amount').value,
                type: form.querySelector('#type').value,
                category: form.querySelector('#category').value,
                note: form.querySelector('#note').value,
            };

            messageArea.textContent = 'Menyimpan...';

            try {
                const success = await createTransaction(formData);
                if (success) {
                    messageArea.textContent = '✅ Transaksi berhasil disimpan secara lokal.';
                    form.reset();
                    // Redirect back to dashboard after a short delay
                    setTimeout(() => router.navigate('#dashboard'), 1500);
                }
            } catch (error) {
                messageArea.textContent = `❌ Gagal: ${error.message}`;
            }
        });
    }
};
const formContent = this.renderFormTemplate();
container.innerHTML = await MainLayout.render(formContent);
this.attachFormHandler(); // Pasang event listener setelah render