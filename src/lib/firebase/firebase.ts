// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app"; // Added FirebaseApp type for clarity
import { getAnalytics, type Analytics } from "firebase/analytics"; // Added Analytics type
import { getAuth, type Auth } from "firebase/auth"; // <--- 1. IMPORT getAuth and Auth type

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtAga9ikcejHL05jYRK3cbjf9h_eMd3Tg",
  authDomain: "e-com-app1.firebaseapp.com",
  projectId: "e-com-app1",
  storageBucket: "e-com-app1.firebasestorage.app",
  messagingSenderId: "483813879318",
  appId: "1:483813879318:web:5cfe3541c171e12153cf37",
  measurementId: "G-0C828M82HS"
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig); // Explicitly typed app
export const analytics: Analytics = getAnalytics(app); // Explicitly typed analytics

// --- 2. INITIALIZE AND EXPORT AUTH ---
export const auth: Auth = getAuth(app); // Explicitly typed auth