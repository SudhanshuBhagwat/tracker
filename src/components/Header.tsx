import { format } from "date-fns";
import React from "react";

interface Props {}

const Header: React.FC<Props> = () => {
  return (
    <div className="h-14 flex items-center px-4 bg-gray-50 fixed inset-0 z-10">
      <h2 className="text-2xl font-bold">
        {format(new Date(), "eeee, LLLL do")}
      </h2>
    </div>
  );
};

export default Header;
