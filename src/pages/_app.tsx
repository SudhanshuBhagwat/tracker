import Head from "next/head";
import type { AppProps } from "next/app";

import "../../styles/globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../config/firebase";
import { useEffect, useState } from "react";
import { isInstallPromptAvailable } from "../utils";

export type ITheme = "light" | "dark";

function MyApp({ Component, pageProps }: AppProps) {
  const { currentUser, fetchingUser } = useAuth();
  const [theme, setTheme] = useState<ITheme>("light");

  useEffect(() => {
    const currentTheme = window.localStorage.getItem("theme");
    if (currentTheme) {
      setTheme(currentTheme as ITheme);
    } else {
      window.localStorage.setItem("theme", theme);
    }
    document.body.className = theme;
  }, [theme]);

  function handleThemeChange() {
    if (theme === "light") {
      setTheme("dark");
      window.localStorage.setItem("theme", "dark");
      document.body.className = "dark";
    } else {
      setTheme("light");
      window.localStorage.setItem("theme", "light");
      document.body.className = "light";
    }
  }

  return (
    <div className={`flex flex-col h-screen select-none overflow-hidden`}>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Habit Tracker</title>
        <meta name="theme-color" content="#F9FAFB" />
        <link rel="icon" type="image/x-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      {!fetchingUser && currentUser ? (
        <>
          <Header theme={theme} handleThemeChange={handleThemeChange} />
          <main className={`flex-1 mt-14 sm:mb-0 min-h-0 overflow-y-auto dark:bg-slate-900 dark:text-white ${isInstallPromptAvailable() ? "mb-16" : "mb-14"}`}>
            <Component {...pageProps} />
          </main>
          <Footer />
        </>
      ) : !fetchingUser && !currentUser ? (
        <main className="flex-1 mt-14 pb-14">
          <Component {...pageProps} />
        </main>
      ) : null}
    </div>
  );
}

export default MyApp;
