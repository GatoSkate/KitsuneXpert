// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAaMCOGXlmpdwcsLS5C0hEpdS7QKnjdc7E",
  authDomain: "kitsunexpert-c7d2e.firebaseapp.com",
  projectId: "kitsunexpert-c7d2e",
  storageBucket: "kitsunexpert-c7d2e.firebasestorage.app",
  messagingSenderId: "130664243809",
  appId: "1:130664243809:web:baa1b68b5eefa790364020",
  measurementId: "G-44RZH6FJ9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
