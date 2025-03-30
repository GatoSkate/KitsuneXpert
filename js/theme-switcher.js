document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

    // Cambiar tema al hacer clic
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Aplicar nuevo tema
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Mostrar notificación Toastify
        Toastify({
            text: `Modo ${newTheme === 'dark' ? 'oscuro 🌙' : 'claro ☀️'} activado`,
            duration: 1500,
            gravity: "bottom", // Posición: "top", "bottom", "center"
            position: "left",  // "left", "right", "center"
            className: "toastify-custom", // Para estilos adicionales
            style: { 
                background: newTheme === 'dark' ? '#ff00aa' : '#00ff9d',
                color: '#fff',
                borderRadius: '10px',
                boxShadow: '0 0 10px var(--accent)'
            }
        }).showToast();
    });
});