import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCPmj56qIgsOXQOekPoKaBvYo-FeAIcoCo",
  authDomain: "vive-earn-37dee.firebaseapp.com",
  projectId: "vive-earn-37dee",
  storageBucket: "vive-earn-37dee.firebasestorage.app",
  messagingSenderId: "772657961986",
  appId: "1:772657961986:web:5ebb32db4af106bbf7db1b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
