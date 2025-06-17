// Import the functions you need from the SDKs you need
import { initializeApp , getApp , getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDm5kq3venlEsBSbaj3mdX5UlX1B7UXGqk",
  authDomain: "prepwise-e228f.firebaseapp.com",
  projectId: "prepwise-e228f",
  storageBucket: "prepwise-e228f.firebasestorage.app",
  messagingSenderId: "707703932681",
  appId: "1:707703932681:web:4856225c0a54f32d61f5d8",
  measurementId: "G-9GQB29HY2Y"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);