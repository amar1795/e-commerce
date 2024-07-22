import React from 'react'
import { Heart } from 'lucide-react';

const WishingListIcon = ({mensCollectionData}) => {
  return (
    <div>
      <div className=" pr-3 relative ">

    <Heart fill='black' />
    {mensCollectionData[0]?.totalWishlistCount >0 && (<span className=" font-mono bg-white w-5 h-5 rounded-full absolute top-0 left-5">{mensCollectionData[0]?.totalWishlistCount}</span>)}

  </div>
    </div>
  )
}

export default WishingListIcon
