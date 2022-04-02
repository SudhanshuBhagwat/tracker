import { Disclosure, RadioGroup, Switch, Transition } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Checkbox from "./Checkbox";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AddGoal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const [isEveryday, setIsEveryday] = useState<boolean>(false);
  const [times, setTimes] = useState<number>(1);

  function handleIsOpen() {
    setIsOpen(false);
  }

  return (
    <Modal open={isOpen} onClose={setIsOpen}>
      <div className="h-full flex flex-col overflow-y-scroll">
        <div className="flex justify-between p-4">
          <button
            className="text-lg font-md font-normal text-blue-400"
            onClick={handleIsOpen}
          >
            Close
          </button>
          <h2 className="text-xl font-semibold">Add Goal</h2>
          <button
            className="text-lg font-md font-semibold text-blue-400"
            onClick={handleIsOpen}
          >
            Save
          </button>
        </div>
        <div className="flex flex-col items-start px-4 space-y-6 mt-4">
          <div className="flex flex-col items-start w-full">
            <label htmlFor="goal-title" className="text-lg font-medium">
              Title
            </label>
            <input
              id="goal-title"
              type="text"
              className="w-full rounded-md mt-1 border-gray-400 placeholder:text-gray-400"
              placeholder="Please enter a title for you goal"
            />
          </div>
          <div className="w-full flex items-start justify-between px-3 py-2 bg-gray-100 rounded-md">
            <label htmlFor="everyday" className="text-lg font-medium">
              Everyday
            </label>
            <Checkbox isDone={isEveryday} setIsDone={setIsEveryday} />
          </div>
          <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between items-center w-full text-lg font-medium text-left">
                    <span>Is this a Weekly goal?</span>
                    <Switch
                      as="div"
                      checked={open}
                      onChange={(value) => !value}
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
                  <Disclosure.Panel className="pt-2 pb-2 w-full flex flex-col items-start transition space-y-4">
                    <span className="text-gray-400 text-base">
                      {times} {times > 1 ? "times" : "time"} per week
                    </span>
                    <RadioGroup
                      value={times}
                      onChange={setTimes}
                      className="w-full"
                    >
                      <RadioGroup.Label className="sr-only">
                        Frequency
                      </RadioGroup.Label>
                      <div className="flex justify-center">
                        <span className="relative z-0 inline-flex justify-between w-full">
                          {[...Array(7).keys()]
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
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddGoal;
