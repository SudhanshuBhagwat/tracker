import { User } from "@firebase/auth";
import { format, isThisMonth } from "date-fns";
import { getDocs, query, collection, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
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

const NAVS = [
  {
    title: 'Profile',
    url: '/profile',
    slug: null
  },
  {
    title: 'Settings',
    url: '/profile?page=settings',
    slug: 'settings'
  },
]

interface Props { }

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
  const { page } = router.query;

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

  function getComp(param: string) {
    switch (param) {
      case "settings":
        return <SettingsComp />
      default:
        return <ProfileComp currentUser={currentUser} completedHabits={completedHabits} totalExpenses={totalExpenses} handleSignout={handleSignout} />
    }
  }


  return (
    <div className="h-full flex">
      <div className="h-full md:w-60 border-r flex-col p-2 space-y-2 hidden md:flex">
        {
          NAVS.map(nav => {
            return <Link key={nav.title} href={nav.url} className={`${nav.slug === (new URLSearchParams(window.location.search).get('page')) ? 'bg-slate-200 font-bold' : ''} w-full px-6 py-2 rounded-sm`}>
              {nav.title}
            </Link>
          })
        }
      </div>
      <div className="p-4 h-full w-full flex-1">
        {getComp(page as string)}
      </div>
    </div>
  );
};

interface SettingsCompProps { }

const SettingsComp: React.FC<SettingsCompProps> = () => {
  return <div className="h-full flex flex-col justify-between">
    <h2 className="text-2xl font-semibold mb-4">Settings</h2>
  </div>
}

interface ProfileCompProps {
  currentUser: User | null | undefined;
  completedHabits: number | undefined;
  totalExpenses: number | undefined;
  handleSignout: () => void;
}

const ProfileComp: React.FC<ProfileCompProps> = ({ currentUser, completedHabits, totalExpenses, handleSignout }) => {
  console.log(currentUser)
  return <div className="md:grid md:grid-cols-2 h-full w-full">
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
}

export default Profile;
