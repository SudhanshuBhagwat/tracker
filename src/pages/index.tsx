import { PlusIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import AddGoal from "../components/AddGoal";
import Goal from "../components/Goal";
import type { Goal as GoalType } from "../types";
import useFirestore from "../hooks/useFirestore";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { format } from "date-fns";

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [today, setToday] = useState<GoalType[]>([]);
  const { addGoal } = useFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "habits"),
      (snapshot) => {
        const collectionGoals: GoalType[] = [];
        const todaysGoals: GoalType[] = [];
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
        setGoals(collectionGoals);
        setToday(todaysGoals);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  async function handleSubmit(data: any) {
    await addGoal(data);
  }

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Goals</h2>
        <button
          className="flex items-center bg-blue-200 px-2 py-1 rounded-md"
          onClick={() => {
            setIsOpen((open) => !open);
          }}
        >
          <span className="mr-1">
            <PlusIcon className="h-4 w-4" />
          </span>
          Add Goal
        </button>
      </div>
      <div className="w-full h-full mt-4 space-y-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">Today</h3>
          {today.length > 0 ? (
            <div className="mt-2 space-y-2">
              {today.map((goal) => {
                return <Goal key={goal.id} goal={goal} disable={false} />;
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center items-center space-y-2 py-6">
              <span>You&apos;re good for today</span>
            </div>
          )}
        </div>
        <div className="">
          <h3 className="text-xl font-semibold">All Goals</h3>
          {goals.length > 0 ? (
            <div className="mt-2 space-y-2">
              {goals.map((goal) => {
                return <Goal key={goal.id} goal={goal} disable />;
              })}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center space-y-2 mt-20">
              <span>No Goals added</span>
              <span className="flex items-center">
                Press
                <button className="flex items-center bg-blue-200 px-2 py-1 rounded-md mx-2">
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
      <AddGoal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Home;
