import { APP_CONFIG } from '../../../config/appConfig.js';

export const LoginPage = {
    render(onLoginSuccess) {
        // Render Tampilan Lock Screen (Inline CSS agar mandiri)
        document.body.innerHTML = `
            <div style="
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                height: 100vh; background: #f8fafc; font-family: 'Outfit', sans-serif;
                padding: 20px; text-align: center;
            ">
                <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); max-width: 400px; width: 100%;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
                    <h2 style="color: #3b82f6; margin-bottom: 10px; font-weight: 700;">DanaSaku</h2>
                    <p style="color: #64748b; margin-bottom: 24px;">Masukkan Kode Akses Keluarga</p>
                    
                    <input type="password" id="pin-input" placeholder="123456" maxlength="6" style="
                        width: 100%; padding: 14px; border: 2px solid #e2e8f0; border-radius: 12px;
                        font-size: 1.5rem; text-align: center; margin-bottom: 20px; outline: none; letter-spacing: 4px;
                        transition: border-color 0.2s;
                    ">
                    
                    <button id="pin-submit" style="
                        width: 100%; padding: 14px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white;
                        border: none; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer;
                        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); transition: transform 0.2s;
                    ">BUKA APLIKASI</button>
                    
                    <p id="error-msg" style="color: #ef4444; margin-top: 15px; font-size: 0.9rem; display: none; background: #fef2f2; padding: 8px; border-radius: 8px;">
                        ⚠️ Kode Salah! Coba lagi.
                    </p>
                </div>
            </div>
        `;

        // Logika Event Listener
        const input = document.getElementById('pin-input');
        const btn = document.getElementById('pin-submit');
        const err = document.getElementById('error-msg');

        // Fungsi Cek PIN
        const checkPin = () => {
            if (input.value === APP_CONFIG.APP_SECRET) {
                // Jika Benar: Simpan sesi & Panggil callback sukses
                localStorage.setItem('danasaku_pin', input.value);
                
                // Animasi keluar dikit biar halus (opsional)
                btn.innerHTML = 'Memuat...';
                btn.style.opacity = '0.7';
                
                setTimeout(() => {
                    onLoginSuccess(); // <--- JALANKAN INIT APP
                }, 300);
            } else {
                // Jika Salah
                err.style.display = 'block';
                input.style.borderColor = '#ef4444';
                input.value = '';
                input.focus();
                
                // Getar dikit (animasi CSS via JS)
                input.animate([
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0)' }
                ], { duration: 300 });
            }
        };

        // Event Klik & Enter
        btn.onclick = checkPin;
        input.onfocus = () => {
            input.style.borderColor = '#3b82f6';
            err.style.display = 'none';
        };
        input.onkeypress = (e) => { 
            if (e.key === 'Enter') checkPin(); 
        };
        
        // Auto focus saat halaman tampil
        input.focus();
    }
};