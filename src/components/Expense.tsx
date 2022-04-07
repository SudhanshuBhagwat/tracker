import React from "react";
import { Expense } from "../types";
import { ExpenseIconMap } from "./AddExpense";

interface Props {
  expense: Expense;
  handleClick?: () => void;
}

const Expense: React.FC<Props> = ({ expense, handleClick }) => {
  function getSpan() {
    if (expense.months === 1) {
      return "/ Month";
    } else if (expense.months > 1) {
      return `Every ${expense.months} months`;
    } else {
      return "";
    }
  }

  return (
    <div className="flex justify-between items-center p-4 rounded-md bg-gray-100">
      <div className="flex flex-col" onClick={handleClick}>
        <h3 className="text-md font-medium">{expense.title}</h3>
        <span className="text-xs mt-[2px] text-gray-400">
          {expense.spent} ₹ {getSpan()}
        </span>
      </div>
      <div className="flex items-center justify-center rounded-full p-2 bg-green-300">
        <span className="text-gray-600">
          {ExpenseIconMap[expense.category].icon}
        </span>
      </div>
    </div>
  );
};

export default Expense;
