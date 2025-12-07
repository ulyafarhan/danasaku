// Komponen Button
export const Button = {
    /**
     * Render komponen Button
     * @param {Object} params - Parameter untuk render button
     * @param {string} params.text - Teks di dalam button
     * @param {string} [params.type='button'] - Tipe button (button, submit, reset)
     * @param {string} [params.variant='primary'] - Variasi button (primary, secondary, danger)
     * @param {boolean} [params.fullWidth=false] - Apakah button full width
     * @param {string} [params.onClick=''] - Event onclick handler
     * @param {string|null} [params.icon=null] - Icon di dalam button (string SVG atau emoji)
     * @param {boolean} [params.isLoading=false] - Status loading
     * @returns {string} - HTML string dari komponen Button
     */

    // Fungsi untuk render komponen Button
    render({ 
        text, // Teks di dalam button
        type = 'button', // Tipe button (button, submit, reset)
        variant = 'primary', // Variasi button (primary, secondary, danger)
        fullWidth = false, // Apakah button full width
        onClick = '', // Event onclick handler
        icon = null,      // Icon di dalam button
        isLoading = false // Status loading
    }) {
        // Klasifikasi kelas berdasarkan tipe dan variasi
        const widthClass = fullWidth ? 'w-full' : ''; // Klasifikasi kelas full width
        const loadingClass = isLoading ? 'is-loading' : ''; // Klasifikasi kelas loading
        const disabledAttr = isLoading ? 'disabled' : ''; // Klasifikasi atribut disabled
        
        // Render Icon jika ada
        const iconHtml = icon && !isLoading 
            ? `<span class="btn-icon">${icon}</span>` // Klasifikasi icon tombol
            : '';

        // Konten tombol (Spinner saat loading, atau Icon + Text)
        const content = isLoading 
            ? `<div class="btn-spinner"></div> <span>Memproses...</span>`
            : `${iconHtml}<span>${text}</span>`; // Klasifikasi konten tombol

        // Render tombol dengan klasifikasi kelas dan atribut
        return `
            <button 
                type="${type}" 
                class="btn btn-${variant} ${widthClass} ${loadingClass}"
                ${onClick ? `onclick="${onClick}"` : ''}
                ${disabledAttr}
            >
                ${content}
            </button>
        `;
    }
};