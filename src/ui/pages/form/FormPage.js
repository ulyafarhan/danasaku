import { createTransaction } from '../../../modules/transaction/use-cases/createTransaction.js';
import { loadCSS } from '../../../core/cssLoader.js';
import { router } from '../../../core/router.js';
import { MainLayout } from '../../layout/MainLayout.js';

export const FormPage = {
    async render(container) {
        await loadCSS('/src/ui/pages/form/Form.css');
        const content = this.renderFormTemplate();
        // Render Layout dulu, baru isinya
        container.innerHTML = await MainLayout.render(content);
        this.attachFormHandler();
    },

    renderFormTemplate() {
        return `
            <div class="form-page">
                <h2>Input Transaksi</h2>
                <form id="transaction-form">
                    <div class="field-group amount-group">
                        <label for="amount">Nominal (Rp)</label>
                        <input type="number" id="amount" required min="1000" placeholder="0">
                    </div>

                    <div class="field-group">
                        <label for="type">Jenis</label>
                        <select id="type" required>
                            <option value="EXPENSE">Pengeluaran 💸</option>
                            <option value="INCOME">Pemasukan 💰</option>
                        </select>
                    </div>

                    <div class="field-group">
                        <label for="category">Kategori</label>
                        <input type="text" id="category" list="category-options" required placeholder="Contoh: Makan, Gaji...">
                        <datalist id="category-options">
                            <option value="Makan & Minum"></option>
                            <option value="Transportasi"></option>
                            <option value="Belanja"></option>
                            <option value="Tagihan"></option>
                            <option value="Gaji"></option>
                        </datalist>
                    </div>

                    <div class="field-group">
                        <label for="note">Catatan</label>
                        <textarea id="note" rows="2" placeholder="Keterangan tambahan..."></textarea>
                    </div>

                    <button type="submit" class="button-primary">Simpan Transaksi</button>
                    <p id="message-area" class="text-center text-muted" style="margin-top: 15px;"></p>
                </form>
            </div>
        `;
    },

    attachFormHandler() {
        const form = document.getElementById('transaction-form');
        const messageArea = document.getElementById('message-area');
        const btn = form.querySelector('button');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Ambil data
            const formData = {
                amount: form.querySelector('#amount').value,
                type: form.querySelector('#type').value,
                category: form.querySelector('#category').value,
                note: form.querySelector('#note').value,
            };

            // UI Feedback: Disable tombol biar gak double click
            btn.disabled = true;
            btn.innerText = 'Menyimpan...';
            messageArea.textContent = '';

            try {
                // Proses simpan
                await createTransaction(formData);
                
                // Sukses
                btn.innerText = 'Berhasil! ✅';
                messageArea.textContent = 'Data tersimpan.';
                form.reset();
                
                // Redirect cepat (0.5 detik)
                setTimeout(() => {
                    router.navigate('#dashboard');
                }, 500);

            } catch (error) {
                // Gagal
                btn.disabled = false;
                btn.innerText = 'Simpan Transaksi';
                messageArea.textContent = `Gagal: ${error.message}`;
                messageArea.style.color = 'var(--color-danger)';
            }
        });
    }
};