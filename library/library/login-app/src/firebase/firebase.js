// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANJgZs0_GUpaCq0_MHQH-2JOlI5BOJqUM",
  authDomain: "library-49e89.firebaseapp.com",
  projectId: "library-49e89",
  storageBucket: "library-49e89.appspot.com",
  messagingSenderId: "960454078285",
  appId: "1:960454078285:web:5e16f28b2e8f0fb9d19104",
  measurementId: "G-QC1K2XXP0T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export the auth and db instances for use in other parts of the app
export { auth, db };

