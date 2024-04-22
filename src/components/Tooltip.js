import React, { useState } from 'react';
import styles from './Tooltip.module.css'; // Import CSS file for styling

const Tooltip = ({ id, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={styles.tooltipcontainer}>
      <span
        className={styles.icon}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        ℹ️
      </span>
      {isHovered && (
        <div className={styles.tooltip} id={`tooltip-${id}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Tooltip;