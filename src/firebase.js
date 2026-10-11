import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "x",
  authDomain: "x",
  projectId: "x",
  storageBucket: "x",
  messagingSenderId: "x",
  appId: "x",
  measurementId: "x"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
