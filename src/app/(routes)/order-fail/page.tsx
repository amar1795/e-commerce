"use client"
import React, { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
  const router = useRouter()


  useEffect(() => {
   setTimeout(() => {
    router.push('/cart')
    
   }, 2000);
  }, [])

  return (
    <div className=' h-screen'>
      <h1 className=' text-[5rem] text-red-700'> Order unsuccessfull Please try again </h1>
    </div>
  )
}

export default page
