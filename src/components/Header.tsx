import { ChartBarSquareIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import {
  SparklesIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {}

const Header: React.FC<Props> = () => {
  const router = useRouter();
  const isMoney = router.pathname.includes("/money") ? true : false;

  return (
    <div className="h-14 flex items-center justify-between px-4 border-b fixed inset-0 z-10">
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
      {/* {isMoney && (
        <button className="w-7 h-7 text-gray-900">
          <ChartBarSquareIcon />
        </button>
      )} */}
    </div>
  );
};

export default Header;
