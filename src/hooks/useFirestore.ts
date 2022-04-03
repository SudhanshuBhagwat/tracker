import { addDoc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { Goal } from "../types";

function useFirestore() {
  async function addGoal(goal: Goal) {
    try {
      await addDoc(collection(firestore, "habits"), goal);
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
    getGoals,
  };
}

export default useFirestore;
