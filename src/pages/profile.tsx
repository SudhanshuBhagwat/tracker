import { format, isThisMonth } from "date-fns";
import { getDocs, query, collection, where } from "firebase/firestore";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
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
    console.error(err);
    return totalGoalsCompleted;
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
    console.error(err);
    return totalExpenses;
  }
  return totalExpenses;
};

interface Props {}

const Profile: React.FC<Props> = () => {
  const { currentUser, fetchingUser } = useAuth();
  const { data: totalExpenses, error: expenseError } = useSWR(
    currentUser ? "/totalExpenses" : null,
    (url) => expensesFetcher(url, currentUser?.uid)
  );
  const { data: completedHabits, error: habitsError } = useSWR(
    currentUser ? "/completedHabits" : null,
    (url) => goalsfetcher(url, currentUser?.uid)
  );
  const router = useRouter();

  useEffect(() => {
    if (!fetchingUser && !currentUser) {
      router.replace("/auth");
    }
  }, [currentUser, fetchingUser, router]);

  function handleSignout() {
    router.replace("/auth");
    auth.signOut();
  }

  if (expenseError || habitsError) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="px-4 py-2 bg-red-500 rounded-md font-medium text-white">
          An unexpected error occurred
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
            {currentUser?.photoURL ? (
              <Image
                src={currentUser?.photoURL}
                alt={"Profile Photo"}
                height={96}
                width={96}
                className="rounded-full"
              />
            ) : (
              <Image
                src={`https://avatars.dicebear.com/api/initials/${currentUser?.displayName}.svg`}
                alt={"Profile Photo"}
                height={96}
                width={96}
                className="rounded-full"
              />
            )}
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
              <span className="text-gray-700">{totalExpenses} ???</span>
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
