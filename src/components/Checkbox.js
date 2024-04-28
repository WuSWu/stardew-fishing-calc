'use client'
import React from 'react';

const Checkbox = ({ id, label, checked, onChange, disabled }) => {
  return (
    <label className="flex items-center select-none cursor-pointer space-x-2">
      <input
        id={id}
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        className="form-checkbox h-5 w-5 text-blue-600"
      />
      <div>
        <span>{label}</span>
      </div>
    </label>
  );
};

export default Checkbox;
