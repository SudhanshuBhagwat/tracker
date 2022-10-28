import { Switch } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Props {
  isDone: boolean;
  setIsDone: (value: boolean) => void;
}

const Checkbox: React.FC<Props> = ({ isDone, setIsDone }) => {
  return (
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
  );
};

export default Checkbox;
