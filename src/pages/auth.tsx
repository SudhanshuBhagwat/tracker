import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
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
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        navigator.serviceWorker.ready.then(function (registration) {
          registration.showNotification("Vibration Sample", {
            body: "Buzz! Buzz!",
            icon: "../images/touch/chrome-touch-icon-192x192.png",
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: "vibration-sample",
          });
        });
      }
    });
  }, []);

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
        router.push("/");
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

  function randomNotification() {
    const options = {
      body: "Test",
    };
    new Notification("Test TItle", options);
    setTimeout(randomNotification, 5000);
  }

  return (
    <div className="h-full flex justify-center items-center">
      {isLoading || fetchingUser ? (
        <Spinner />
      ) : (
        <div className="flex flex-col space-y-2">
          <button
            onClick={doAuth}
            className="px-4 py-2 bg-gray-200 rounded-lg font-bold"
          >
            Sign In with <span className="text-sky-400">Google</span>
          </button>
          <button
            onClick={randomNotification}
            className="px-4 py-2 bg-gray-200 rounded-lg font-bold"
          >
            Trigger Notificaiton
          </button>
        </div>
      )}
    </div>
  );
};

export default Auth;
