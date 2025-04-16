// Configura Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAaMCOGXlmpdwcsLS5C0hEpdS7QKnjdc7E",
    authDomain: "kitsunexpert-c7d2e.firebaseapp.com",
    projectId: "kitsunexpert-c7d2e",
    storageBucket: "kitsunexpert-c7d2e.firebasestorage.app",
    messagingSenderId: "130664243809",
    appId: "1:130664243809:web:baa1b68b5eefa790364020",
    measurementId: "G-44RZH6FJ9G"
  };

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Manejo de login/registro
document.getElementById('login-btn').addEventListener('click', function() {
    // Mostrar modal de login/registro
    showAuthModal();
});

function showAuthModal() {
    // Implementar modal con formularios de login y registro
}

// Escuchar cambios de autenticación
auth.onAuthStateChanged(user => {
    const loginBtn = document.getElementById('login-btn');
    if (user) {
        loginBtn.textContent = 'Cerrar Sesión';
        loginBtn.onclick = () => auth.signOut();
    } else {
        loginBtn.textContent = 'Iniciar Sesión';
        loginBtn.onclick = showAuthModal;
    }
});