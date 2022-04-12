import { getDocs, query, collection, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { auth, firestore, useAuth } from "../config/firebase";

const goalsfetcher = async (url: string, id: string | undefined) => {
  let totalGoalsCompleted = 0;

  try {
    const snapshots = await getDocs(
      query(collection(firestore, url), where("createdBy", "==", id))
    );

    snapshots.forEach((snapshot) => {
      const data = snapshot.data();
      totalGoalsCompleted += data.completed.length;
    });
  } catch (err) {
    throw err;
  }
  return totalGoalsCompleted;
};

interface Props {}

const Settings: React.FC<Props> = () => {
  const { currentUser } = useAuth();
  const { data: goalsCompleted } = useSWR(
    currentUser ? "/habits" : null,
    (url) => goalsfetcher(url, currentUser?.uid)
  );
  const router = useRouter();

  function handleSignout() {
    router.replace("/auth");
    auth.signOut();
  }

  return (
    <div className="h-full p-4">
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="font-medium">Name</label>
              <span>{currentUser?.displayName}</span>
            </div>
            <div className="flex justify-between">
              <label className="font-medium">Email</label>
              <span>{currentUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <label className="font-medium">Total completed Goals</label>
              <span>{goalsCompleted}</span>
            </div>
            <div className="flex justify-between">
              <label className="font-medium">
                Total Expenses <span className="text-gray-400">(April)</span>
              </label>
              <span>30,000 ₹</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSignout}
          className="w-full px-4 py-2 rounded-md bg-red-500 text-white font-semibold"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Settings;
