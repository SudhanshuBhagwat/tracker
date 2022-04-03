import Head from "next/head";
import type { AppProps } from "next/app";
import { Suspense } from "react";

import "../../styles/globals.css";
import Spinner from "../components/Spinner";
import Footer from "../components/Footer";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
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
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Header />
      <main className="flex-1 mt-14 pb-14">
        <Suspense fallback={<Spinner />}>
          <Component {...pageProps} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
