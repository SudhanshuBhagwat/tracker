import { PlusIcon } from "@heroicons/react/outline";
import { isThisMonth, isToday } from "date-fns";
import { getAuth, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import AddExpense from "../components/AddExpense";
import Expense from "../components/Expense";
import { firestore } from "../config/firebase";
import useFirestore from "../hooks/useFirestore";
import type { Expense as ExpenseType } from "../types";

const fetcher = (url: string, uid: string = "") =>
  getDocs(
    query(collection(firestore, url), where("createdBy", "==", uid))
  ).then(function (snapshot) {
    const totalExpenses: ExpenseType[] = [];
    const todaysExpenses: ExpenseType[] = [];
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
      if (isToday(new Date(expense.createdAt))) {
        todaysExpenses.push(expense);
      }
      if (isThisMonth(new Date(expense.createdAt))) {
        totalExpenses.push(expense);
      }
    });

    return {
      todaysExpenses,
      totalExpenses,
    };
  });

const Money: React.FC = () => {
  const [user, setUser] = useState<User | null>();
  const { data, mutate } = useSWR("/expenses", (url) =>
    fetcher(url, user?.uid)
  );
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [mode, setMode] = useState<"ADD" | "EDIT" | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseType | null>();
  const { addExpense, updateExpense, removeExpense } = useFirestore();

  useEffect(() => {
    const unbsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
        router.replace("/auth");
      } else {
        setUser(user);
        mutate().then(() => {});
      }
    });

    return () => unbsubscribe();
  }, [router, mutate]);

  async function handleSubmit(expense: ExpenseType) {
    if (mode === "ADD") {
      await addExpense(expense);
    } else {
      await updateExpense(expense);
    }
    mutate();
  }

  async function handleRemove(id: string) {
    await removeExpense(id);
    mutate();
  }

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Money</h2>
        <button
          className="flex items-center bg-green-200 px-2 py-1 rounded-md"
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
      <div className="w-full h-full mt-4 space-y-4">
        <div className="flex flex-col">
          <h3 className="text-xl font-semibold">Today</h3>
          {data && data.todaysExpenses.length > 0 ? (
            <div className="mt-2 space-y-2">
              {data.todaysExpenses.map((expense) => {
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
        <div className="">
          <h3 className="text-xl font-semibold">This Month&apos;s Expenses</h3>
          {data && data.totalExpenses.length > 0 ? (
            <div className="mt-2 space-y-2">
              {data.totalExpenses.map((expense) => {
                return <Expense key={expense.id} expense={expense} />;
              })}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center space-y-2 mt-20">
              <span>No Expenses added</span>
              <span className="flex items-center">
                Press
                <button className="flex items-center bg-green-200 px-2 py-1 rounded-md mx-2">
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
      </div>
      <AddExpense
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mode={mode}
        expense={selectedExpense}
        handleSubmit={handleSubmit}
        handleRemove={handleRemove}
      />
    </div>
  );
};

export default Money;
