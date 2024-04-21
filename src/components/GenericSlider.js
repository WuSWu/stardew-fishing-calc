'use client'
import React from 'react';

const GenericSlider = ({ min, max, value, onChange, disabled }) => {

  const snapValues = Array.from({length:16}, (_, index) => 0 + index);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    onChange(newValue);
  };

  const handleSnap = () => {
    const snappedValue = snapValues.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    onChange(snappedValue);
  };

  return (
    <div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={handleSliderChange}
        onMouseUp={handleSnap}
        onTouchEnd={handleSnap}
        className="slider"
      />
      <p>{value}</p>
    </div>
  );
};

export default GenericSlider;