import "../../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";
import { format } from "date-fns";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className="flex flex-col h-screen"
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Tracker</title>
        <meta name="theme-color" content="rgb(249 250 251)" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <div className="h-14 flex items-center px-4 bg-gray-50">
        <h2 className="text-2xl font-semibold">
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
