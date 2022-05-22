import { Transition, Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment } from "react";

interface Props {
  onClose: (value: boolean) => void;
}

const EASE = [0.36, 0.66, 0.04, 1];

const Modal: React.FC<Props> = ({ onClose, children }) => {
  return (
    <Dialog
      as="div"
      open={true}
      className="fixed z-10 inset-0 select-none"
      onClose={onClose}
    >
      <div className="flex flex-col justify-center h-full pt-4 text-center sm:block sm:p-0">
        <Dialog.Overlay
          as={motion.div}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: EASE,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: EASE,
            },
          }}
          className="fixed inset-0 bg-black/40 bg-opacity-75 transition-opacity"
        />
        <motion.div
          initial={{
            y: "100%",
          }}
          animate={{
            y: "0",
            transition: {
              duration: 0.3,
              ease: EASE,
            },
          }}
          exit={{
            y: "100%",
            transition: {
              duration: 0.2,
              ease: EASE,
            },
          }}
          className="z-0 flex flex-col w-full h-full bg-white rounded-t-xl shadow-xl overflow-auto"
        >
          {children}
        </motion.div>
      </div>
    </Dialog>
  );
};

export default Modal;
