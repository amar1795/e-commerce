"use client"
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CustomRadioButton from "./CustomRadiobutton";

export type Address = {
  street: string;
  apartment?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber?: string;
};

// Define the format function
export function formatAddress(address: Address): string {
  const { street, apartment, city, state, country, postalCode,phoneNumber } = address;
  return `${street}${apartment ? `, ${apartment}` : ""}, ${city}, ${state}, ${postalCode}, ${country}${
    phoneNumber ? `, ${phoneNumber}` : ""
  }`;
}

export function RadioGroupComponent({
  address,
  selectedAddress,
  onChange,
}: {
  address: Address[];
  selectedAddress?: Address;
  onChange: (address: Address) => void;
}) {

  
  const handleChange = (address: Address) => {
    // alert("Selected Address: " + formatAddress(address));
    if (onChange) {
      // console.log("Selected Address: ", formatAddress(address));
      onChange(address);
    }

  };

  return (
    <RadioGroup defaultValue=""  onChange={handleChange}>
      {address.map((address, index) => (
        <div className="flex items-center space-x-2">
          
          {/* <RadioGroupItem
            className=" h-[2rem] w-[2rem]"
            // checked={selectedAddress === address}
            id={index.toString()}
            value={formatAddress(address)}
          />
          <Label htmlFor={index.toString()} className=" text-[1.1rem]">
            {formatAddress(address)}
          </Label> */}
          <CustomRadioButton
          key={index}
          label={formatAddress(address)}
          checked={selectedAddress === address}
          onChange={() => handleChange(address)}
        />
        </div>
      ))}
    </RadioGroup>
  );
}
