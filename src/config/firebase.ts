import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";

import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

let auth: Auth;
let firestore: Firestore;
if (process.env.NODE_ENV === "development") {
  firestore = getFirestore();
  connectFirestoreEmulator(firestore, "localhost", 9091);
  auth = getAuth();
  connectAuthEmulator(auth, "http://localhost:9090");
} else {
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
}

export { firestore, auth };
export default firebaseApp;
