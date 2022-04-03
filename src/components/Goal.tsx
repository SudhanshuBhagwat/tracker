import { collection, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore } from "../config/firebase";
import type { Goal as GoalType } from "../types";
import Checkbox from "./Checkbox";

interface Props {
  goal: GoalType;
}

const Goal: React.FC<Props> = ({ goal }) => {
  const [isDone, setIsDone] = useState(goal.isDone);

  function getSpan() {
    let timeSpan;
    if (goal.everyday) {
      timeSpan = "Everyday";
    } else if (goal.weekly) {
      timeSpan = `${goal.weekly.length} times per week`;
    }

    return timeSpan;
  }

  async function handleDone() {
    const id = goal.id;
    if (id) {
      await updateDoc(doc(firestore, "habits", id), {
        isDone: !isDone,
      });
    }
  }

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col">
        <h3 className="text-md font-medium">{goal.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">{getSpan()}</span>
      </div>
      <Checkbox
        isDone={isDone}
        setIsDone={async (value) => {
          await handleDone();
          return setIsDone(value);
        }}
      />
    </div>
  );
};

export default Goal;
