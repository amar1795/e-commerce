import React from 'react'
import './button.css'

type StyledButtonProps = {
    buttonName: string;
}

const StyledButton = ({buttonName}:StyledButtonProps) => {
  return (
    <button type='submit' id="special-button" className="relative overflow-hidden w-full py-4 text-white  font-bold bg-black group below-700:w-[30rem]">
    <div className="absolute inset-0 w-full h-full bg-white transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0 "></div>
    <span className="relative z-10 ">{buttonName}</span>
  </button>
  )
}

export default StyledButton
