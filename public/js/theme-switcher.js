document.getElementById('theme-toggle').addEventListener('click', function() {
    const themeStyle = document.getElementById('theme-style');
    const currentTheme = themeStyle.getAttribute('href');
    
    if (currentTheme.includes('dark-mode.css')) {
        themeStyle.setAttribute('href', '');
        localStorage.setItem('theme', 'light');
    } else {
        themeStyle.setAttribute('href', 'css/dark-mode.css');
        localStorage.setItem('theme', 'dark');
    }
});

// Cargar tema preferido al inicio
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeStyle = document.getElementById('theme-style');
    
    if (savedTheme === 'dark') {
        themeStyle.setAttribute('href', 'css/dark-mode.css');
    }
});