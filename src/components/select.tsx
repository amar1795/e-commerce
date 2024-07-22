
import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// 'priceAsc', 'priceDesc', 'discountAsc', 'discountDesc', 'ratingsAsc', 'ratingsDesc'
export function SelectDemo( {setSortBy}: {setSortBy: (value: string) => void} ) {
  const handleChange = (value:string) => {
    // console.log(event?.currentTarget);
    // const selectedValue = event?.currentTarget?.value;
    // setSortBy(selectedValue);
    // alert("Selected value: " + selectedValue+" "+event?.currentTarget);
    setSortBy(value);
  };
  return (
    
    <Select  onValueChange={handleChange}>
      <SelectTrigger className=" min-w-[50px] " >
        <SelectValue  className=" " placeholder="SORT BY" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* <SelectLabel> Fruits</SelectLabel> */}
          <SelectItem value="priceDesc">PRICE : high to low </SelectItem>
          <SelectItem value="priceAsc">PRICE :low to high</SelectItem>
          <SelectItem value="ratingsDesc">RATINGS:high to low </SelectItem>
          <SelectItem value="ratingsAsc">RATINGS:low to high </SelectItem>
          <SelectItem value="discountDesc">DISCOUNT:high to low </SelectItem>
          <SelectItem value="discountAsc">DISCOUNT:low to high </SelectItem>
          <SelectItem value="SORT asc">SORT BY:ASCENDING</SelectItem>
          <SelectItem value="SORT desc">SORT BY :DESCENDING</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
