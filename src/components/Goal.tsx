import { format, isThisWeek, isToday } from "date-fns";
import React, { useState } from "react";
import type { Goal as GoalType } from "../types";
import Checkbox from "./Checkbox";

interface Props {
  goal: GoalType;
  disable?: boolean;
  handleClick?: () => void;
  handleDone: (isDone: boolean, id: string) => void;
}

const Goal: React.FC<Props> = ({ goal, disable, handleClick, handleDone }) => {
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

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col" onClick={handleClick}>
        <h3 className="text-md font-medium">{goal.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">{getSpan()}</span>
      </div>
      {!disable && (
        <Checkbox
          isDone={isDone}
          setIsDone={async (value) => {
            setIsDone(value);
            handleDone(value, goal.id ? goal.id : "");
          }}
        />
      )}
    </div>
  );
};

export default Goal;
