import { PlusIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import AddGoal from "../components/AddGoal";
import Goal from "../components/Goal";
import type { Goal as GoalType } from "../types";
import useFirestore from "../hooks/useFirestore";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, useAuth } from "../config/firebase";
import { format, parseISO, startOfToday } from "date-fns";
import useSWR, { mutate as gMutate } from "swr";
import Spinner from "../components/Spinner";
import { useRouter } from "next/router";
import { AnimatePresence } from "framer-motion";
import Calendar from "../components/Calendar";

const GOAL_COLORS = [];

const fetcher = async (
  url: string,
  uid: string | undefined
): Promise<{
  todaysGoals: GoalType[];
  collectionGoals: GoalType[];
}> => {
  const collectionGoals: GoalType[] = [];
  const todaysGoals: GoalType[] = [];

  try {
    const snapshot = await getDocs(
      query(collection(firestore, url), where("createdBy", "==", uid))
    );
    snapshot.forEach((doc) => {
      const data = doc.data();
      const weekday = format(new Date(), "eeee");
      const goal: GoalType = {
        id: doc.id,
        title: data.title,
        everyday: data.everyday,
        months: data.months,
        weekly: data.weekly,
        createdAt: data.createdAt,
        completed: data.completed,
      };
      if (data.everyday) {
        todaysGoals.push(goal);
      } else if (goal.weekly && goal.weekly.includes(weekday)) {
        todaysGoals.push(goal);
      }
      collectionGoals.push(goal);
    });
  } catch (err) {
    throw err;
  }

  return {
    todaysGoals,
    collectionGoals,
  };
};

const Home: NextPage = () => {
  const { currentUser, fetchingUser } = useAuth();
  const router = useRouter();
  const { data, mutate, error } = useSWR(
    currentUser ? "/habits" : null,
    (url: string) => fetcher(url, currentUser?.uid)
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"ADD" | "EDIT" | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>();
  const { addGoal, updateGoal, removeGoal } = useFirestore();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const completedGoals = data?.todaysGoals.reduce((acc: number, goal: GoalType) => {
    if(goal.completed.includes(format(today, "yyyy/MM/dd"))) {
      return acc + 1;
    }
    return acc;
  }, 0);

  useEffect(() => {
    if (!fetchingUser && !currentUser) {
      router.replace("/auth");
    } else {
      mutate();
    }
  }, [currentUser, fetchingUser, mutate, router]);

  async function handleSubmit(data: any) {
    if (mode === "ADD") {
      await addGoal(data);
    } else {
      await updateGoal(data);
    }
    mutate();
  }

  async function handleDone(isDone: boolean, id: string) {
    if (isDone) {
      await updateDoc(doc(firestore, "habits", id), {
        completed: arrayUnion(format(new Date(), "yyyy/MM/dd")),
      });
    } else {
      await updateDoc(doc(firestore, "habits", id), {
        completed: arrayRemove(format(new Date(), "yyyy/MM/dd")),
      });
    }
    mutate();
    gMutate("/completedHabits");
  }

  async function handleRemove(id: string) {
    await removeGoal(id);
    mutate();
    gMutate("/completedHabits");
  }

  if (fetchingUser && !currentUser) {
    return null;
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="px-4 py-2 bg-red-500 rounded-md font-medium text-white">
          {error}
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-1 flex-col sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-7">
      <section className="sm:hidden">
        <Calendar
          mode="weekly"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          todayBackground={completedGoals === data.todaysGoals.length ? "bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500" : "bg-red-500"}
        />
      </section>
      <section className="lg:col-span-5 p-4 sm:col-span-1 md:col-span-1 lg:p-0">
        <div className="w-full space-y-4 lg:space-y-0 lg:mt-0 lg:grid lg:grid-cols-2 lg:h-full">
          <div className="flex flex-col lg:border-r lg:p-4">
            <div className="flex justify-between items-center lg:items-start">
              <h2 className="text-2xl font-semibold">Goals</h2>
              <button
                className="flex items-center bg-blue-200 text-black px-2 py-1 rounded-md"
                onClick={() => {
                  setMode("ADD");
                  setSelectedGoal(null);
                  setIsOpen((open) => !open);
                }}
              >
                <span className="mr-1">
                  <PlusIcon className="h-4 w-4" />
                </span>
                Add Goal
              </button>
            </div>
            <h3 className="text-xl font-semibold mt-2 lg:mt-4">Today</h3>
            {data.todaysGoals.length > 0 ? (
              <div className="mt-2 space-y-2">
                {data.todaysGoals.map((goal) => {
                  return (
                    <Goal
                      key={goal.id}
                      goal={goal}
                      disable={false}
                      handleDone={handleDone}
                      handleClick={() => {
                        setSelectedGoal(goal);
                        setMode("EDIT");
                        setIsOpen((open) => !open);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center space-y-2 py-6">
                <span>You&apos;re good for today</span>
              </div>
            )}
          </div>
          <div className="lg:p-4 lg:h-full">
            <h3 className="text-xl font-semibold">All Goals</h3>
            {data.collectionGoals.length > 0 ? (
              <div className="mt-2 space-y-2">
                {data.collectionGoals.map((goal) => {
                  return (
                    <Goal
                      key={goal.id}
                      goal={goal}
                      handleDone={handleDone}
                      disable
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center space-y-2 mt-20 lg:h-full lg:mt-0">
                <span>No Goals added</span>
                <span className="flex items-center">
                  Press
                  <button className="flex items-center bg-blue-200 dark:text-black px-2 py-1 rounded-md mx-2">
                    <span className="mr-1">
                      <PlusIcon className="h-4 w-4" />
                    </span>
                    Add Goal
                  </button>
                  to add one
                </span>
              </div>
            )}
          </div>
        </div>
        <AnimatePresence>
          {isOpen && (
            <AddGoal
              setIsOpen={setIsOpen}
              handleSubmit={handleSubmit}
              handleRemove={handleRemove}
              mode={mode}
              goal={selectedGoal}
            />
          )}
        </AnimatePresence>
      </section>
      <section className="lg:col-span-2 border-l hidden sm:col-span-1 sm:block">
        <Calendar
          mode="monthly"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </section>
    </div>
  );
};

export default Home;
