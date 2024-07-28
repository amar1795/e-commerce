"use client"
import React, { use, useEffect } from "react";
import Checkboxes from "./checkboxes";
import { SearchBox } from "../searchbox";

function getMinMaxPrice(ranges) {
  if (ranges.length === 0) {
    return { minPrice: 0, maxPrice: 100000 };
  }

  let minPrice = Infinity;
  let maxPrice = -Infinity;
  let above8000Selected = false;

  ranges.forEach(range => {
    let min, max;
    if (range.includes('Above')) {
      above8000Selected = true;
      min = 8000;
      max = 10000000;
    } else {
      [min, max] = range.split('-').map(price => parseInt(price.replace(/[^0-9]/g, ''), 10));
    }
    if (min < minPrice) minPrice = min;
    if (max > maxPrice) maxPrice = max;
  });

  if (above8000Selected) {
    return { minPrice: 8000, maxPrice: 10000000 };
  }

  return { minPrice, maxPrice };
}


interface Category {
  category: string;
  options: { label: string; value: string,min:number,max:number }[];
  setSelectedCategoryName: (name: string) => void;
    setBrandName: (name: string) => void;
    setMinDiscountedPrice: (price: number) => void;
    setMaxDiscountedPrice: (price: number) => void;
    setMinDiscountPercentage: (percentage: number) => void;
    setMaxDiscountPercentage: (percentage: number) => void;
    setBrandSelected: (selected: boolean) => void;
}

const Fcard: React.FC<{ category: Category }> = ({
  category,
  setBrandName,
  setSelectedCategoryName,
  setMinDiscountedPrice,
  setMaxDiscountedPrice,
  setMinDiscountPercentage,
  setMaxDiscountPercentage,
  setBrandSelected
}) => {
  if(category.category === "Price"){
    // console.log("this is the price category selected", category);
  }
// console.log("this is the mindiscountedprice and maxdiscountedprice", setMinDiscountedPrice, setMaxDiscountedPrice)
  const [tempState, setTempState] = React.useState([])
  // console.log("this is the temp state", tempState)

  const { minPrice, maxPrice } = getMinMaxPrice(tempState);
  // console.log(`this is the Min price: ₹${minPrice} and this is the Max price: ₹${maxPrice}`);

  useEffect(() => {
    setMinDiscountedPrice(minPrice);
    setMaxDiscountedPrice(maxPrice);
  }, [minPrice, maxPrice]);

  return (
    <div className="mt-4 pb-2 border-b">
      <div className="heading font-bold flex flex-col">
      <div className=" h-[4rem]">
            <h1 className="w-40  p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4  bg-pink-500 font-bold below-445:text-[0.8rem] uppercase below-445:w-28">
            {category.category}
            </h1>
          </div>
        {/* <div>{category.category}</div> */}
        {/* <div className=" py-2 w-[10rem]">
          <SearchBox />
        </div> */}
      </div>
      <div className="checkboxes">
        {category.options.map((option, index) => (
          
          <Checkboxes
          setTempState= {setTempState}
          setBrandSelected={setBrandSelected}
          parentCategory={category.category}
            key={index}
            label={option.label}
            value={option.value}
            min={option?.min}
            max={option?.max}
            setSelectedCategoryName={setSelectedCategoryName}
            setBrandName={setBrandName}
            // setMinDiscountedPrice={setMinDiscountedPrice}
            // setMaxDiscountedPrice={setMaxDiscountedPrice}
            setMinDiscountPercentage={setMinDiscountPercentage}
            setMaxDiscountPercentage={setMaxDiscountPercentage}
          />
        ))}
      </div>
    </div>
  );
};

export default Fcard;
