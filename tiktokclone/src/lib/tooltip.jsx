import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const tooltipStyles = {
  tooltipContainer: {
    position: 'absolute',
    fontFamily: 'Arial',
    letterSpacing: '0.4px',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    marginLeft: '8px',
    width: '100px',
    textAlign: 'center',
  },
  tooltipContent: {
    whiteSpace: 'nowrap', // Prevents text from wrapping
    overflow: 'hidden', // Hides any content that overflows the container
    textOverflow: 'ellipsis', // Displays an ellipsis (...) to indicate overflow
  },
  tooltipText: {
    fontSize: '18px',
    lineHeight: '1.5',
    padding: '3px',
  },
};

const TooltipLink = ({ to, icon, text, tooltipText }) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <Link
      to={to}
      className='sb-links-wrapper'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isTooltipVisible && (
        <div style={tooltipStyles.tooltipContainer}>
          <div style={tooltipStyles.tooltipContent}>
            <p style={tooltipStyles.tooltipText}>{tooltipText}</p>
          </div>
        </div>
      )}

      <div className='sb-links-icon'>{icon}</div>
      <h2 className='sb-links-text active'>{text}</h2>
    </Link>
  );
};

export default TooltipLink;
