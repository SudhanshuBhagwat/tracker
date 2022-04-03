import { PlusIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import AddGoal from "../components/AddGoal";
import Goal from "../components/Goal";
import type { Goal as GoalType } from "../types";
import useFirestore from "../hooks/useFirestore";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../config/firebase";

const GOALS: GoalType[] = [
  // { title: "Code for 1 hour", span: "Everyday", isDone: true },
  // { title: "Read for 30 mins", span: "Everyday", isDone: false },
  // { title: "Watch 10 episodes of One Piece", span: "Everyday", isDone: true },
  // { title: "Eat Barfacha Gola", span: "1/2 completed this week", isDone: true },
  // { title: "Code for 1 hour", span: "Everyday", isDone: true },
  // { title: "Read for 30 mins", span: "Everyday", isDone: false },
  // { title: "Code for 1 hour", span: "Everyday", isDone: true },
  // { title: "Read for 30 mins", span: "Everyday", isDone: false },
];

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const { addGoal } = useFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "habits"),
      (snapshot) => {
        const collectionGoals: GoalType[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          collectionGoals.push({
            id: doc.id,
            isDone: data.isDone,
            title: data.title,
            everyday: data.everyday,
            months: data.months,
            weekly: data.weekly,
          });
        });
        setGoals(collectionGoals);
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
      {goals.length > 0 ? (
        <div className="mt-4 space-y-2">
          {goals.map((goal) => {
            return <Goal key={goal.id} goal={goal} />;
          })}
        </div>
      ) : (
        <div className="h-full flex flex-col justify-center items-center space-y-2 -mt-6">
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
      <AddGoal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Home;
