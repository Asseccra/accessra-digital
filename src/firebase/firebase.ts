import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC5HVVNvGrkgpFVqk27Fe3_uh5Jy7kYz7s",
  authDomain: "accessra-bfe6c.firebaseapp.com",
  projectId: "accessra-bfe6c",
  storageBucket: "accessra-bfe6c.firebasestorage.app",
  messagingSenderId: "918645087862",
  appId: "1:918645087862:web:17ba9a9a6fd802bccc0957",
  measurementId: "G-B3EL6HLSFP",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;