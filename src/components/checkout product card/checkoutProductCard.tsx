"use client";
import decreaseProductQuantity from "@/actions/cart/decreaseProduct";
import deleteCartItem from "@/actions/cart/deleteCartProducts";
import increaseProductQuantity from "@/actions/cart/increaseProduct";
import { useCurrentUser } from "@/hooks/use-current-user";
import { DollarSign, Heart, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import ColourBox from "../product selection/colourBox";
import SelectionSizeBox from "../product selection/selectionBox";
import { useCheckoutStock } from "@/state hooks/product-checkout-stock";
import { getProductDetailsByID } from "@/actions/product/searchedProductData";
import Link from "next/link";

const CheckoutProductCard = ({
  size,
  color,
  product,
  handleQuantityChange,
  handleClickDelete,
}) => {
  const [url, setUrl] = useState("");

  useEffect(() => {
    // alert("product card use effect is being called")
    if (
      product &&
      Array.isArray(product.cartItems) &&
      product.cartItems.length > 0
    ) {
      const cartItem = product.cartItems[0];
      if (cartItem?.productVarientStock) {
        // setQuantities(cartItem.quantity,cartItem.productVarientStock);
        setTempQuantity(cartItem.quantity);
        setVarientStock(cartItem.productVarientStock);
      }
    }
    // else
    // {
    //   setTempQuantity(1);
    //   setVarientStock(100);
    // }
  }, [product]);

  // console.log("this is the updated products", product);

  const [tempQuantity, setTempQuantity] = useState(0);
  const [varientStock, setVarientStock] = useState(0);

  const user = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductDetailsByID(product.id);
      // console.log("this is the fetched data", data);
      if (data) {
        let { parentCategory, topmostParentCategory } = data?.parentCategoryIds;

        const productId = data?.productId || "";
        if (parentCategory === "Kids Category") {
          parentCategory = "Kids";
        }

        const cleanedCategory0 = parentCategory.replace(/\s+/g, "");
        const testUrl = `/categories/${topmostParentCategory}/${cleanedCategory0}/${productId}`;
        // console.log("this is the test url", testUrl);
        setUrl(testUrl);
      }
    };

    fetchData();
  }, [product]);

  const handleDecrease = () => {
    // if (tempQuantity == 1) {
    //   return;
    // }

    // setTempQuantity((prev) => prev - 1);

    // the below needs to be done when the product is finalized and clicked on proceed to buy

    if (product?.cartQuantity == 1) {
      return;
    }

    handleQuantityChange(user?.id, product?.id, -1);
  };

  const handleIncrease = () => {
    // alert(tempQuantity)

    // alert(varientStock)

    // if (product?.cartQuantity > varientStock - 1) {
    //   return;
    // }

    // if (tempQuantity > varientStock - 1) {
    //   return;
    // }

    if (product?.cartQuantity > product?.stock - 1) {
      return;
    }

    // if (tempQuantity > product?.stock - 1) {
    //   return;
    // }

    // setTempQuantity((prev) => prev + 1);

    handleQuantityChange(user?.id, product?.id, 1);
  };

  // Assuming the product object has cartItems array and we are getting the quantity from it
  const quantity =
    product?.cartItems?.find((item) => item.productId === product.id)
      ?.quantity || 0;

  return (
    <div className=" flex justify-center below-695:flex below-695:flex-col ">
      <div className="below-700:w-[30rem] below-695:w-[25rem] below-460:w-[20rem] below-400:w-[18rem] below-370:w-[14rem] border-2 border-black border-b-8 border-r-4  overflow-hidden  ">
        <div className=" below-460:flex below-460:flex-col overflow-hidden flex justify-between bg-opacity-20 backdrop-blur-lg border border-white/30 bg-white  ">
          <div className=" flex ">
            <div>
              <Link href={url}>
                <Image
                  width={150}
                  height={100}
                  objectFit="cover"
                  src={product?.images[0].url}
                  alt=""
                  className=" h-[11rem] w-[10rem] object-cover  px-2 py-4 transform transition-transform duration-300 hover:scale-110  "
                />
              </Link>
            </div>
            <div className=" price py-4 ">
              <h1 className=" self-center px-2  text-[1.2rem] below-700:text-[1rem] below-695:text-[0.8rem] ">
                <span className=" font-bold ">NAME:</span>{" "}
                {product?.name.length > 36
                  ? product?.name.slice(0, 40) + "..."
                  : product?.name}
              </h1>
              <h1 className="  px-2 text-[1.2rem]  below-700:text-[1rem] below-695:text-[0.8rem] uppercase">
                <span className=" font-bold">BRAND : </span>
                {product?.brand?.name}
              </h1>

              {product?.cartItems && product?.cartItems[0]?.productSize ? (
                <div className="  px-2 text-[1.2rem]  below-700:text-[1rem] below-695:text-[0.8rem] uppercase flex self-center">
                  <span className=" font-bold self-center">SIZE:</span>
                  {/* {product?.cartItems[0]?.productSize} */}
                  {/* <SelectionSizeBox size={product?.cartItems[0]?.productSize} color={product?.cartItems[0]?.productColour} /> */}
                  <SelectionSizeBox size={size} color={color} />
                </div>
              ) : (
                <div className="  px-2 text-[1.2rem]  below-700:text-[1rem] below-695:text-[0.8rem] uppercase flex self-center">
                  <span className=" font-bold self-center">SIZE:</span>
                  {/* {product?.cartItems[0]?.productSize} */}
                  {/* <SelectionSizeBox size={product?.cartItems[0]?.productSize} color={product?.cartItems[0]?.productColour} /> */}
                  <SelectionSizeBox size={size} color={color} />
                </div>
              )}

              {product?.cartItems && product?.cartItems[0]?.productColour ? (
                <div className="  px-2 text-[1.2rem]  below-700:text-[1rem] below-695:text-[0.8rem] uppercase flex self-center">
                  <span className=" font-bold mt-1">COLOUR:</span>
                  {/* {product?.cartItems[0]?.productColour} */}
                  {/* when the user is signed in */}
                  {/* <ColourBox color={product?.cartItems[0]?.productColour} /> */}
                  <ColourBox color={color} />
                </div>
              ) : (
                <div className="  px-2 text-[1.2rem] uppercase flex self-center  below-700:text-[1rem] below-695:text-[0.8rem]">
                  <span className=" font-bold mt-1">COLOUR:</span>
                  {/* {product?.cartItems[0]?.productColour} */}
                  {/* when the user is signed in */}
                  {/* <ColourBox color={product?.cartItems[0]?.productColour} /> */}
                  <ColourBox color={color} />
                </div>
              )}

              <div>
                <div>
                  <div className="box flex pr-4 px-2 below-695:hidden">
                    <span className=" font-bold text-[1.2rem]  below-700:text-[1rem] below-695:text-[0.8rem]">
                      QUANTITY :
                    </span>
                    <button className=" pr-2  hover:bg-gray-200 pl-1">
                      <Minus size={20} onClick={handleDecrease} />
                    </button>
                    <div className=" text-[1.5rem]  below-700:text-[1rem] below-695:text-[0.8rem] w-7  h-[2rem]">
                      <div className=" px-2 below-700:pt-1  below-695:pt-2">
                        {product?.cartQuantity}
                      </div>
                      {/* <div className=" px-2  ">{tempQuantity}</div> */}
                      {/* <div className=" px-2  ">{testQuantity}</div> */}
                    </div>
                    <button className=" pl-2  hover:bg-gray-200 pr-1">
                      <Plus size={20} onClick={handleIncrease} />
                    </button>
                  </div>

                  {/* mobile devices quantity */}
                  <div className="box  pr-4 px-2 below-695:flex below-695:flex-col hidden">
                    <span className=" font-bold text-[1.2rem]  below-700:text-[1rem] below-695:text-[0.8rem]">
                      QUANTITY :
                    </span>


                    <div className=" flex">

                    
                    <button className=" pr-2  hover:bg-gray-200 pl-1">
                      <Minus size={20} onClick={handleDecrease} />
                    </button>
                    <div className=" text-[1.5rem]  below-700:text-[1rem] below-695:text-[0.8rem] w-7  h-[2rem]">
                      <div className=" px-2 below-700:pt-1  below-695:pt-2">
                        {product?.cartQuantity}
                      </div>
                      {/* <div className=" px-2  ">{tempQuantity}</div> */}
                      {/* <div className=" px-2  ">{testQuantity}</div> */}
                    </div>
                    <button className=" pl-2  hover:bg-gray-200 pr-1">
                      <Plus size={20} onClick={handleIncrease} />
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="  w-[6rem] px-2 self-center h-[5rem]  mr-10  below-460:hidden ">
            <div className="">
              <div className=" flex self-center py-2 ">
                <h1 className=" text-[1.3rem]  below-700:text-[1rem] below-695:text-[0.8rem] self-center">
                  {product?.discountedPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h1>
              </div>
              <div className=" flex justify-between ">
                <button className="transform transition-transform duration-300 hover:scale-110">
                  {/* <Heart size={25} /> */}
                </button>
                <button
                  className="transform transition-transform duration-300 hover:scale-110"
                  onClick={() => handleClickDelete(user?.id, product?.id)}
                >
                  <Trash2
                    className=" below-700:w-6 below-700:h-6 w-8 h-8 below-695:w-4 below-695:h-4  "
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>
          </div>
          <div className="  w-[6rem] px-2 self-center mb-2    hidden below-460:block  below-460:w-[12rem]
">
            <div className="below-460:flex  below-460:justify-between">
              <div className=" flex self-center py-2  ">
                <h1 className=" text-[1.3rem]  below-700:text-[1rem] below-695:text-[0.8rem] self-center  below-460:text-[1.2rem]">
                  {product?.discountedPrice.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h1>
              </div>
              <div className=" flex justify-between">
                <button className="transform transition-transform duration-300 hover:scale-110">
                  {/* <Heart size={25} /> */}
                </button>
                <button
                  className="transform transition-transform duration-300 hover:scale-110"
                  onClick={() => handleClickDelete(user?.id, product?.id)}
                >
                  <Trash2
                    className=" below-700:w-6 below-700:h-6 w-8 h-8 below-695:w-4 below-695:h-4  below-460:h-7  below-460:w-7 "
                    strokeWidth={1.5}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CheckoutProductCard;
