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
                    <FaShoppingBag className=" below-400:w-4 below-400:h-4 w-7 h-7"/>
                        <span className=" font-mono bg-white w-5 h-5 rounded-full absolute top-0 left-6 below-400:left-4
                        below-400:w-4 below-400:h-4 below-400:text-[0.6rem] below-400:pt-[1px]">{dbCount >0 ? dbCount:cartCountData}</span>
                        
                        </div>
                    </div> 
        </div>
    )
}

export default ShoppingCart
