import { format } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { ITheme } from "../pages/_app";

interface Props {
  theme: ITheme;
  handleThemeChange: () => void;
}

const Header: React.FC<Props> = ({ theme, handleThemeChange }) => {
  const router = useRouter();
  const isMoney = router.pathname.includes("/money") ? true : false;

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b fixed inset-0 z-10 bg-white dark:bg-slate-900 dark:text-white">
      <h2 className="text-2xl font-bold">
        {format(new Date(), "eeee, LLLL do")}
      </h2>
      <nav className="hidden sm:flex">
        <ul className="w-full flex items-center justify-between sm:space-x-8">
          <li>
            <Link
              passHref={true}
              href="/"
              className={`text-lg cursor-pointer ${
                router.pathname === "/"
                  ? "text-primary font-bold"
                  : "text-gray-400"
              }`}
            >
              Goals
            </Link>
          </li>
          <li>
            <Link
              passHref={true}
              href="/money"
              className={`text-lg cursor-pointer ${
                router.pathname === "/money"
                  ? "text-primary font-bold"
                  : "text-gray-400"
              }`}
            >
              Money
            </Link>
          </li>
          <li>
            <Link
              passHref={true}
              href="/profile"
              className={`text-lg cursor-pointer ${
                router.pathname === "/profile"
                  ? "text-primary font-bold"
                  : "text-gray-400"
              }`}
            >
              Account
            </Link>
          </li>
        </ul>
      </nav>
      <div>
        <button onClick={handleThemeChange} className="flex items-center">
          {theme === "light" ? (
            <SunIcon className="w-6 h-6" />
          ) : (
            <MoonIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
