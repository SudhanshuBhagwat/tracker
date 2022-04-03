import { Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";

interface Props {
  open: boolean;
  onClose: (value: boolean) => void;
}

const Modal: React.FC<Props> = ({ open, onClose, children }) => {
  return (
    <Transition.Root static show={open} as={Fragment}>
      <Dialog
        static
        as="div"
        className="fixed z-10 inset-0 select-none"
        onClose={onClose}
      >
        <div className="flex flex-col justify-center h-full pt-4 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="z-0 flex flex-col w-full h-full bg-white rounded-t-xl shadow-xl overflow-auto">
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
