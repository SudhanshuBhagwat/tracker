import { initializeApp } from "firebase/app";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "firebase/firestore";

import { getAuth, connectAuthEmulator, Auth, User } from "firebase/auth";
import { useEffect, useState } from "react";

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
  connectFirestoreEmulator(firestore, "192.168.1.106", 9091);
  auth = getAuth();
  connectAuthEmulator(auth, "http://192.168.1.106:9090", {
    disableWarnings: true,
  });
} else {
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
}

function useAuth() {
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
      setIsLoading(false);
    });
  }, []);

  return {
    currentUser: user,
    fetchingUser: isLoading,
  };
}

export { firestore, auth, useAuth };
export default firebaseApp;
