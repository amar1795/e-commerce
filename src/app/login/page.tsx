"use client"
import Signup from "@/components/Signup";
import Login from "@/components/login";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const page = () => {
  const [isSignup, setIsSignup] = React.useState(false);

 // Function to toggle between signup and login
 const toggleView = () => {
  setIsSignup((prev) => {
    const newState = !prev;
    // Save the new state to local storage
    localStorage.setItem('isSignup', JSON.stringify(newState));
    return newState;
  });
};

// Use useEffect to read the state from local storage when the component mounts
useEffect(() => {
  const savedState = localStorage.getItem('isSignup');
  if (savedState !== null) {
    setIsSignup(JSON.parse(savedState));
  }
}, []);



  return (
    <div className=" min-h-screen bg-gradient-to-r from-purple-700 via-pink-700 to-red-700 animate-wave bg-[length:200%_200%] flex justify-center items-center ">
      <div className="min-h-[38rem] w-[70rem] flex justify-center bg-opacity-20 backdrop-blur-lg border-2 border-black bg-white  overflow-hidden">
        <div className=" relative  w-[30rem] border-r-2 border-black ">
          <Image
            src="/6.jpg"
            alt="Logo"
            layout="fill"
            className=" object-cover"
          />
        </div>
        <div className=" flex-1">
        {isSignup ? <Signup toggleView={toggleView} setIsSignup={setIsSignup} /> : <Login toggleView={toggleView} />}

        </div>
      </div>
    </div>
  );
};

export default page;
