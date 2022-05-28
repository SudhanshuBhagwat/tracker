import { ChartSquareBarIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React from "react";

interface Props {}

const Header: React.FC<Props> = () => {
  const router = useRouter();
  const isMoney = router.pathname.includes("/money") ? true : false;

  return (
    <div className="h-14 flex items-center justify-between px-4 bg-gray-50 fixed inset-0 z-10">
      <h2 className="text-2xl font-bold">
        {format(new Date(), "eeee, LLLL do")}
      </h2>
      {isMoney && (
        <button className="w-7 h-7 text-gray-900">
          <ChartSquareBarIcon />
        </button>
      )}
    </div>
  );
};

export default Header;
