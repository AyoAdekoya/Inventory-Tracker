// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC03ZLRjnZSu_MJ9rLiESWI1JB0guflJ0Y",
  authDomain: "storage-management-dfa4b.firebaseapp.com",
  projectId: "storage-management-dfa4b",
  storageBucket: "storage-management-dfa4b.appspot.com",
  messagingSenderId: "556851157303",
  appId: "1:556851157303:web:ccedd077fb6cc3e4d1a2b2",
  measurementId: "G-14NYEC983T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore};