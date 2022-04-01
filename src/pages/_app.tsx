import "../../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="flex flex-col h-screen">
      <header>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Tracker</title>
        <meta name="theme-color" content="#319197" />
        <link rel="manifest" href="/site.webmanifest" />
        <div className="h-14 flex items-center px-4 bg-gray-50">
          <h2 className="text-2xl font-semibold">Friday, 1st April</h2>
        </div>
      </header>
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <footer className="h-14 flex border-t"></footer>
    </div>
  );
}

export default MyApp;
