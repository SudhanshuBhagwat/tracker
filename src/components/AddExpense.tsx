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
import React, { ReactNode, useState } from "react";
import { Expense } from "../types";
import Modal from "./Modal";
import Spinner from "./Spinner";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  handleSubmit: (data: Expense) => void;
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

const AddExpense: React.FC<Props> = ({ isOpen, setIsOpen, handleSubmit }) => {
  const [title, setTitle] = useState<string>("");
  const [spent, setSpent] = useState<string>("");
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [months, setMonths] = useState<number>(1);
  const [category, setCategory] = useState<number>(0);
  const [otherSelected, setOtherSelected] = useState<boolean>(false);
  const [otherTitle, setOtherTitle] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  async function handleIsOpen() {
    setIsOpen(false);
    setTitle("");
  }

  return (
    <Modal open={isOpen} onClose={setIsOpen}>
      <div className="h-full w-full flex flex-col overflow-y-scroll pb-4">
        <div className="w-full flex justify-between fixed p-4 bg-white rounded-t-xl">
          <button
            className="text-lg font-md font-normal text-blue-400"
            onClick={handleIsOpen}
          >
            Close
          </button>
          <h2 className="text-xl font-semibold">Add Expense</h2>
          <button
            className="text-lg font-md font-semibold text-blue-400 w-11"
            onClick={async () => {
              setIsSaving(true);

              const expense: Expense = {
                category,
                title,
                createdAt: new Date().toISOString(),
                months: isRepeating ? months : 0,
                other: Number(category) === 8 ? otherTitle : "",
                spent,
              };
              await handleSubmit(expense);
              setTitle("");
              setSpent("");
              setIsRepeating(false);
              setMonths(1);
              setCategory(0);
              setOtherSelected(false);
              setOtherTitle("");
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
              id="expense-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
              className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
              placeholder="Please enter the amount of you expense"
            />
          </div>
          <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
            <Disclosure>
              {({ open }) => {
                return (
                  <>
                    <Disclosure.Button className="flex justify-between items-center w-full text-lg font-medium text-left">
                      <span>Is Repeating Monthly?</span>
                      <Switch
                        as="div"
                        checked={open}
                        onChange={(value) => {
                          setIsRepeating(value);
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
                  onChange={setCategory}
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
        </div>
      </div>
    </Modal>
  );
};

export default AddExpense;
