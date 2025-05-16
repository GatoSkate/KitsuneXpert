// Menú Hamburguesa
document.getElementById('menu-btn').addEventListener('click', function() {
    document.getElementById('menu').classList.toggle('active');
    this.classList.toggle('open');
});

// Cerrar menú al hacer clic en un enlace (opcional)
document.querySelectorAll('#menu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('menu').classList.remove('active');
        document.getElementById('menu-btn').classList.remove('open');
    });
});