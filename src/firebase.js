
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCVwmRnk3wYv74yCXJwZDOKenLBRglhoRQ",
  authDomain: "react-chat-8cdbb.firebaseapp.com",
  projectId: "react-chat-8cdbb",
  storageBucket: "react-chat-8cdbb.appspot.com",
  messagingSenderId: "348018251283",
  appId: "1:348018251283:web:1ac4ba298e803a6afb11e6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();