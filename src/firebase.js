import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDsKOV1UdZlNCSRr5w8S8fwPu8HGJ_Id-g",
  authDomain: "shaper-8f7e3.firebaseapp.com",
  projectId: "shaper-8f7e3",
  storageBucket: "shaper-8f7e3.firebasestorage.app",
  messagingSenderId: "830622307168",
  appId: "1:830622307168:web:1f26fb06ce8116985c8405",
  measurementId: "G-X6EWRVY2Y2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);
