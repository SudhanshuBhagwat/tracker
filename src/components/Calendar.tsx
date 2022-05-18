import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline";
import {
  endOfMonth,
  format,
  eachDayOfInterval,
  startOfToday,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  add,
  getDay,
  endOfWeek,
} from "date-fns";
import React, { useState } from "react";

interface Props {
  children?: React.ReactNode;
  mode: "monthly" | "weekly";
  selectedDay: Date;
  setSelectedDay: (value: Date) => void;
}

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const Calendar: React.FC<Props> = ({
  mode = "weekly",
  selectedDay,
  setSelectedDay,
}) => {
  // const today = startOfToday();

  return mode === "monthly" ? (
    <MonthlyCalendar today={selectedDay} />
  ) : (
    <WeeklyCalendar selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
  );
};

const WeeklyCalendar = ({
  selectedDay,
  setSelectedDay,
}: {
  selectedDay: Date;
  setSelectedDay: (value: Date) => void;
}) => {
  // const [selectedDay, setSelectedDay] = useState(today);
  let [currentWeek, setCurrentWeek] = useState(format(selectedDay, "w"));
  let firstDayofWeek = parse(currentWeek, "w", new Date());

  let days = eachDayOfInterval({
    start: firstDayofWeek,
    end: endOfWeek(firstDayofWeek),
  });

  const previousWeek = () => {
    let firstDayPreviousWeek = add(firstDayofWeek, { weeks: -1 });
    setCurrentWeek(format(firstDayPreviousWeek, "w"));
  };

  const nextWeek = () => {
    let firstDayNextWeek = add(firstDayofWeek, { weeks: 1 });
    setCurrentWeek(format(firstDayNextWeek, "w"));
  };

  return (
    <div className="my-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold">
          {format(firstDayofWeek, "MMMM yyyy")}
        </h3>
        <div className="flex space-x-2">
          <button onClick={previousWeek}>
            <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
          </button>
          <button onClick={nextWeek}>
            <ChevronRightIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="grid grid-cols-7 text-sm mt-2 leading-6 text-center text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="grid grid-cols-7 text-sm mt-2">
          {days.map((day, dayIdx) => {
            return (
              <div
                className={classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  "py-1.5"
                )}
                key={day.toString()}
              >
                <button
                  onClick={() => setSelectedDay(day)}
                  className={classNames(
                    isEqual(day, selectedDay) && "text-white",
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "text-red-500",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayofWeek) &&
                      "text-gray-900",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayofWeek) &&
                      "text-gray-400",
                    isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                    isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                    !isEqual(day, selectedDay) && "hover:bg-gray-200",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full transition"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MonthlyCalendar = ({ today }: { today: Date }) => {
  const [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const previousMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };

  return (
    <div className="my-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold">{format(today, "MMMM yyyy")}</h3>
        <div className="flex space-x-2">
          <button onClick={nextMonth}>
            <ChevronLeftIcon className="h-6 w-6 text-gray-500" />
          </button>
          <button onClick={previousMonth}>
            <ChevronRightIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="grid grid-cols-7 text-sm mt-2 leading-6 text-center text-gray-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="grid grid-cols-7 text-sm mt-2">
          {days.map((day, dayIdx) => {
            return (
              <div
                className={classNames(
                  dayIdx === 0 && colStartClasses[getDay(day)],
                  "py-1.5"
                )}
                key={day.toString()}
              >
                <button
                  onClick={() => setSelectedDay(day)}
                  className={classNames(
                    isEqual(day, selectedDay) && "text-white",
                    !isEqual(day, selectedDay) &&
                      isToday(day) &&
                      "text-red-500",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      isSameMonth(day, firstDayCurrentMonth) &&
                      "text-gray-900",
                    !isEqual(day, selectedDay) &&
                      !isToday(day) &&
                      !isSameMonth(day, firstDayCurrentMonth) &&
                      "text-gray-400",
                    isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                    isEqual(day, selectedDay) && !isToday(day) && "bg-gray-900",
                    !isEqual(day, selectedDay) && "hover:bg-gray-200",
                    (isEqual(day, selectedDay) || isToday(day)) &&
                      "font-semibold",
                    "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                  )}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
