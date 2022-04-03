import Head from "next/head";
import type { AppProps } from "next/app";
import { format } from "date-fns";
import { Suspense } from "react";

import "../../styles/globals.css";
import Spinner from "../components/Spinner";
import Link from "next/link";
import { CashIcon, CogIcon, SparklesIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

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
      <div className="h-14 flex items-center px-4 bg-gray-50 fixed inset-0 z-10">
        <h2 className="text-2xl font-bold">
          {format(new Date(), "eeee, LLLL do")}
        </h2>
      </div>
      <Suspense fallback={<Spinner />}>
        <main className="flex-1 mt-14 pb-14">
          <Component {...pageProps} />
        </main>
      </Suspense>
      <footer className="h-14 w-full flex border-t z-10 fixed bottom-0 bg-white">
        <nav className="w-full h-full flex items-center px-8">
          <ul className="w-full flex items-center justify-between">
            <li>
              <Link passHref={true} href="/">
                <SparklesIcon
                  className={`w-6 h-6 cursor-pointer ${
                    router.pathname === "/" ? "text-blue-400" : "text-gray-400"
                  }`}
                />
              </Link>
            </li>
            <li>
              <Link passHref={true} href="/money">
                <CashIcon
                  className={`w-6 h-6 cursor-pointer ${
                    router.pathname === "/money"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                />
              </Link>
            </li>
            <li>
              <Link passHref={true} href="/settings">
                <CogIcon
                  className={`w-6 h-6 cursor-pointer ${
                    router.pathname === "/settings"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                />
              </Link>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}

export default MyApp;
