"use client"
import React, { useContext, useState } from 'react'
import styles from "./page.module.css"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from 'lucide-react'

const CustomThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  // console.log("this is the theme",theme)
  
    const toggle=()=>{
        setTheme(theme==="light"?"dark":"light")
    }

   

  return (
   <div className=' relative'>
    <button className="w-[6rem] p-2 border-2 border-black text-black flex self-center justify-between border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500" onClick={toggle}>
              <MoonIcon size={25} fill="black" />
              <SunIcon size={25} fill="black"/>
    </button>
    <div className={`absolute top-[1.5px] ${theme === 'light' ? 'right-[2px]' : 'left-[2px]'} bg-pink-500 h-[2.6rem] w-[2.8rem] transition-transform duration-300 `}
></div>
   </div>
    

  )
}

export default CustomThemeToggle
