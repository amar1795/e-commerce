import React from 'react'
import './button.css'

type StyledButtonProps = {
    buttonName: string;
}

const StyledButton = ({buttonName,AddWalletBalance}:StyledButtonProps) => {



  return (
    <button type='submit' onClick={AddWalletBalance} id="special-button" className="relative overflow-hidden w-full py-4 text-white  font-bold bg-black group below-700:w-[30rem] below-730:w-[20rem] below-590:w-[18rem] below-460:w-[15rem] below-400:w-[12rem]">
    <div className="absolute inset-0 w-full h-full bg-white transform -translate-x-full transition-transform duration-500 ease-in-out group-hover:translate-x-0 uppercase  "></div>
    <span className="relative z-10 ">{buttonName}</span>
  </button>
  )
}

export default StyledButton
