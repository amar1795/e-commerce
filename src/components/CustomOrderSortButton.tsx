import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';

interface CustomButtonProps {
  initialButtonName: string;
  initialOptions: string[];
  
}

const CustomOrderSortButton: React.FC<CustomButtonProps> = ({ initialButtonName, initialOptions,setSortOrder,setFilterRating,Rating,resetFilter,resetSort,setResetFilter, }) => {

  useEffect(() => {
    if (resetFilter) {
      setButtonName(initialButtonName);
      setFilterRating(null);
      setResetFilter(false);
    }

    
  }, [resetFilter]); 

  const completeUrl = typeof window !== "undefined" ? window.location.href : "";

  const segments = completeUrl.split("/");
  // console.log("this is the segments",segments);

  let removeSegment = segments[segments.length - 2];
  // console.log("this is the removeSegment",removeSegment);

// Get the second segment from the path
let previousSegment = segments.length >= 3 ? segments[4] : '';
// Remove query string and hash from the segment
previousSegment = previousSegment?.split(/[?#]/)[0];

  // Check if the last character of previousSegment is '?' and remove it if true
  let sanitizedSegment;
  
  if(removeSegment === "orders"){
    sanitizedSegment=null;
  }else{
    sanitizedSegment = previousSegment?.endsWith('?') 
    ? previousSegment.slice(0, -1) 
    : previousSegment;
  }


  const [isOpen, setIsOpen] = useState(false);
  const [buttonName, setButtonName] = useState(initialButtonName);
  const [options, setOptions] = useState(initialOptions);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handleOptionClick = (option: string) => {
    if(Rating == true)
      {
        if (resetFilter) {
          // alert("resetFilter");
          // // setFilterRating(null);
          // setButtonName(`Filter by: RATING`);
        }
        else
        {
          setButtonName(`Filter by: ${option}`);
          if (option === "5 Star Rating") {
            setFilterRating(5);
        } else if (option === "4 Star Rating") {
            setFilterRating(4);
        } else if (option === "3 Star Rating") {
            setFilterRating(3);
        } else if (option === "2 Star Rating") {
            setFilterRating(2);
        } else if (option === "1 Star Rating") {
            setFilterRating(1);
        }
      
        }

      }
    else{

      if(resetSort)
        {
          // setSortOrder("desc");
          // setButtonName(`Sort by: ${option}`);
          
        }
     else
     {
      setButtonName(`Sort by: ${option}`);
      if (option === "New to Old"|| option === "Newest") {
        setSortOrder("desc");
      } else if (option === "Old to New" || option === "Oldest") {
        setSortOrder("asc");
      }
     }
    
    }
    setIsOpen(false);
  };



  return (
    <div className="h-[4rem] relative" ref={dropdownRef}>
      <button
        className="w-[15rem] below-566:w-[10rem] p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
        onClick={handleButtonClick}
      >
<h1 className="font-bold below-566:text-[0.8rem]">{buttonName}</h1>
</button>
      {isOpen && (
        <div className="absolute mt-2 w-[15rem] below-566:w-[10rem] bg-white border border-black text-black z-10">
          <ul>
            {options.map(option => (      
            <li
            key={option}
            onClick={() => handleOptionClick(option)}
            className="p-2 hover:bg-gray-200 cursor-pointer below-566:text-[0.8rem] flex justify-center"
          >
           {option}
          </li>
          
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomOrderSortButton;
