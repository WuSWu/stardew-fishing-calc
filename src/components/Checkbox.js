`useclient`
import React from 'react';

const Checkbox = ({ id, label, checked, onChange, disabled }) => {
  return (
    <label className="flex items-center cursor-pointer space-x-2">
      <input
        id={id}
        type="checkbox"
        onChange={onChange}
        checked={checked}
        disabled={disabled}
        className="form-checkbox h-5 w-5 text-blue-500"
      />
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
