// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAnjv_GmKrimOdDZ0jxC2PdphPXLXBo7xE",
    authDomain: "grocermate-web.firebaseapp.com",
    projectId: "grocermate-web",
    storageBucket: "grocermate-web.firebasestorage.app",
    messagingSenderId: "334962421378",
    appId: "1:334962421378:web:24f95845d316c8f57b4e9b"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

export { db };