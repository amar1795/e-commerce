// CustomRadioButton.tsx
import React, { useState } from "react";

interface CustomRadioButtonProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  label,
  checked,
  onChange,
}) => {
  const handleClick = () => {
    onChange();
  };

  return (
    <div
      className="flex items-center space-x-2 cursor-pointer  "
      onClick={handleClick}
    >

      <div className=" flex  mb-3">
      <div className="w-6 h-6  border rounded-full flex items-center justify-center border-black">

<div
className={`w-4 h-4  border rounded-full flex items-center justify-center border-transparent ${
  checked
  ? "bg-pink-600 border-black"
  : ""
  }`}
  >
{/* {checked && <CheckIcon className="w-3 h-3 text-white" />} */}
</div>
</div>
<span className=" text-[1.1rem] pl-2">{label}</span>
      </div>
    </div>
  );
};

export default CustomRadioButton;
