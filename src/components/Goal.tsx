import React, { useState } from "react";
import Checkbox from "./Checkbox";

interface Props {
  goal: any;
}

const Goal: React.FC<Props> = ({ goal }) => {
  const [isDone, setIsDone] = useState(goal.isDone);

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col">
        <h3 className="text-md font-medium">{goal.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">{goal.span}</span>
      </div>
      <Checkbox isDone={isDone} setIsDone={setIsDone} />
    </div>
  );
};

export default Goal;
