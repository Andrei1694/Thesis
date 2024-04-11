import React, { useState } from "react";

function Slider({ value, handleInputChange }) {
  //   const [value, setValue] = useState(50);

  const handleChange = (event) => {
    const { value } = event.target;
    // setValue(value);
    handleInputChange(value);
  };

  return (
    <div className="w-64">
      <input
        type="range"
        min="1000"
        max="10000"
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
        <span>1000</span>
        <span>{value}</span>
        <span>10000</span>
      </div>
    </div>
  );
}

export default Slider;
