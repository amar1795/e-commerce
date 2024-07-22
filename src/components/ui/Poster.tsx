import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './button'
import Link from 'next/link'
  
const Poster = () => {
  return (
    <div>
        <Link href="/">
        <Card className=' bg-red-500 mx-6 h-[65vh]'>
            <CardHeader >
            <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
            <CardDescription className=' text-white'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </CardDescription>
            </CardContent>
            <CardFooter>
            <button className="btn">Read More</button>
            </CardFooter>
        </Card>
        </Link>
    </div>
  )

}
export default Poster
