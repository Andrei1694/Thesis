import React, { useState } from 'react';

export function Slider({value,onChange})  {
return (
    <div className="flex items-center">
      <input
        type="range"
        min="500"
        max="100000"
        value={value}
        onChange={onChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <span className="ml-4 text-gray-700 dark:text-white">{value}</span>
    </div>
  );
};

export default Slider;