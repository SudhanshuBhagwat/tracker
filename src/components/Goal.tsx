import { endOfWeek, format, isThisWeek, startOfWeek } from "date-fns";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { firestore } from "../config/firebase";
import type { Goal as GoalType } from "../types";
import Checkbox from "./Checkbox";

interface Props {
  goal: GoalType;
  disable: boolean;
}

let initialRender = true;

const Goal: React.FC<Props> = ({ goal, disable = false }) => {
  const [isDone, setIsDone] = useState(goal.isDone);

  function getSpan() {
    let timeSpan;
    if (goal.everyday) {
      timeSpan = "Everyday";
    } else if (goal.weekly) {
      const dates = goal.completed || [];
      const thisWeekDates = dates.filter((date) => isThisWeek(new Date(date)));
      const finalGoalsDone = thisWeekDates.map((date) => {
        const weekday = format(new Date(date), "eeee");
        if (goal.weekly.includes(weekday)) {
          return weekday;
        }
      });

      timeSpan = `${finalGoalsDone.length}/${goal.weekly.length} times done this week`;
    }

    return timeSpan;
  }

  useEffect(() => {
    if (initialRender) {
      initialRender = false;
      return;
    }

    async function handleDone() {
      const id = goal.id;
      if (id) {
        if (isDone) {
          await updateDoc(doc(firestore, "habits", id), {
            completed: arrayUnion(format(new Date(), "dd-MM-yyyy")),
          });
        } else {
          await updateDoc(doc(firestore, "habits", id), {
            completed: arrayRemove(format(new Date(), "dd-MM-yyyy")),
          });
        }
      }
    }

    handleDone();
  }, [goal.id, isDone]);

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col">
        <h3 className="text-md font-medium">{goal.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">{getSpan()}</span>
      </div>
      {disable && <Checkbox isDone={isDone} setIsDone={setIsDone} />}
    </div>
  );
};

export default Goal;
