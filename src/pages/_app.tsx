import Head from "next/head";
import type { AppProps } from "next/app";

import "../../styles/globals.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../config/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  const { currentUser, fetchingUser } = useAuth();

  return (
    <div className="flex flex-col h-screen select-none">
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
          <Header />
          <main className="flex-1 mt-14 pb-14 sm:pb-0">
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
