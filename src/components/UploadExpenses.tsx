import Papa from "papaparse";
import React, { useState } from "react";
import readXlsxFile from "read-excel-file";
import useFirestore from "../hooks/useFirestore";
import { Expense } from "../types";
import Modal from "./Modal";
import Spinner from "./Spinner";

interface Props {
  setIsOpen: (value: boolean) => void;
}

const allowedExtensions = ["csv"];

const UploadExpenses: React.FC<Props> = ({
  setIsOpen,
}) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { addExpense } = useFirestore();

  async function handleIsOpen() {
    setIsOpen(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files?.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      handleParse(inputFile);
    }
  };

  const handleParse = (file: File) => {
    if (!file) return setError("Enter a valid file");
    const reader = new FileReader();

    reader.onload = async ({ target }) => {
      // @ts-ignore
      const csv = Papa.parse(target.result, { header: true });
      // @ts-ignore
      const parsedData = csv?.data;
      setData(parsedData);
    };
    reader.readAsText(file);
  };

  async function handleSave() {
    data.forEach(async (d: any) => {
      if (d['Txn Date'].length > 0) {
        const transaction: Expense = {
          title: d['Description']?.trim(),
          months: 0,
          spent: d['        Debit'],
          category: 8,
          other: '',
          createdAt: new Date(d['Txn Date']).toISOString(),
        };

        await addExpense(transaction);
      }
    });
  }

  return (
    <Modal onClose={setIsOpen}>
      <div className="h-full w-full flex flex-col overflow-y-scroll pb-4">
        <div className="w-full flex justify-between fixed p-4 bg-white rounded-t-xl">
          <button
            className="text-lg font-md font-normal text-red-400"
            onClick={handleIsOpen}
          >
            Close
          </button>
          <h2 className="text-xl font-semibold">
            Upload Expenses
          </h2>
          <button
            className="text-lg font-md font-semibold text-primary w-11"
            onClick={async () => {
              setIsSaving(true);
              if (data.length > 0) {
                await handleSave();
              }
              setIsOpen(false);
              setIsSaving(false);
            }}
          >
            {isSaving ? <Spinner /> : "Save"}
          </button>
        </div>
        <div className="flex flex-col items-start px-4 space-y-4 mt-14">
          <div className="flex justify-center items-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mt-2">
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <svg aria-hidden="true" className="mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                <p className="text-xs text-gray-500 dark:text-gray-400">XLSX, CSV</p>
              </div>
              <input id="dropzone-file" onChange={handleFileChange} type="file" className="hidden" />
            </label>
          </div>
          {error.length > 0 && <span className="font-md text-red-600 font-bold">Error: {error}</span>}
        </div>
        {data.length > 0 && <div className="flex flex-col mt-8 px-4">
          <h2 className="font-bold mb-4 text-lg md:text-xl self-start">Imported Data</h2>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6"
                      >
                        Txn Date
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6"
                      >
                        Debit
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-3 first:pl-4 text-left text-sm text-gray-900 first:sm:pl-6"
                      >
                        Credit
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((transaction: any, index: number) => (
                      <tr key={index}>
                        <td className="py-4 pl-4 pr-3 text-left text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
                          {transaction['Txn Date']}
                        </td>
                        <td className="px-3 py-4 text-left text-sm text-gray-500 whitespace-nowrap">
                          {transaction['Description']?.trim()}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {transaction['        Debit']}
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {transaction['Credit']}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </Modal>
  );
};

export default UploadExpenses;
