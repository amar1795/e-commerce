import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { EmblaOptionsType } from 'embla-carousel'
import  EmblaCarousel  from './EmblaCarousel'
import './embla.css'
import { getAllPosters } from '@/actions/posterAction'


const Testcarousel= async()=> {
  const posterData= await getAllPosters();
  // console.log("this is the posters data", posterData)
  // console.log("this is Imagedata before passing the props",  imageData)
    const OPTIONS: EmblaOptionsType = { dragFree: false, loop: true }
    const SLIDE_COUNT = 5
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  return (
    <div>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} posterData={posterData}   />
    </div>
  )
}

export default Testcarousel