// ColorSpan.js
import React from 'react';

const ColorSpan = ({ color }) => {
  return (
    <span 
      style={{
        display: 'inline-block',
        width: '20px',
        height: '20px',
        backgroundColor: color,
        borderRadius: '50%',
        verticalAlign: 'middle',
        marginLeft: '5px', // Optional: add some space between the circle and the text
      }}
    ></span>
  );
};



export default ColorSpan;
