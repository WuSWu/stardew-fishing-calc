`useclient`
import React from 'react';

const RadioOptions = ({ customIcon, label, checked, onChange, selectedColor }) => {
  return (
    <div
        className={`flex items-center justify-center w-24 h-24 border border-gray-400 ${
          checked ? selectedColor : 'bg-white'
        }`}
      >
      <label className="flex flex-col items-center cursor-pointer space-y-1">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        {customIcon && (
          <img 
            src={customIcon}
            alt={label}
            className="block w-10 h-10"
            style={{imageRendering: 'pixelated'}}
          />
        )}
        <span className="text-center leading-4 ml-2 mr-2">{label}</span>
      </label>
    </div>
  );
};

export default RadioOptions;
