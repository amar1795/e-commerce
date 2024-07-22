"use client";
import decreaseProductQuantity from "@/actions/cart/decreaseProduct";
import deleteCartItem from "@/actions/cart/deleteCartProducts";
import increaseProductQuantity from "@/actions/cart/increaseProduct";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DollarSign, Heart, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";

const CheckOutOrderSuccessCard = ({
  quantity,
  product,
  handleQuantityChange,
  handleClickDelete,
}) => {
  // console.log("this is the updated products", updatedProducts);
  const user = useCurrentUser();

  // Assuming the product object has cartItems array and we are getting the quantity from it
  // const quantity =
  //   product?.cartItems?.find((item) => item.productId === product.id)
  //     ?.quantity || 0;

  return (
    <div>
      <div className=" border-2 border-black border-b-8 border-r-4  overflow-hidden ">
        <div className=" overflow-hidden flex justify-between bg-opacity-20 backdrop-blur-lg border border-white/30 bg-white  ">
          <div className=" flex">
            <div>
              <Image
                width={150}
                height={100}
                objectFit="cover"
                src={product?.images[0].url}
                alt=""
                className=" h-[11rem] w-[10rem] object-cover  px-2 py-4 transform transition-transform duration-300 hover:scale-110 "
              />
            </div>
            <div className=" price py-4">
              <div>
                <span className=" text-[1.2rem]  font-bold">NAME :</span>{" "}
                <span>
                  <span className=" self-center  text-[1.2rem] ">
                    
                    {product?.name.length > 36
                  ? product?.name.slice(0, 40) + "..."
                  : product?.name}{" "}
                  </span>
                </span>
              </div>
              <div>
                <span className=" text-[1.2rem] font-bold">BRAND :</span>{" "}
                <span>
                  <span className=" self-center  text-[1.2rem] ">
                  
                    {product?.brand?.name }
                  </span>
                </span>
              </div>
              <div>
                <span className=" text-[1.2rem] font-bold">COLOUR :</span>{" "}
                <span>
                  <span className=" self-center  text-[1.2rem] ">
                    {`
                        BLACK `}
                    {/* {product?.name.length > 36
                  ? product?.name.slice(0, 40) + "..."
                  : product?.name}{" "} */}
                  </span>
                </span>
              </div>
              <div>
                <span className=" text-[1.2rem] font-bold">SIZE</span>{" "}
                <span>
                  <span className=" self-center  text-[1.2rem] ">
                    {`
                       LARGE `}
                    {/* {product?.name.length > 36
                  ? product?.name.slice(0, 40) + "..."
                  : product?.name}{" "} */}
                  </span>
                </span>
              </div>
              <div>
                <span className=" text-[1.2rem] font-bold">QTY :</span>{" "}
                <span>
                  <span className=" self-center  text-[1.2rem] ">
                  {
                    quantity
                  }
                  </span>
                </span>
              </div>
           
            
            </div>
          </div>
          <div className="  w-[6rem] px-2 self-center h-[5rem]  mr-10">
            <div className="">
              <div className=" flex self-center py-2 ">
                <h1 className=" text-[1.3rem] self-center">
                  {product?.discountedPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutOrderSuccessCard;
