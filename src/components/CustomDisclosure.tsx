import { Switch } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

interface Props {
  children?: React.ReactNode;
  label: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const EASE = [0.36, 0.66, 0.04, 1];

const CustomDisclosure: React.FC<Props> = ({
  children,
  label,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div className="w-full bg-gray-100 px-3 py-2 rounded-md transition">
      <Switch.Group>
        <div className="flex justify-between items-center w-full text-lg font-medium text-left dark:text-black">
          <Switch.Label className="mr-4">{label}</Switch.Label>
          <Switch
            as="div"
            checked={isOpen}
            onChange={setIsOpen}
            className={`${
              isOpen ? "bg-blue-400" : "bg-gray-200"
            } relative inline-flex items-center h-8 rounded-full w-14 transition`}
          >
            <span className="sr-only">Enable notifications</span>
            <span
              className={`${
                isOpen ? "translate-x-7" : "translate-x-1"
              } inline-block w-6 h-6 transform bg-white rounded-full transition ease-in-out duration-150`}
            />
          </Switch>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{
                height: "0",
                opacity: 0,
              }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  duration: 0.3,
                  ease: EASE,
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  duration: 0.2,
                  ease: EASE,
                },
              }}
              transition={{
                duration: 1,
              }}
            >
              <div className="pt-2 pb-2 w-full flex flex-col items-start transition space-y-2">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Switch.Group>
    </div>
  );
};

export default CustomDisclosure;
