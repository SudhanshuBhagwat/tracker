import React from "react";

interface Props {}

const Settings: React.FC<Props> = () => {
  return (
    <div className="h-full p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Settings</h2>
      </div>
    </div>
  );
};

export default Settings;
