const authBtn = document.getElementById('auth-btn');

// Simulación de estado de autenticación (esto se conectará a Firebase después)
let loggedIn = false;

authBtn.addEventListener('click', () => {
    if (loggedIn) {
        // Lógica de logout
        loggedIn = false;
        authBtn.innerHTML = '<i class="fas fa-user"></i> <span>Iniciar Sesión</span>';
    } else {
        // Redirigir a página de login (o mostrar modal)
        window.location.href = 'login.html';
    }
});