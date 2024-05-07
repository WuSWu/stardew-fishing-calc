`use client`
import React, { useState } from 'react';
import styles from './Fadeout.module.css'

export const RadioOptions = ({ customIcon, label, checked, onChange, deselectedColor, selectedColor }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`${deselectedColor} relative flex items-center justify-center size-24 rounded-lg border-2 border-gray-400 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-[150%] rounded-full z-1 ${checked ? styles.fadeout.checked : hovered ? styles.hovered : styles.fadeout}`}/>
      <label
        className="flex flex-col size-full justify-center items-center select-none cursor-pointer space-y-1 p-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`${deselectedColor} relative flex items-center justify-center rounded-lg border-2 border-gray-400 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-[150%] rounded-full z-1  ${checked ? styles.fadeout.checked : hovered ? styles.hovered : styles.fadeout}`}/>
      <label
        className="flex flex-col size-full justify-center items-center select-none cursor-pointer space-y-1 p-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`${deselectedColor} rounded-lg border-2 w-24 border-gray-400`}>
      <div className={`relative flex items-center justify-center h-24 z-0 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-[150%] rounded-full z-1 ${checked ? styles.fadeout.checked : hovered ? styles.hovered : styles.fadeout}`}/>
      <label
        className="flex flex-col size-full justify-center items-center select-none cursor-pointer space-y-1 p-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`relative flex items-center justify-center border-t-2 border-gray-300 overflow-hidden`}>
      <div className={`${selectedColor} absolute flex size-[150%] rounded-full z-1  ${checked ? styles.fadeout.checked : hovered ? styles.hovered : styles.fadeout}`} />
      <label
        className="flex flex-col size-full justify-center items-center select-none cursor-pointer space-y-1 p-1"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
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