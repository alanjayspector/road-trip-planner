// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // <-- New import
import { getFirestore } from "firebase/firestore"; // <-- New import
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAyzNwouCNFaSWOl-jSeZneGZ_7LvMRVD4",
  authDomain: "road-trip-planner-23d11.firebaseapp.com",
  projectId: "road-trip-planner-23d11",
  storageBucket: "road-trip-planner-23d11.firebasestorage.app",
  messagingSenderId: "965276388168",
  appId: "1:965276388168:web:f05c8393ecaef74a70c17d",
  measurementId: "G-DRJNZKPBFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the app and auth instances
export { app, auth };
export const auth = getAuth(app); // <-- New export
export const db = getFirestore(app); // <-- New export