// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDF5WhxmEx0CApkmnFYlz4JGk3tfDsY0CQ",
  authDomain: "clubsync-72327.firebaseapp.com",
  projectId: "clubsync-72327",
  storageBucket: "clubsync-72327.firebasestorage.app",
  messagingSenderId: "852344065809",
  appId: "1:852344065809:web:743f706a2baa288fc9c6b0",
  measurementId: "G-56QXRRJQ84"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
