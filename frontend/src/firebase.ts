import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: "AIzaSyCM_O1Hn1ZMkpWRuYqkvjvIa0p9FWk5aOI",
  authDomain: "earlystart-tutor.firebaseapp.com",
  projectId: "earlystart-tutor",
  storageBucket: "earlystart-tutor.appspot.com",
  messagingSenderId: "259200542567",
  appId: "1:259200542567:web:93fd07562faa0c90a071c2",
  measurementId: "G-WJFMVD0M8H"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };