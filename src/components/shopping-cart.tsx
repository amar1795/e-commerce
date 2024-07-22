import { getCartDataFromCookies } from '@/actions/cart/addCartDatatoCookies';
import { fetchAllCartCookieData } from '@/actions/cart/fetchAllCartCookieData';
import React, { useEffect, useState } from 'react'
import { FaShoppingBag } from "react-icons/fa";

const ShoppingCart = ({mensCollectionData,cartCountData}) => {
    
    const dbCount=mensCollectionData[0]?.totalUniqueCartItems;

    return (
        <div>
             <div className=" flex text-center">
                    <div className=" flex justify-between items-center mr-5 relative">
                    <FaShoppingBag size={23}/>
                        <span className=" font-mono bg-white w-5 h-5 rounded-full absolute top-0 left-6">{dbCount >0 ? dbCount:cartCountData}</span>
                        
                        </div>
                    </div> 
        </div>
    )
}

export default ShoppingCart
