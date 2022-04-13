import { format, isThisMonth } from "date-fns";
import { getDocs, query, collection, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import Spinner from "../components/Spinner";
import { auth, firestore, useAuth } from "../config/firebase";

const goalsfetcher = async (url: string, id: string | undefined) => {
  let totalGoalsCompleted = 0;

  try {
    const snapshots = await getDocs(
      query(collection(firestore, "/habits"), where("createdBy", "==", id))
    );

    snapshots.forEach((snapshot) => {
      const data = snapshot.data();
      data.completed.forEach((date: string) => {
        if (isThisMonth(new Date(date))) {
          totalGoalsCompleted += 1;
        }
      });
    });
  } catch (err) {
    throw err;
  }
  return totalGoalsCompleted;
};

const expensesFetcher = async (url: string, id: string | undefined) => {
  let totalExpenses = 0;

  try {
    const snapshots = await getDocs(
      query(collection(firestore, "/expenses"), where("createdBy", "==", id))
    );

    snapshots.forEach((snapshot) => {
      const data = snapshot.data();
      if (isThisMonth(new Date(data.createdAt))) {
        totalExpenses += Number(data.spent);
      }
    });
  } catch (err) {
    throw err;
  }
  return totalExpenses;
};

interface Props {}

const Profile: React.FC<Props> = () => {
  const { currentUser } = useAuth();
  const { data: totalExpenses, error: expenseError } = useSWR(
    currentUser ? "/totalExpenses" : null,
    (url) => expensesFetcher(url, currentUser?.uid),
    {
      suspense: true,
    }
  );
  const { data: completedHabits, error: habitsError } = useSWR(
    currentUser ? "/completedHabits" : null,
    (url) => goalsfetcher(url, currentUser?.uid),
    {
      suspense: true,
    }
  );
  const router = useRouter();

  function handleSignout() {
    router.replace("/auth");
    auth.signOut();
  }

  if (expenseError || habitsError) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="px-4 py-2 bg-red-500 rounded-md font-medium text-white">
          {expenseError || habitsError}
        </span>
      </div>
    );
  }

  if (totalExpenses === undefined || completedHabits === undefined) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full p-4">
      <div className="h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Profile</h2>
          <div className="flex justify-center pb-6">
            <Image
              src={
                currentUser?.photoURL ||
                "data:image/png;base64,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"
              }
              height="100"
              width="100"
              className="rounded-full object-cover"
              alt="Profile Image"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="font-medium">Name</label>
              <span className="text-gray-700">{currentUser?.displayName}</span>
            </div>
            <div className="flex justify-between">
              <label className="font-medium">Email</label>
              <span className="text-gray-700">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between">
              <label className="font-medium">
                Total completed Goals{" "}
                <span className="text-gray-400">
                  ({format(new Date(), "LLLL")})
                </span>
              </label>
              <span className="text-gray-700">{completedHabits}</span>
            </div>
            <div className="flex justify-between">
              <label className="font-medium">
                Total Expenses{" "}
                <span className="text-gray-400">
                  ({format(new Date(), "LLLL")})
                </span>
              </label>
              <span className="text-gray-700">{totalExpenses} ₹</span>
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

export default Profile;
