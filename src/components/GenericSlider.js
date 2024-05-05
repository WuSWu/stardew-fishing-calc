'use client'
import React from 'react';

const GenericSlider = ({ title, min, max, value, onChange, disabled, snapInterval=1 }) => {

    const snapValues = Array.from({length:max-min+1}, (_, index) => min + snapInterval*index);

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
        <div className="mb-4">
            <div className="flex flex-row items-center justify-between mb-2">
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-sm px-2">{value}</p>
            </div>
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
        </div>
    );
};

export default GenericSlider;