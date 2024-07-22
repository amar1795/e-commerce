import React, { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { getProductsByCategory } from '@/actions/createProduct';

interface CheckboxesProps {
    label: string;
    value: string;
    qty: number;
    min: number;
    max: number;
    parentCategory: string;
    setSelectedCategoryName : (name: string) => void; 
    setBrandName : (name: string) => void;
    setMinDiscountedPrice : (price: number) => void;
    setMaxDiscountedPrice : (price: number) => void;
    setMinDiscountPercentage : (percentage: number) => void;
    setMaxDiscountPercentage : (percentage: number) => void;
    setBrandSelected : (selected: boolean) => void;
  }

const Checkboxes:React.FC<CheckboxesProps> = ({ label, value, qty,setSelectedCategoryName,
  min,
  max,
  parentCategory,
  setBrandName,
  setMinDiscountedPrice,
  setMaxDiscountedPrice,
  setMinDiscountPercentage,
  setMaxDiscountPercentage,
  setBrandSelected,
  setTempState
  }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxClick = () => {
    console.log("this is the maximum and the minimum value of the checkbox", min, max,value)
    // alert(`${label} checkbox clicked. New checked state: ${!isChecked} and this is the parentcategory: ${parentCategory} and this is min: ${min} and this is max: ${max}`)
    const newCheckedState = !isChecked;
    setIsChecked(!isChecked);
    if (parentCategory === "Brand") {
      setBrandName(prevBrands => {
        if (newCheckedState) {
          // Add the new brand if checked
          setBrandSelected(true);
          return [...prevBrands, label];
        } else {
          // Remove the brand if unchecked
          const updatedBrands = prevBrands.filter(brand => brand !== label);
          // Check if any brand is still selected
          const anyBrandSelected = updatedBrands.length > 0;
          setBrandSelected(anyBrandSelected);
          return updatedBrands;
        }
      });
    } else if (parentCategory === "Category") {
      // setSelectedCategoryName(newCheckedState ? label : "");
      setSelectedCategoryName(prevCategories => {
        if (newCheckedState) {
          console.log("this is the new category", prevCategories);
          // Add the new category if checked
          return [...prevCategories, label];
        } else {
          // Remove the category if unchecked
          return prevCategories.filter(category => category !== label);
        }
      });
    } else if (parentCategory === "Discount") {
      // Assuming min and max are already defined in the component state
      if (newCheckedState) {
        setMinDiscountPercentage(min);
        setMaxDiscountPercentage(max);
      } else {
        setMinDiscountPercentage(0);
        setMaxDiscountPercentage(100);
      }
    } else if (parentCategory === "Price") {
     
      setTempState(prevState => {
        if (newCheckedState) {
          // Add the new category if checked
          return [...prevState, label];
        } else {
          // Remove the category if unchecked
          return prevState.filter(category => category !== label);
        }
      });
  
    }
    
  };

  return (
    <div>
      <div className='box mt-2 mb-2'>
            <div className=' flex '>
            <div className=' pr-5 flex self-center '>
            <Checkbox checked={isChecked} onClick={handleCheckboxClick} />
            </div>
            <h1 className=' uppercase'>
            {label} 
            </h1>
            </div>
           
        </div>
    </div>
  )
}

export default Checkboxes
