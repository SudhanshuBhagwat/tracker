import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import { auth } from "../config/firebase";

const Auth = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUser() {
      const result = await getRedirectResult(auth);
      if (result) {
        router.push("/");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
    getUser();
  }, [router]);

  async function doAuth() {
    try {
      setIsLoading(true);
      await signInWithRedirect(auth, new GoogleAuthProvider());
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex justify-center items-center">
      {isLoading ? (
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
