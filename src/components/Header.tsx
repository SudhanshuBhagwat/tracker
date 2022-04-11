import { LogoutIcon } from "@heroicons/react/outline";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import { auth, useAuth } from "../config/firebase";

interface Props {}

const Header: React.FC<Props> = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  function handleSignout() {
    auth.signOut();
    router.replace("/auth");
  }

  return (
    <div className="h-14 flex items-center justify-between px-4 bg-gray-50 fixed inset-0 z-10">
      <h2 className="text-2xl font-bold">
        {format(new Date(), "eeee, LLLL do")}
      </h2>
      {currentUser && (
        <button onClick={handleSignout}>
          <LogoutIcon className="w-6 h-6 text-gray-400" />
        </button>
      )}
    </div>
  );
};

export default Header;
