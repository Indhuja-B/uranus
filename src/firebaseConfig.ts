// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkFahrSBEy2H7a1yz3WjERFhRs7DGnt6k",
  authDomain: "codehub-826ea.firebaseapp.com",
  projectId: "codehub-826ea",
  storageBucket: "codehub-826ea.appspot.com",
  messagingSenderId: "1094955694330",
  appId: "1:1094955694330:web:fb082af58271dcf1ebb143",
  measurementId: "G-Y37BDTSMJM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
