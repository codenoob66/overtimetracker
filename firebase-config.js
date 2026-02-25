import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Your web app's Firebase configuration
// PASTE YOUR FIREBASE CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyBz8Mehf3ycEiqgDuxfdmjAlzpD3fH_aSY",
  authDomain: "ticket-tracker-ac846.firebaseapp.com",
  projectId: "ticket-tracker-ac846",
  storageBucket: "ticket-tracker-ac846.firebasestorage.app",
  messagingSenderId: "118445786378",
  appId: "1:118445786378:web:db8527c2e8b1d0749526f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
