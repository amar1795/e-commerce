import React from 'react';
import './tick.css';

const TickAnimation = () => {
  return (
    <div className="tick-container">
      <svg viewBox="0 0 100 100" className="tick-svg">
        <circle cx="50" cy="50" r="40" className="tick-circle" />
        <path
          className="tick-path"
          d="M30 50 L45 65 L70 35"
          stroke="#EC4899"
          strokeWidth="6"
          fill="transparent"
        />
      </svg>
    </div>
  );
};

export default TickAnimation;
