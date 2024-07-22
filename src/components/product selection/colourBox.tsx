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
    <div>
      <div
            style={circleStyle() }
          ></div>
    </div>
  )
}

export default ColourBox
