
import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { EmblaOptionsType } from 'embla-carousel'
import  EmblaCarousel  from './EmblaCarousel'
import './productembla.css'
import { getProductsByCategory } from '@/actions/createProduct'

type Brand = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type Image = {
  url: string;
  altText?: string;
};

type Category = {
  id:string;
  name:string;
  parentId:string;
  parentName:string;
}

type Product = {
  id: string;
  name: string;
  price: number;
  brandId: string;
  discount: number | null;
  discountedPrice: number | null;
  description: string;
  categoryId: string;
  category: Category;
  isWishlisted: boolean;
  createdAt: Date;
  updatedAt: Date;
  brand: Brand;
  images: Image[];
};




const  ProductCarousel=async({SlideCount,cardData,category}:{SlideCount:number,cardData:Product[],category:string})=> {
    const OPTIONS: EmblaOptionsType = { dragFree: false, loop: false , slidesToScroll: 3, containScroll: "keepSnaps",watchSlides:true,align:"start"}
    const SLIDE_COUNT = SlideCount
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  return (
    <div>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} products={cardData} category={category}  />
    </div>
  )
}

export default ProductCarousel