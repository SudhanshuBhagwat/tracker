import { PlusIcon } from "@heroicons/react/outline";
import type { NextPage } from "next";
import React, { useState } from "react";
import AddGoal from "../components/AddGoal";
import Goal from "../components/Goal";

const GOALS = [
  { title: "Code for 1 hour", span: "Everyday", isDone: true },
  { title: "Read for 30 mins", span: "Everyday", isDone: false },
  { title: "Watch 10 episodes of One Piece", span: "Everyday", isDone: true },
  { title: "Eat Barfacha Gola", span: "1/2 completed this week", isDone: true },
];

const Home: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Goals</h2>
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
      <div className="mt-4 space-y-2">
        {GOALS.map((goal) => {
          return <Goal key={goal.title} goal={goal} />;
        })}
      </div>
      <AddGoal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Home;
