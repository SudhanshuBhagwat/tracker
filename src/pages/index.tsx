import { collection, getDocs } from "firebase/firestore";
import type { NextPage } from "next";
import React, { useEffect } from "react";

import { firestore } from "../config/firebase";

const Home: NextPage = () => {
  async function getData() {
    try {
      const snapshot = await getDocs(collection(firestore, "test"));
      snapshot.forEach((doc) => {
        console.log(doc.data());
      });
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return <div className="h-full bg-yellow-100"></div>;
};

export default Home;
