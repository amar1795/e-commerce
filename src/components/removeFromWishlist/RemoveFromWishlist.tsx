import React from 'react'
import { removeFromWishlist } from '@/actions/wishlist'
import { revalidatePath } from 'next/cache';

interface RemoveFromWishlistProps {
  userId: string;
  productId: string;
}

const RemoveFromWishlist = async({ userId, productId }: RemoveFromWishlistProps) => {

 await removeFromWishlist(userId, productId)
 revalidatePath('/wishlist')
  return (
        
    
    <div>
      
    </div>
  )
}

export default RemoveFromWishlist
