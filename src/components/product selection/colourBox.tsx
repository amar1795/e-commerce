import React from 'react'

const ColourBox = ({color}) => {

    const circleStyle = () => ({
        backgroundColor: color,
        borderRadius: '5%',
        width: '30px',
        height: '30px',
        display: 'inline-block',
        margin: '5px',
        cursor: 'pointer',
        border: '2px solid black',       
      });

  return (
    <div className="m-1">
      <div
        className={`inline-block  w-8 h-8 below-700:w-5  below-700:h-5 border-2 border-black cursor-pointer`}
        style={{ backgroundColor: color }}
      ></div>
    </div>
  )
}

export default ColourBox
