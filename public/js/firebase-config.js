// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-sgrKP86aCbUM1NtPPHETY4cSHZCjqSM",
  authDomain: "kitsunexpertdc.firebaseapp.com",
  projectId: "kitsunexpertdc",
  storageBucket: "kitsunexpertdc.firebasestorage.app",
  messagingSenderId: "512643268555",
  appId: "1:512643268555:web:b20392d6369886814b404e",
  measurementId: "G-JWG4DMVB9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);