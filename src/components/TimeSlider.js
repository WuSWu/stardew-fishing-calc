'use client'
import React from 'react';

const TimeSlider = ({ value, onChange, disabled }) => {

  const snapValues = Array.from({length:20}, (_, index) => 600 + index * 100);
  snapValues.forEach((e) =>
    {for (let i = 1; i < 6; i++){
      snapValues.push(Math.floor(e+100*i/6))
    }}
  );
  snapValues.push(2599)

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

  const convertToTime = (value) => {
    var hours = Math.floor(value / 100);
    var tenMinutes = Math.round(0.6*(value/10 % 10));
    if (tenMinutes == 6) tenMinutes -=1 ;
    var timeValue;

    if (hours > 0 && hours <= 11) {
      timeValue = "" + hours;
      timeValue += ":" + tenMinutes + "0"
      timeValue += " AM";
    } else if (hours === 12) {
      timeValue = "" + hours;
      timeValue += ":" + tenMinutes + "0"
      timeValue += " PM";
    } else if (hours > 12 && hours <= 23) {
      timeValue = "" + (hours - 12);
      timeValue += ":" + tenMinutes + "0"
      timeValue += " PM";
    } else if (hours === 24) {
      timeValue = "" + (hours - 12);
      timeValue += ":" + tenMinutes + "0"
      timeValue += " AM";
    } else if (hours > 24) {
      timeValue = "" + (hours - 24);
      timeValue += ":" + tenMinutes + "0"
      timeValue += " AM";
    }
    return timeValue;
  };

  return (
    <div>
      <input
        type="range"
        min={600}
        max={2599}
        value={value}
        disabled={disabled}
        onChange={handleSliderChange}
        onMouseUp={handleSnap}
        onTouchEnd={handleSnap}
        className="slider"
      />
      <p>{convertToTime(value)}</p>
    </div>
  );
};

export default TimeSlider;