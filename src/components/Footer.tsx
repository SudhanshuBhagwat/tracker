import {
  SparklesIcon,
  UserIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface Props {}

const Footer: React.FC<Props> = () => {
  const router = useRouter();
  return (
    <footer className="h-14 w-full flex border-t z-10 fixed bottom-0 bg-white">
      <nav className="w-full h-full flex items-center px-8">
        <ul className="w-full flex items-center justify-between">
          <li>
            <Link passHref={true} href="/">
              <SparklesIcon
                className={`w-6 h-6 cursor-pointer ${
                  router.pathname === "/" ? "text-primary" : "text-gray-400"
                }`}
              />
            </Link>
          </li>
          <li>
            <Link passHref={true} href="/money">
              <CurrencyRupeeIcon
                className={`w-6 h-6 cursor-pointer ${
                  router.pathname === "/money"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
            </Link>
          </li>
          <li>
            <Link passHref={true} href="/profile">
              <UserIcon
                className={`w-6 h-6 cursor-pointer ${
                  router.pathname === "/profile"
                    ? "text-primary"
                    : "text-gray-400"
                }`}
              />
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
