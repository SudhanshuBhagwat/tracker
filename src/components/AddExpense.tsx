import { Disclosure, RadioGroup, Switch } from "@headlessui/react";
import {
  CakeIcon,
  CashIcon,
  ChartBarIcon,
  DeviceMobileIcon,
  GiftIcon,
  HomeIcon,
  ShoppingBagIcon,
  TicketIcon,
} from "@heroicons/react/outline";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Expense } from "../types";
import Modal from "./Modal";
import Spinner from "./Spinner";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  mode: "ADD" | "EDIT" | null | undefined;
  expense: Expense | null | undefined;
  handleSubmit: (data: Expense) => void;
  handleRemove: (id: string) => void;
}

export const ExpenseIconMap: {
  [key: string]: {
    title: string;
    icon: ReactNode;
  };
} = {
  1: {
    title: "Investment",
    icon: <ChartBarIcon className="h-5 w-5" />,
  },
  2: {
    title: "Shopping",
    icon: <ShoppingBagIcon className="h-5 w-5" />,
  },
  3: {
    title: "Recharge",
    icon: <DeviceMobileIcon className="h-5 w-5" />,
  },
  4: {
    title: "Food",
    icon: <CakeIcon className="h-5 w-5" />,
  },
  5: {
    title: "Movie",
    icon: <TicketIcon className="h-5 w-5" />,
  },
  6: {
    title: "Rent",
    icon: <HomeIcon className="h-5 w-5" />,
  },
  7: {
    title: "Gift",
    icon: <GiftIcon className="h-5 w-5" />,
  },
  8: {
    title: "Other",
    icon: <CashIcon className="h-5 w-5" />,
  },
};

const AddExpense: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  mode,
  expense,
  handleSubmit,
  handleRemove,
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const spentRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState<string>("");
  const [spent, setSpent] = useState<string>("");
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [months, setMonths] = useState<number>(0);
  const [category, setCategory] = useState<number>(0);
  const [otherSelected, setOtherSelected] = useState<boolean>(false);
  const [otherTitle, setOtherTitle] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    if (expense) {
      setTitle(expense.title);
      setSpent(expense.spent);
      setIsRepeating(expense.months > 0);
      setMonths(expense.months);
      setCategory(expense.category);
      setOtherSelected(expense.category === 8);
      setOtherTitle(expense.other || "");
    }
  }, [expense]);

  function clearState() {
    setTitle("");
    setSpent("");
    setIsRepeating(false);
    setMonths(0);
    setCategory(0);
    setOtherSelected(false);
    setOtherTitle("");
  }

  async function handleIsOpen() {
    clearState();
    setMessage("");
    setIsOpen(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={setIsOpen}>
      <div className="h-full w-full flex flex-col overflow-y-scroll pb-4">
        <div className="w-full flex justify-between fixed p-4 bg-white rounded-t-xl">
          <button
            className="text-lg font-md font-normal text-blue-400"
            onClick={handleIsOpen}
          >
            Close
          </button>
          <h2 className="text-xl font-semibold">
            {mode === "ADD" ? "Add" : "Edit"} Expense
          </h2>
          <button
            className="text-lg font-md font-semibold text-blue-400 w-11"
            onClick={async () => {
              setIsSaving(true);

              if (!titleRef.current?.value) {
                setMessage("Title is required for an expense");
                titleRef.current?.focus();
                setIsSaving(false);
                return;
              }
              if (!spentRef.current?.value) {
                setMessage("Spent amount is required for an expense");
                spentRef.current?.focus();
                setIsSaving(false);
                return;
              }
              if (category === 0) {
                setMessage("Category is required for an expense");
                setIsSaving(false);
                return;
              }

              if (mode === "EDIT") {
                await handleSubmit({
                  id: expense?.id,
                  category: category,
                  title: title,
                  createdAt: expense?.createdAt || new Date().toISOString(),
                  months: isRepeating ? months : 0,
                  other: Number(category) === 8 ? otherTitle : "",
                  spent: spent,
                });
              } else {
                await handleSubmit({
                  category: category,
                  title: title,
                  createdAt: new Date().toISOString(),
                  months: isRepeating ? months : 0,
                  other: Number(category) === 8 ? otherTitle : "",
                  spent: spent,
                });
              }
              clearState();
              setMessage("");
              setIsOpen(false);
              setIsSaving(false);
            }}
          >
            {isSaving ? <Spinner /> : "Save"}
          </button>
        </div>
        <div className="flex flex-col items-start px-4 space-y-4 mt-14">
          <div className="flex flex-col items-start w-full">
            {message.length > 0 && (
              <span className="text-red-600 font-medium">{message}</span>
            )}
            <label htmlFor="goal-title" className="text-lg font-medium">
              Title
            </label>
            <input
              id="expense-title"
              type="text"
              ref={titleRef}
              value={title}
              onChange={(e) => {
                setMessage("");
                setTitle(e.target.value);
              }}
              className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
              placeholder="Please enter a title for you expense"
            />
          </div>
          <div className="flex flex-col items-start w-full">
            <label htmlFor="money-spent" className="text-lg font-medium">
              Spent
            </label>
            <input
              id="money-spent"
              type="number"
              ref={spentRef}
              value={spent}
              onChange={(e) => {
                setMessage("");
                setSpent(e.target.value);
              }}
              className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
              placeholder="Please enter the amount of you expense"
            />
          </div>
          <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
            <Disclosure defaultOpen={isRepeating}>
              {({ open }) => {
                return (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full text-lg font-medium text-left">
                      <span>Is Repeating Monthly?</span>
                      <Switch
                        as="div"
                        checked={open}
                        onChange={setIsRepeating}
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
                          {months === 1 ? "Mothly" : `Every ${months} months`}
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
                    </Disclosure.Panel>
                  </>
                );
              }}
            </Disclosure>
          </div>
          <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
            <div className="flex justify-between items-center w-full text-lg font-medium text-left">
              <span>Category</span>
            </div>
            <div className="pt-2 pb-2 w-full flex flex-col items-start transition space-y-2">
              <div className="w-full flex flex-col items-start space-y-3">
                <RadioGroup
                  value={category}
                  onChange={(c) => {
                    setMessage("");
                    setCategory(c);
                  }}
                  className="w-full"
                >
                  <RadioGroup.Label className="sr-only">
                    Category
                  </RadioGroup.Label>
                  <div className="flex justify-center">
                    <span
                      className="grid grid-rows-2 grid-cols-4 justify-between"
                      style={{
                        rowGap: "0.5em",
                        columnGap: "1em",
                      }}
                    >
                      {Object.keys(ExpenseIconMap).map((key) => {
                        return (
                          <RadioGroup.Option
                            key={`${key}`}
                            value={key}
                            className="transition"
                          >
                            {({ checked }) => {
                              if (key === "8" && checked) {
                                setTimeout(() => {
                                  setOtherSelected(true);
                                }, 0);
                              } else if (key === "8" && !checked) {
                                setTimeout(() => {
                                  setOtherSelected(false);
                                }, 0);
                              }
                              return (
                                <div className="flex flex-col justify-center items-center">
                                  <span
                                    className={`${
                                      checked
                                        ? "bg-blue-400 text-white border-blue-400"
                                        : "text-gray-400 border-gray-200"
                                    } w-10 h-10 border rounded-full inline-flex justify-center items-center transition`}
                                  >
                                    {ExpenseIconMap[key].icon}
                                  </span>
                                  <span className="text-gray-400 text-sm">
                                    {ExpenseIconMap[key].title}
                                  </span>
                                </div>
                              );
                            }}
                          </RadioGroup.Option>
                        );
                      })}
                    </span>
                  </div>
                </RadioGroup>
                {otherSelected && (
                  <div className="flex flex-col items-start w-full">
                    <label htmlFor="other-expense-title" className="sr-only">
                      Other Expense Title
                    </label>
                    <input
                      id="other-expense-title"
                      type="text"
                      value={otherTitle}
                      onChange={(e) => setOtherTitle(e.target.value)}
                      className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
                      placeholder="Please enter category for you expense"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {mode === "EDIT" && (
            <div className="w-full">
              <button
                onClick={async () => {
                  setIsSaving(true);
                  const id = (expense && expense.id) || "";
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

export default AddExpense;
