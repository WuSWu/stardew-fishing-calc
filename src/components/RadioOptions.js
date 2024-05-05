`use client`
import React from 'react';
import styles from './Fadeout.module.css'

export const RadioOptions = ({ customIcon, label, checked, onChange, deselectedColor, selectedColor }) => {
  return (
    <div className={`${deselectedColor} relative flex items-center justify-center size-24 rounded-lg border-2 border-gray-400 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-full z-1 ${checked ? styles.fadeout.checked : styles.fadeout}`} />
      <label className="flex flex-col size-full justify-center items-center select-none cursor-pointer space-y-1 p-1">
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
            className="block size-10 z-2"
            style={{imageRendering: 'pixelated'}}
          />
        )}
        <span className="text-center text-sm text-black leading-4 z-2">{label}</span>
      </label>
    </div>
  );
};

export const SmallOptions = ({ label, checked, onChange, deselectedColor, selectedColor}) => {
  return (
    <div className={`${deselectedColor} relative flex items-center justify-center rounded-lg border-2 border-gray-400 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-full z-1  ${checked ? styles.fadeout.checked : styles.fadeout}`} />
      <label className="flex flex-col size-full justify-center items-center select-none cursor-pointer p-1">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <span className="text-center text-sm text-black leading-4 z-2 text-nowrap">{label}</span>
      </label>
    </div>
  );
};

export const BranchingOptions = ({ customIcon, label, checked, onChange, deselectedColor, selectedColor, children }) => {
  return (
    <div className={`${deselectedColor} rounded-lg border-2 w-24 border-gray-400`}>
      <div className={`relative flex items-center justify-center h-24 z-0 overflow-hidden`}>
        <div className={`${selectedColor} absolute flex size-full z-1 ${checked ? styles.fadeout.checked : styles.fadeout}`} />
        <label className="flex flex-col size-full justify-center items-center select-none cursor-pointer space-y-1 p-1">
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
              className="block size-10 z-2"
              style={{imageRendering: 'pixelated'}}
            />
          )}
          <span className="text-center text-sm text-black leading-4 z-2">{label}</span>
        </label>
      </div>
      <div>
        {children}
      </div>
    </div>
    
  );
};

export const ChildrenOptions = ({ label, checked, onChange, selectedColor}) => {
  return (
    <div className={`relative flex items-center justify-center border-t-2 border-gray-300 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-full z-1  ${checked ? styles.fadeout.checked : styles.fadeout}`} />
      <label className="flex flex-col size-full justify-center items-center select-none cursor-pointer p-1">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="hidden"
        />
        <span className="text-center text-sm text-black leading-4 z-2 text-nowrap">{label}</span>
      </label>
    </div>
  );
};