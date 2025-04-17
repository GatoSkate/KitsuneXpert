document.addEventListener('DOMContentLoaded', function() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar el tema guardado
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Actualizar icono según el tema
    updateThemeIcon(currentTheme);
    
    // Escuchar clic en el botón de cambio de tema
    themeSwitcher.addEventListener('click', function() {
        let theme = document.documentElement.getAttribute('data-theme');
        theme = theme === 'light' ? 'dark' : 'light';
        
        // Cambiar tema
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Actualizar icono
        updateThemeIcon(theme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeSwitcher.querySelector('i');
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});