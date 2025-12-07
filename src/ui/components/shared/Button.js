export const Button = {
    render({ text, type = 'button', variant = 'primary', fullWidth = false, onClick = '' }) {
        const widthClass = fullWidth ? 'w-full' : '';
        return `
            <button 
                type="${type}" 
                class="btn btn-${variant} ${widthClass}"
                ${onClick ? `onclick="${onClick}"` : ''}
            >
                ${text}
            </button>
        `;
    }
};