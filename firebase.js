// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBsgAa-kaK0yhoF8a1Nh9SvlRgTRtpMAN0",
  authDomain: "fir-auth-player12.firebaseapp.com",
  projectId: "fir-auth-player12",
  storageBucket: "fir-auth-player12.firebasestorage.app",
  messagingSenderId: "377615650370",
  appId: "1:377615650370:web:53e05f254cfbcfde1e67db",
  measurementId: "G-1T0MQ4K5LE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);