import React, { useState } from 'react';
import styles from './Tooltip.module.css';

const Tooltip = ({ id, img, hoverArea, tooltip, direction }) => {
  const [isHovered, setIsHovered] = useState(false);
  var tooltipstyle = null
  switch(direction){
    case "top": 
      tooltipstyle = styles.tooltiptop;
      break;
    case "right": 
      tooltipstyle = styles.tooltipright;
      break;
    case "left": 
      tooltipstyle = styles.tooltipleft;
      break;
    case "bottom": 
      tooltipstyle = styles.tooltipbottom;
      break;
    default:
      tooltipstyle = styles.tooltiptop;
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={`${styles.tooltipcontainer} ${(!img) ? "w-full" : ""}`}>
      <span
        className={styles.icon}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {hoverArea}
        {img && (
          <img
            src={img}
            alt={"tooltip"}
            className="block size-6"
            style={{imageRendering: 'pixelated'}}
          />
        )}
      </span>
      {isHovered && (
        <div className={tooltipstyle} id={`tooltip-${id}`}>
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default Tooltip;