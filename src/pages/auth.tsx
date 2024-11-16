import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { auth, useAuth } from "../config/firebase";

const Auth = () => {
  const router = useRouter();
  const { currentUser, fetchingUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!fetchingUser && currentUser) {
      router.replace("/");
    } else if (!fetchingUser && !currentUser) {
      setIsLoading(false);
    }
  }, [fetchingUser, currentUser, router]);

  useEffect(() => {
    async function getUser() {
      const result = await getRedirectResult(auth);
      if (result) {
        router.replace("/");
      }
    }
    getUser();
  }, [router]);

  async function doAuth() {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, new GoogleAuthProvider());
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      {isLoading || fetchingUser ? (
        <Spinner />
      ) : (
        <button
          onClick={doAuth}
          className="px-4 py-2 bg-gray-200 rounded-lg font-bold"
        >
          Sign In with <span className="text-sky-400">Google</span>
        </button>
      )}
    </div>
  );
};

export default Auth;
