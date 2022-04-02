import Head from "next/head";
import type { AppProps } from "next/app";
import { format } from "date-fns";

import "../../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col h-screen">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Habit Tracker</title>
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div className="h-14 flex items-center px-4 bg-gray-50">
        <h2 className="text-2xl font-bold">
          {format(new Date(), "eeee, LLLL do")}
        </h2>
      </div>
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <footer className="h-14 flex border-t"></footer>
    </div>
  );
}

export default MyApp;
