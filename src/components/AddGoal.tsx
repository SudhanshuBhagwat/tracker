import React from "react";
import Modal from "./Modal";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AddGoal: React.FC<Props> = ({ isOpen, setIsOpen }) => {
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
      </div>
    </Modal>
  );
};

export default AddGoal;
