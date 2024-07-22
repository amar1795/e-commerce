import React from 'react';
import { Star } from 'lucide-react';

const colors = ['red', 'orange', 'green', 'pink', 'yellow'];

const StarComponent = ({ selected = false, index, onMouseEnter, onMouseLeave, onClick, hoverIndex,finalRating,reviewStars }) => {

  const getStrokeColorClass = () => {
    if (hoverIndex !== null) {
      if (hoverIndex >= index) {
        return colors[hoverIndex];
      }
    } else if (selected && hoverIndex === null) {
      return colors[finalRating ]; // Use finalRating to determine the color of clicked stars
    }
    return 'transparent';
  };

  return (
    <div
      className="cursor-pointer transition-transform transform hover:scale-150"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{ fontSize: '2rem' }}
    >
      <Star
        strokeWidth={1}
        size={60}
        fill={`${getStrokeColorClass()}`}
        // className={`fill-current ${getStrokeColorClass()}`}
      />
    </div>
  );
};

export default StarComponent;
