import { Switch } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

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
      <Switch
        checked={isDone}
        onChange={setIsDone}
        className={`relative inline-flex justify-center items-center h-8 rounded-full w-8 bg-gray-200 transition`}
      >
        <span className="sr-only">Complete Goal</span>
        <span
          className={`${
            isDone && "bg-blue-400"
          } w-6 h-6 rounded-full flex items-center justify-center transition`}
        >
          {isDone && <CheckIcon className="w-4 h-4 text-white" />}
        </span>
      </Switch>
    </div>
  );
};

export default Goal;
