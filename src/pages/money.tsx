import { PlusIcon } from "@heroicons/react/outline";
import { format, isThisMonth, isToday } from "date-fns";
import { onSnapshot, collection } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AddExpense from "../components/AddExpense";
import Expense from "../components/Expense";
import { firestore } from "../config/firebase";
import useFirestore from "../hooks/useFirestore";
import { Expense as ExpenseType } from "../types";

interface Props {}

const Money: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [spent, setSpent] = useState<ExpenseType[]>([]);
  const [today, setToday] = useState<ExpenseType[]>([]);
  const { addExpense } = useFirestore();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "expenses"),
      (snapshot) => {
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
        setSpent(totalExpenses);
        setToday(todaysExpenses);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  async function handleSubmit(expense: ExpenseType) {
    await addExpense(expense);
  }

  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Money</h2>
        <button
          className="flex items-center bg-green-200 px-2 py-1 rounded-md"
          onClick={() => {
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
          {today.length > 0 ? (
            <div className="mt-2 space-y-2">
              {today.map((expense) => {
                return <Expense key={expense.id} expense={expense} />;
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
          {spent.length > 0 ? (
            <div className="mt-2 space-y-2">
              {spent.map((expense) => {
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
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default Money;
