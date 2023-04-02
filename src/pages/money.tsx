import { CloudArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  isEqual,
  isSameDay,
  isThisMonth,
  isToday,
  parseISO,
  startOfToday,
} from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { memo, useEffect, useMemo, useState } from "react";
import useSWR, { mutate as gMutate } from "swr";
import AddExpense from "../components/AddExpense";
import Calendar from "../components/Calendar";
import Expense from "../components/Expense";
import Spinner from "../components/Spinner";
import UploadExpenses from "../components/UploadExpenses";
import { firestore, useAuth } from "../config/firebase";
import useFirestore from "../hooks/useFirestore";
import type { Expense as ExpenseType } from "../types";

const fetcher = async (
  url: string,
  uid: string | undefined
): Promise<{
  totalExpenses: ExpenseType[];
}> => {
  const totalExpenses: ExpenseType[] = [];
  try {
    const snapshot = await getDocs(
      query(collection(firestore, url), where("createdBy", "==", uid))
    );
    snapshot.forEach((doc) => {
      const data = doc.data();
      const expense: ExpenseType = {
        id: doc.id,
        title: data.title,
        spent: data.spent,
        months: data.months,
        category: data.category,
        other: data.other,
        createdAt: data.createdAt,
      };
      if (isThisMonth(new Date(expense.createdAt))) {
        totalExpenses.push(expense);
      }
    });
  } catch (err) {
    throw err;
  }

  return {
    totalExpenses,
  };
};

const Money: React.FC = () => {
  const { currentUser, fetchingUser } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"ADD" | "EDIT" | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>();
  const { addExpense, updateExpense, removeExpense } = useFirestore();
  const today = startOfToday();
  const { day } = router.query;
  const currentDay = (day && parseISO(day as string)) || today;
  const [selectedDay, setSelectedDay] = useState(today);
  const { data, error, mutate } = useSWR(
    currentUser ? "/expenses" : null,
    (url) => fetcher(url, currentUser?.uid)
  );
  const todaysExpenses = useMemo(
    () =>
      data?.totalExpenses.filter((expense) => {
        return isSameDay(parseISO(expense.createdAt), currentDay);
      }) || [],
    [currentDay, data?.totalExpenses]
  );

  useEffect(() => {
    if (!fetchingUser && !currentUser) {
      router.replace("/auth");
    } else {
      mutate();
    }
  }, [currentUser, fetchingUser, mutate, router]);

  async function handleSubmit(expense: ExpenseType) {
    if (mode === "ADD") {
      await addExpense(expense);
    } else {
      await updateExpense(expense);
    }
    mutate();
    gMutate("/totalExpenses");
  }

  async function handleRemove(id: string) {
    await removeExpense(id);
    mutate();
    gMutate("/totalExpenses");
  }

  if (error) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="px-4 py-2 bg-red-500 rounded-md font-medium text-white">
          {error}
        </span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col flex-1 sm:grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-7">
      <section className="sm:hidden">
        <Calendar
          mode="weekly"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </section>
      <section className="lg:col-span-5 p-4 sm:col-span-1 md:col-span-1 lg:p-0">
        <div className="w-full space-y-4 lg:space-y-0 lg:mt-0 lg:grid lg:grid-cols-2 lg:h-full">
          <div className="flex flex-col lg:border-r lg:p-4">
            <div className="flex justify-between items-center lg:items-start">
              <h2 className="text-2xl font-semibold">Money</h2>
              <div className="flex space-x-2">
                <button
                  className="flex items-center bg-green-200 dark:text-black p-2 rounded-md"
                  onClick={() => {
                    setIsUploadOpen((open) => !open);
                  }}
                >
                  <span className="">
                    <CloudArrowUpIcon className="h-4 w-4" />
                  </span>
                </button>
                <button
                  className="flex items-center bg-green-200 dark:text-black px-2 py-1 rounded-md"
                  onClick={() => {
                    setMode("ADD");
                    setSelectedExpense(null);
                    setIsOpen((open) => !open);
                  }}
                >
                  <span className="mr-1">
                    <PlusIcon className="h-4 w-4" />
                  </span>
                  Add Expenses
                </button>
              </div>
            </div>
            <h3 className="text-xl font-semibold mt-2 lg:mt-4">Today</h3>
            {todaysExpenses.length > 0 ? (
              <div className="mt-2 space-y-2">
                {todaysExpenses.map((expense) => {
                  return (
                    <Expense
                      key={expense.id}
                      expense={expense}
                      handleClick={() => {
                        setSelectedExpense(expense);
                        setMode("EDIT");
                        setIsOpen((open) => !open);
                      }}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center space-y-2 py-6">
                <span>You&apos;re good for today</span>
              </div>
            )}
          </div>
          <Expenses expenses={data.totalExpenses} />
        </div>
        <AnimatePresence>
          {isOpen && (
            <AddExpense
              setIsOpen={setIsOpen}
              mode={mode}
              expense={selectedExpense}
              handleSubmit={handleSubmit}
              handleRemove={handleRemove}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isUploadOpen && <UploadExpenses setIsOpen={setIsUploadOpen} />}
        </AnimatePresence>
      </section>
      <section className="lg:col-span-2 border-l hidden sm:col-span-1 sm:block">
        <Calendar
          mode="monthly"
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />
      </section>
    </div>
  );
};

const AllExpenses = ({ expenses }: { expenses: ExpenseType[] }) => {
  return (
    <div className="lg:p-4 lg:h-full">
      <h3 className="text-xl font-semibold">This Month&apos;s Expenses</h3>
      {expenses && expenses.length > 0 ? (
        <div className="mt-2 space-y-2">
          {expenses.map((expense: ExpenseType) => {
            return <Expense key={expense.id} expense={expense} />;
          })}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center space-y-2 mt-20 lg:h-full lg:mt-0">
          <span>No Expenses added</span>
          <span className="flex items-center">
            Press
            <button className="flex items-center bg-green-200 dark:text-black px-2 py-1 rounded-md mx-2">
              <span className="mr-1">
                <PlusIcon className="h-4 w-4" />
              </span>
              Add Expense
            </button>
            to add one
          </span>
        </div>
      )}
    </div>
  );
};

const Expenses = memo(AllExpenses);

export default Money;
