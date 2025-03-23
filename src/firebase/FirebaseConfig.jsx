// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCndAbYCEKhu7rwCoTQmNNqygU38_A-WP4",
  authDomain: "lostandfound-d76ff.firebaseapp.com",
  projectId: "lostandfound-d76ff",
  storageBucket: "lostandfound-d76ff.firebasestorage.app",
  messagingSenderId: "927071587966",
  appId: "1:927071587966:web:4e492fee36f3784efc522f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
export {fireDB,auth } ;