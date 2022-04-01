import "../styles/globals.css";
import Head from "next/head";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>Next.js PWA Example</title>
        <meta name="theme-color" content="#319197" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className="h-screen w-screen">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
