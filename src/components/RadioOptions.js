`use client`
import React from 'react';
import styles from './Fadeout.module.css'

export const RadioOptions = ({ customIcon, label, checked, onChange, deselectedColor, selectedColor }) => {
  return (
    <div className={`${deselectedColor} relative flex items-center justify-center size-24 rounded-lg border-2 border-gray-400 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex justify-center w-full h-full items-center z-10 ${checked ? styles.fadeout.checked : styles.fadeout}`} />
      <label className="flex flex-col items-center select-none cursor-pointer space-y-1 p-2">
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
            className="block size-10 z-20"
            style={{imageRendering: 'pixelated'}}
          />
        )}
        <span className="text-center text-black leading-4 my-2 z-20">{label}</span>
      </label>
    </div>
  );
};

export const SmallOptions = ({ label, checked, onChange, deselectedColor, selectedColor }) => {
  return (
    <div className={`${deselectedColor} relative flex items-center justify-center rounded-lg border-2 border-gray-400 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex justify-center w-full h-full items-center z-10  ${checked ? styles.fadeout.checked : styles.fadeout}`} />
      <label className="flex flex-col items-center select-none cursor-pointer space-y-1 p-2">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <span className="text-center text-black leading-4 my-2 z-20 text-nowrap">{label}</span>
      </label>
    </div>
  );
};