import React from 'react'

const SelectionSizeBox = ({size,color}) => {

  const sizeAbbreviations = {
    Small: "S",
    Medium: "M",
    Large: "L",
    "Extra Large": "XL",
    "Extra Extra Large": "XXL",
    "UK Size 28": "28",
    "UK Size 29": "29",
    "UK Size 30": "30",
    "UK Size 31": "31",
    "UK Size 32": "32",
    "UK Size 33": "33",
    "UK Size 34": "34",
    "UK Size 35": "35",
    "UK Size 36": "36",
    "UK Size 37": "37",
    "UK Size 38": "38",
    "UK Size 39": "39",
    "UK Size 40": "40",
    "UK Size 41": "41",
    "UK Size 42": "42",
    "UK Size 43": "43",
    "UK Size 44": "44",
    "UK Size 6": "6",
    "UK Size 7": "7",
    "UK Size 8": "8",
    "UK Size 9": "9",
    "UK Size 10": "10",
    "UK Size 11": "11",
    "UK Size 12": "12",
    "UK One Size": "One",
    "UK Kids 5-6": "5-6Y",
    "UK Kids 6-7": "6-7Y",
    "UK Kids 7-8": "7-8Y",
    "UK Kids 8-9": "8-9Y",
    "UK Kids 9-10": "9-10Y",
    "UK Kids 10-11": "10-11Y",
    "UK Kids 11-12": "11-12Y",
    "UK Kids 12-13": "12-13Y"
  };
  

    const circleStyle = (size) => ({
        borderRadius: "5%",
        width: "40px",
        height: "40px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "5px",
        cursor: "pointer",
        border: "2px solid black",
        color: "#EC4899",
        backgroundColor: color,
        fontSize: size?.includes("Kids") || size?.includes("One") ? "0.8rem" : "2rem", // Adjust font size conditionally
        hover: {
          backgroundColor: "#EAB308",
        },
      });
  return (
    <div>
      <div
              style={circleStyle(size)}
            >
              { sizeAbbreviations[size] || size && size[0]?.toUpperCase()}
            </div>
    </div>
  )
}

export default SelectionSizeBox
