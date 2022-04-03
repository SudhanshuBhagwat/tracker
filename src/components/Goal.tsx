import React, { useState } from "react";
import type { Goal as GoalType } from "../types";
import Checkbox from "./Checkbox";

interface Props {
  goal: GoalType;
}

const Goal: React.FC<Props> = ({ goal }) => {
  const [isDone, setIsDone] = useState(goal.isDone);

  function getSpan() {
    console.log(goal);

    let timeSpan;
    if (goal.everyday) {
      timeSpan = "Everyday";
    }

    return timeSpan;
  }

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col">
        <h3 className="text-md font-medium">{goal.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">{getSpan()}</span>
      </div>
      <Checkbox isDone={isDone} setIsDone={setIsDone} />
    </div>
  );
};

export default Goal;
