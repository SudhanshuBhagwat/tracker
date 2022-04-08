import { Disclosure, RadioGroup, Switch } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { Goal } from "../types";
import Checkbox from "./Checkbox";
import Modal from "./Modal";
import Spinner from "./Spinner";

interface Props {
  isOpen: boolean;
  mode: "EDIT" | "ADD" | null | undefined;
  goal: Goal | null | undefined;
  setIsOpen: (value: boolean) => void;
  handleSubmit: (data: Goal) => void;
  handleRemove: (id: string) => void;
}

interface Days {
  [key: string]: boolean;
}

const DAYS: Days = {
  Sunday: false,
  Monday: false,
  Tuesday: false,
  Wednesday: false,
  Thursday: false,
  Friday: false,
  Saturday: false,
};

function setInitialDays(days: string[]): Days {
  const newDays = { ...DAYS };
  days.forEach((day) => {
    newDays[day] = true;
  });
  return newDays;
}

const AddGoal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  handleSubmit,
  handleRemove,
  mode,
  goal,
}) => {
  console.log(goal);
  const [title, setTitle] = useState<string>("");
  const [isEveryday, setIsEveryday] = useState<boolean>(false);
  const [times, setTimes] = useState<number>(0);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<Days>(DAYS);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  let closeFunction: () => void;

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setIsEveryday(Boolean(goal.everyday));
      setTimes(goal.weekly.length);
      setDays(setInitialDays(goal.weekly));
      setMonths(goal.months);
    } else {
      clearState();
    }
  }, [goal]);

  function clearState() {
    setTitle("");
    setIsEveryday(false);
    setTimes(0);
    setMonths(0);
    setDays(DAYS);
  }

  async function handleClose() {
    setIsOpen(false);
  }

  function getWeekString() {
    let weekString = "";
    const enabledDays = Object.keys(days).filter((day) => days[day]);

    if (
      enabledDays.length === 2 &&
      enabledDays.includes("Saturday") &&
      enabledDays.includes("Sunday")
    ) {
      weekString = "Weekends";
    } else if (
      enabledDays.length === 5 &&
      enabledDays.includes("Monday") &&
      enabledDays.includes("Tuesday") &&
      enabledDays.includes("Wednesday") &&
      enabledDays.includes("Thursday") &&
      enabledDays.includes("Friday")
    ) {
      weekString = "Weekdays";
    } else if (enabledDays.length === 1) {
      weekString = `${enabledDays[0]}'s`;
    }

    return weekString;
  }

  return (
    <Modal isOpen={isOpen} onClose={setIsOpen}>
      <div className="h-full w-full flex flex-col overflow-y-scroll pb-4">
        <div className="w-full flex justify-between fixed p-4 bg-white rounded-t-xl">
          <button
            className="text-lg font-md font-normal text-blue-400"
            onClick={handleClose}
          >
            Close
          </button>
          <h2 className="text-xl font-semibold">
            {mode === "ADD" ? "Add" : "Edit"} Goal
          </h2>
          <button
            className="text-lg font-md font-semibold text-blue-400 w-11"
            onClick={async () => {
              setIsSaving(true);
              const enabledDays = Object.keys(days).filter((day) => days[day]);
              if (goal) {
                console.log("Update");
                await handleSubmit({
                  id: goal.id,
                  title: title,
                  everyday: isEveryday,
                  months: months,
                  weekly: enabledDays,
                  createdAt: goal.createdAt,
                  completed: goal.completed,
                });
              } else {
                await handleSubmit({
                  title: title,
                  everyday: isEveryday,
                  months: months,
                  weekly: enabledDays,
                  createdAt: new Date().toISOString(),
                  completed: [],
                });
              }
              clearState();
              setIsOpen(false);
              setIsSaving(false);
            }}
          >
            {isSaving ? <Spinner /> : "Save"}
          </button>
        </div>
        <div className="flex flex-col items-start px-4 space-y-4 mt-14">
          <div className="flex flex-col items-start w-full">
            <label htmlFor="goal-title" className="text-lg font-medium">
              Title
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
              placeholder="Please enter a title for you goal"
            />
          </div>
          <div className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 rounded-md">
            <label htmlFor="everyday" className="text-lg font-medium">
              Everyday
            </label>
            <Checkbox
              isDone={isEveryday}
              setIsDone={(value) => {
                closeFunction();
                setIsEveryday(value);
              }}
            />
          </div>
          <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
            <Disclosure defaultOpen={times > 0}>
              {({ open, close }) => {
                closeFunction = close;
                if (open) {
                  setTimeout(() => {
                    setIsEveryday(false);
                  }, 0);
                }
                return (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full text-lg font-medium text-left">
                      <span>Is this a Weekly goal?</span>
                      <Switch
                        as="div"
                        checked={open}
                        onChange={() => {
                          setIsEveryday(false);
                        }}
                        className={`${
                          open ? "bg-blue-400" : "bg-gray-200"
                        } relative inline-flex items-center h-8 rounded-full w-14 transition`}
                      >
                        <span className="sr-only">Enable notifications</span>
                        <span
                          className={`${
                            open ? "translate-x-7" : "translate-x-1"
                          } inline-block w-6 h-6 transform bg-white rounded-full transition ease-in-out duration-150`}
                        />
                      </Switch>
                    </Disclosure.Button>
                    <Disclosure.Panel className="pt-2 pb-2 w-full flex flex-col items-start transition space-y-2">
                      <div className="w-full flex flex-col items-start space-y-3">
                        <span className="text-gray-400 text-base text-left">
                          {times} {times > 1 ? "times" : "time"} per week
                        </span>
                        <RadioGroup
                          value={times}
                          onChange={(t) => {
                            setIsEveryday(false);
                            setTimes(t);
                          }}
                          className="w-full"
                        >
                          <RadioGroup.Label className="sr-only">
                            Frequency
                          </RadioGroup.Label>
                          <div className="flex justify-center">
                            <span className="relative z-0 inline-flex justify-between w-full">
                              {[...Array(6).keys()]
                                .map((el) => el + 1)
                                .map((number) => {
                                  return (
                                    <RadioGroup.Option
                                      key={number}
                                      value={number}
                                      className="transition"
                                    >
                                      {({ checked }) => (
                                        <span
                                          className={`${
                                            checked
                                              ? "bg-blue-400 text-white border-blue-400"
                                              : "text-gray-400 border-gray-200"
                                          } w-10 h-10 border rounded-full inline-flex justify-center items-center transition`}
                                        >
                                          {number}
                                        </span>
                                      )}
                                    </RadioGroup.Option>
                                  );
                                })}
                            </span>
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="w-full flex flex-col items-start space-y-3">
                        <span className="text-gray-400 text-base">
                          On {getWeekString()}
                        </span>
                        <Switch.Group>
                          <Switch.Label className="sr-only">
                            Days of the week
                          </Switch.Label>
                          <div className="flex justify-center w-full">
                            <span className="relative z-0 inline-flex justify-between w-full">
                              {Object.keys(days).map((day) => {
                                return (
                                  <Switch
                                    key={day}
                                    checked={days[day]}
                                    onChange={() => {
                                      const isTrue = days[day];
                                      const enabledDays = Object.keys(
                                        days
                                      ).filter((day) => days[day]);

                                      if (
                                        (!isTrue &&
                                          enabledDays.length < times) ||
                                        isTrue
                                      ) {
                                        setDays((old) => {
                                          return {
                                            ...old,
                                            [day]: !days[day],
                                          };
                                        });
                                      }
                                    }}
                                    className="transition"
                                  >
                                    {({ checked }) => (
                                      <span
                                        className={`${
                                          checked
                                            ? "bg-blue-400 text-white border-blue-400"
                                            : "text-gray-400 border-gray-200"
                                        } w-10 h-10 border rounded-full inline-flex justify-center items-center transition`}
                                      >
                                        {day.charAt(0)}
                                      </span>
                                    )}
                                  </Switch>
                                );
                              })}
                            </span>
                          </div>
                        </Switch.Group>
                      </div>
                    </Disclosure.Panel>
                  </>
                );
              }}
            </Disclosure>
          </div>
          <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
            <div className="flex justify-between items-center w-full text-lg font-medium text-left">
              <span>Repeat for months</span>
            </div>
            <div className="pt-2 pb-2 w-full flex flex-col items-start transition space-y-2">
              <div className="w-full flex flex-col items-start space-y-3">
                <span className="text-gray-400 text-base text-left">
                  For {months} {months > 1 ? "months" : "month"}
                </span>
                <RadioGroup
                  value={months}
                  onChange={setMonths}
                  className="w-full"
                >
                  <RadioGroup.Label className="sr-only">
                    Frequency in Months
                  </RadioGroup.Label>
                  <div className="flex justify-center">
                    <span
                      className="grid grid-rows-2 grid-cols-6 justify-between"
                      style={{
                        rowGap: "0.5em",
                        columnGap: "1em",
                      }}
                    >
                      {[...Array(12).keys()]
                        .map((el) => el + 1)
                        .map((number) => {
                          return (
                            <RadioGroup.Option
                              key={number}
                              value={number}
                              className="transition"
                            >
                              {({ checked }) => (
                                <span
                                  className={`${
                                    checked
                                      ? "bg-blue-400 text-white border-blue-400"
                                      : "text-gray-400 border-gray-200"
                                  } w-10 h-10 border rounded-full inline-flex justify-center items-center transition`}
                                >
                                  {number}
                                </span>
                              )}
                            </RadioGroup.Option>
                          );
                        })}
                    </span>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
          {mode === "EDIT" && (
            <div className="w-full">
              <button
                onClick={async () => {
                  setIsSaving(true);
                  const id = (goal && goal.id) || "";
                  await handleRemove(id);

                  clearState();
                  setIsOpen(false);
                  setIsSaving(false);
                }}
                className="w-full py-2 bg-red-600 text-white font-semibold rounded-md"
              >
                Remove Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddGoal;
