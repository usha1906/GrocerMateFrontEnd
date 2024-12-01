// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCRnbMOTi3ZwB2lUisvEpg4OY4MELBIZrk",
    authDomain: "grocermate-web-fe131.firebaseapp.com",
    projectId: "grocermate-web-fe131",
    storageBucket: "grocermate-web-fe131.firebasestorage.app",
    messagingSenderId: "797592273289",
    appId: "1:797592273289:web:d0c76c948c3c4f5b22a158"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

export { db };