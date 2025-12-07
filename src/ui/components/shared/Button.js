export const Button = {
    render({ 
        text, 
        type = 'button', 
        variant = 'primary', 
        fullWidth = false, 
        onClick = '', 
        icon = null,      // Bisa isi string SVG atau emoji
        isLoading = false // Status loading
    }) {
        const widthClass = fullWidth ? 'w-full' : '';
        const loadingClass = isLoading ? 'is-loading' : '';
        const disabledAttr = isLoading ? 'disabled' : '';
        
        // Render Icon jika ada
        const iconHtml = icon && !isLoading 
            ? `<span class="btn-icon">${icon}</span>` 
            : '';

        // Konten tombol (Spinner saat loading, atau Icon + Text)
        const content = isLoading 
            ? `<div class="btn-spinner"></div> <span>Memproses...</span>`
            : `${iconHtml}<span>${text}</span>`;

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