import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}

const Modal: React.FC<Props> = ({ isOpen, onClose, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 select-none"
        onClose={onClose}
      >
        <div className="flex flex-col justify-center h-full pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-[cubic-bezier(0.36, 0.66, 0.04, 1)] duration-400"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-[cubic-bezier(0.36, 0.66, 0.04, 1)] duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-[cubic-bezier(0.36, 0.66, 0.04, 1)] duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="ease-[cubic-bezier(0.36, 0.66, 0.04, 1)] duration-300"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="z-0 flex flex-col w-full h-full bg-white rounded-t-xl shadow-xl overflow-auto">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
