// auth.js - Manejo completo de autenticación con Firebase
import { 
    GoogleAuthProvider, 
    signInWithPopup 
  } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js";
// Inicialización de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore-compat.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencias a elementos del DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const resetForm = document.getElementById('reset-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const registerName = document.getElementById('register-name');
const registerEmail = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerConfirm = document.getElementById('register-confirm');
const resetEmail = document.getElementById('reset-email');
const authMessage = document.getElementById('auth-message');
const resetMessage = document.getElementById('reset-message');
const passwordResetModal = document.getElementById('password-reset-modal');
const closeModal = document.querySelector('.close-modal');
const forgotPassword = document.getElementById('forgot-password');
const googleLoginBtn = document.getElementById('google-login');
const githubLoginBtn = document.getElementById('github-login');
const loginTab = document.querySelector('[data-tab="login"]');
const registerTab = document.querySelector('[data-tab="register"]');
const loginFormContainer = document.getElementById('login-form');
const registerFormContainer = document.getElementById('register-form');

// Cambiar entre pestañas de login/register
loginTab.addEventListener('click', () => switchTab('login'));
registerTab.addEventListener('click', () => switchTab('register'));

function switchTab(tab) {
  if (tab === 'login') {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginFormContainer.classList.add('active');
    registerFormContainer.classList.remove('active');
  } else {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerFormContainer.classList.add('active');
    loginFormContainer.classList.remove('active');
  }
  hideAuthMessage();
}

// Mostrar/ocultar contraseña
document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', function() {
    const targetId = this.getAttribute('data-target');
    const passwordInput = document.getElementById(targetId);
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  });
});

// Login con email y contraseña
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value;
  const rememberMe = document.getElementById('remember-me').checked;
  
  const btn = loginForm.querySelector('.auth-btn');
  btn.classList.add('loading');
  
  try {
    // Configurar persistencia de sesión
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    
    // Iniciar sesión
    await signInWithEmailAndPassword(auth, email, password);
    
    // Actualizar última conexión en Firestore
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
    
    // Redirigir al dashboard
    window.location.href = 'index.html';
  } catch (error) {
    showAuthMessage(getAuthErrorMessage(error), 'error');
  } finally {
    btn.classList.remove('loading');
  }
});

// Registro con email y contraseña
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = registerEmail.value.trim();
  const password = registerPassword.value;
  const confirmPassword = registerConfirm.value;
  const name = registerName.value.trim();
  const btn = registerForm.querySelector('.auth-btn');
  
  // Validaciones
  if (!validateEmail(email)) {
    showAuthMessage('Ingresa un email válido', 'error');
    return;
  }
  
  if (password.length < 8) {
    showAuthMessage('La contraseña debe tener al menos 8 caracteres', 'error');
    return;
  }
  
  if (password !== confirmPassword) {
    showAuthMessage('Las contraseñas no coinciden', 'error');
    return;
  }
  
  btn.classList.add('loading');
  
  try {
    // Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      name: name,
      email: email,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      role: 'customer',
      emailVerified: false,
      profileComplete: false
    });
    
    // Enviar email de verificación
    await sendEmailVerification(userCredential.user);
    
    showAuthMessage('Registro exitoso. Por favor verifica tu email.', 'success');
    setTimeout(() => window.location.href = 'profile.html', 3000);
    
  } catch (error) {
    showAuthMessage(getAuthErrorMessage(error), 'error');
  } finally {
    btn.classList.remove('loading');
  }
});

// Login con Google
googleLoginBtn.addEventListener('click', () => socialLogin(new GoogleAuthProvider()));

// Login con GitHub
githubLoginBtn.addEventListener('click', () => socialLogin(new GithubAuthProvider()));

async function socialLogin(provider) {
  try {
    const result = await signInWithPopup(auth, provider);
    
    // Si es un usuario nuevo, crear registro en Firestore
    if (result.additionalUserInfo?.isNewUser) {
      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName || 'Usuario',
        email: result.user.email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        role: 'customer',
        emailVerified: result.user.emailVerified,
        profileComplete: false,
        photoURL: result.user.photoURL
      });
    }
    
    window.location.href = 'index.html';
  } catch (error) {
    showAuthMessage(getAuthErrorMessage(error), 'error');
  }
}

// Recuperación de contraseña
forgotPassword.addEventListener('click', (e) => {
  e.preventDefault();
  passwordResetModal.classList.remove('hidden');
  passwordResetModal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  passwordResetModal.classList.add('hidden');
  passwordResetModal.classList.remove('active');
  resetMessage.classList.add('hidden');
});

resetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = resetEmail.value.trim();
  
  try {
    await sendPasswordResetEmail(auth, email);
    resetMessage.textContent = 'Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.';
    resetMessage.classList.remove('hidden', 'error');
    resetMessage.classList.add('success');
  } catch (error) {
    resetMessage.textContent = getAuthErrorMessage(error);
    resetMessage.classList.remove('hidden', 'success');
    resetMessage.classList.add('error');
  }
});

// Funciones auxiliares
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function getAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Email inválido';
    case 'auth/user-disabled':
      return 'Cuenta deshabilitada';
    case 'auth/user-not-found':
      return 'Usuario no encontrado';
    case 'auth/wrong-password':
      return 'Contraseña incorrecta';
    case 'auth/email-already-in-use':
      return 'El email ya está registrado';
    case 'auth/weak-password':
      return 'La contraseña es muy débil';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Intenta más tarde';
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta con este email';
    default:
      return 'Error en la autenticación: ' + error.message;
  }
}

function showAuthMessage(message, type) {
  authMessage.textContent = message;
  authMessage.classList.remove('hidden', 'success', 'error');
  authMessage.classList.add(type);
  setTimeout(hideAuthMessage, 5000);
}

function hideAuthMessage() {
  authMessage.classList.add('hidden');
}

async function sendEmailVerification(user) {
  try {
    await sendEmailVerification(user);
    console.log('Email de verificación enviado');
  } catch (error) {
    console.error('Error al enviar email de verificación:', error);
  }
}

// Verificar estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user && (window.location.pathname.includes('sesion.html') || 
               window.location.pathname.includes('register.html'))) {
    window.location.href = 'index.html';
  }
});