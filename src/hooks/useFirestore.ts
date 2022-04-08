import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { Expense, Goal } from "../types";

function useFirestore() {
  async function addGoal(goal: Goal) {
    try {
      await addDoc(collection(firestore, "habits"), goal);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateGoal(goal: Goal) {
    const id = goal.id || "";
    try {
      await updateDoc(doc(firestore, "habits", id), {
        ...goal,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function removeGoal(id: string) {
    try {
      await deleteDoc(doc(firestore, "habits", id));
    } catch (err) {
      console.error(err);
    }
  }

  async function addExpense(expense: Expense) {
    try {
      await addDoc(collection(firestore, "expenses"), expense);
    } catch (err) {
      console.error(err);
    }
  }

  async function updateExpense(expense: Expense) {
    const id = expense.id || "";
    try {
      await updateDoc(doc(firestore, "expenses", id), {
        ...expense,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function removeExpense(id: string) {
    try {
      await deleteDoc(doc(firestore, "expenses", id));
    } catch (err) {
      console.error(err);
    }
  }

  async function getGoals() {
    try {
      return await getDocs(collection(firestore, "habits"));
    } catch (err) {
      console.error(err);
    }
  }

  return {
    addGoal,
    updateGoal,
    removeGoal,
    getGoals,
    addExpense,
    updateExpense,
    removeExpense,
  };
}

export default useFirestore;
