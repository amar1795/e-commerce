// "use client";

import OrderDetailsComponent from "@/components/order summary component/OrderDetailsComponent";
import React, { use, useEffect, useState } from "react";
import { getUserWishlist } from "@/actions/wishlist";
import { useCurrentUser } from "@/hooks/use-current-user";
import WishlistedProductCard from "@/components/Wishlisted product card/productCard";
import { toast } from "@/components/ui/use-toast";
import RemoveFromWishlist from "@/components/removeFromWishlist/RemoveFromWishlist";
import { auth } from "@/auth";


const page = async() => {
  const session = await auth();

  const user = session?.user?.id;

  const wishlist = await getUserWishlist(user);
 
  return (
    <div>

      <div className=" min-h-[95vh] bg-pink-500 ">
      <div className=" pt-4">
      <h1 className=" m-4  text-[4rem] leading-none p-2 border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">{wishlist.length >0 ? "Your Wishlisted Items":"You have not Wishlisted any items"}
             
             </h1>
      </div>
        {/* <h1 className=" text-[4rem] pl-10 uppercase">{wishlist.length >0 ? "Your Wishlisted Items":"You have not Wishlisted any items"}</h1> */}
        <div className=" px-8">
          <div className=" border-black border-b-4 "></div>
        </div>
        <div className=" flex flex-wrap px-11">
          <div className="flex  flex-wrap pl-3">
            {/* <OrderDetailsComponent /> */}
            
            <h1 className=" text-[4rem] pl-10 uppercase mt-20">{wishlist.length ==0 && "Please Wishlist the Product to see it here"}</h1>
            {wishlist?.map((product) => (
              <div className="py-4" key={product?.id}>
                <WishlistedProductCard product={product?.product}   />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
