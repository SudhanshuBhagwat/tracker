import { format, isThisWeek, isToday } from "date-fns";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { firestore } from "../config/firebase";
import type { Goal as GoalType } from "../types";
import Checkbox from "./Checkbox";

interface Props {
  goal: GoalType;
  disable?: boolean;
}

const Goal: React.FC<Props> = ({ goal, disable }) => {
  const alreadyCompleted = goal.completed.filter((date) => {
    return isToday(new Date(date));
  });
  const [isDone, setIsDone] = useState(alreadyCompleted.length > 0);

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

  async function handleDone(value: boolean) {
    const id = goal.id;
    if (id) {
      if (value) {
        await updateDoc(doc(firestore, "habits", id), {
          completed: arrayUnion(format(new Date(), "yyyy/MM/dd")),
        });
      } else {
        await updateDoc(doc(firestore, "habits", id), {
          completed: arrayRemove(format(new Date(), "yyyy/MM/dd")),
        });
      }
    }
    setIsDone(value);
  }

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col">
        <h3 className="text-md font-medium">{goal.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">{getSpan()}</span>
      </div>
      {!disable && (
        <Checkbox
          isDone={isDone}
          setIsDone={async (value) => {
            return await handleDone(value);
          }}
        />
      )}
    </div>
  );
};

export default Goal;
