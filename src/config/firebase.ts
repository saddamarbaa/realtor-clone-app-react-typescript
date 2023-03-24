// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import {
  updateProfile,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';
const googleProvider = new GoogleAuthProvider();

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAIN_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApps() : initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();

export {
  auth,
  db,
  GoogleAuthProvider,
  googleProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
};
