"use client";

import { Heart, Minus, Plus, ShoppingCart, StarIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import "./product.css";
import Image from "next/image";
import {
  relatedProduct,
  updatedDataResponse,
} from "@/app/categories/[categories]/[product]/page";
import Link from "next/link";
import addProductToCart from "@/actions/cart/addToProduct";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "../ui/use-toast";
import { Product } from "../product-carousel/EmblaCarousel";
import { toggleWishlist } from "@/actions/wishlist";
import {
  addCartDatatoCookies,
  getCartDataFromCookies,
  removeProductFromCookies,
} from "@/actions/cart/addCartDatatoCookies";
import increaseProductQuantity from "@/actions/cart/increaseProduct";
import decreaseProductQuantity from "@/actions/cart/decreaseProduct";
import WishlistButton from "../animated_heart/heart";
import addItemToCart from "@/actions/cart/addItemToCart";
import deleteCartItem from "@/actions/cart/deleteCartProducts";
import { getProductDetailsByID } from "@/actions/product/searchedProductData";

// need to fix the bug for the related items used inthe shooping cart the link url is showing undefined
const formatPrice = (price: number): string => {
  // Format the price with the Indian Rupee symbol
  return "₹" + price?.toLocaleString("en-IN");
};

// Function to remove spaces from a string
const removeSpaces = (name: string): string => {
  return name?.replace(/\s+/g, "");
};

const ProductCard: React.FC<updatedDataResponse> = ({
  CartRelatedProducts,
  callToast,
  Added,
  Removed,
  product,
  handleClickAdd,
  catRelatedProduct,
  handleQuantityChange,
  handleWishlistToggle,
}) => {
  const user = useCurrentUser();
  const [tempquantity, settempQuantity] = useState(0);
  const [color, setColor] = useState();
  const [size, setSize] = useState();
  const [productVarientID, setProductVarientID] = useState();
  const [stock, setStock] = useState();
  const [itemInCart, setItemInCart] = useState(false);
  const [fetchedData, setFetchedData] = useState("");
  const [url, setUrl] = useState("");
  console.log("this is the url", url);
  console.log("this is the fetched product data", product);

  useEffect(() => {
    settempQuantity(product.cartQuantity || 0);
    setColor(product.color);
    setSize(product.size);
    setProductVarientID(product.productVarientID);
    setStock(product.stock);

    if (product.cartQuantity) {
      setItemInCart(true);
    }
  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductDetailsByID(product.id);
      console.log("this is the fetched data", data);
      setFetchedData(data);
      if (data) {
        let { parentCategory, topmostParentCategory } = data?.parentCategoryIds;

        const productId = data?.productId || "";
        if (parentCategory === "Kids Category") {
          parentCategory = "Kids";
        }

        const cleanedCategory0 = parentCategory.replace(/\s+/g, "");
        const testUrl = `/categories/${topmostParentCategory}/${cleanedCategory0}/${productId}`;
        console.log("this is the test url", testUrl);
        setUrl(testUrl);
      }
    };

    fetchData();
  }, [catRelatedProduct]);

  const handleIncrease = () => {
    // alert("add to cart is being called");
    if (tempquantity > stock - 1) {
      return;
    }
    settempQuantity((prev) => prev + 1);
  };

  const handleDecrease = async () => {
    if (tempquantity == 0) {
      return;
    }

    settempQuantity((prev) => prev - 1);
  };

  const handleConfirm = async () => {
    if (tempquantity == 0) {
      callToast({
        variant: "destructive",
        title: "Please add the quantity first",
        description:
          "Please add the quantity first in order to add the item to cart",
      });
      return;
    }

    if (user) {
      // this is being added to db also need to add in the cookie when the user is not logged in
      const { success, message } = await addItemToCart(
        user?.id,
        product.id,
        productVarientID,
        color,
        size,
        tempquantity,
        stock
      );
      if (success === true) {
        //   alert("Item added to cart successfully")
      }
      console.log(
        "this is the final value to be updated in the db",
        tempquantity,
        color,
        size,
        productVarientID,
        stock
      );
      // handleClickAdd(user?.id, data.id, selectedColor, selectedSize);
      const dataobj = {
        id: product.id,
        cartQuantity: tempquantity,
        discountedPrice: product.discountedPrice,
        color: color,
        size: size,
        stock: stock,
        productVarientID: productVarientID,
      };

      const value = await addCartDatatoCookies([dataobj]);
      console.log("this is the cookie value", value.success, value.cookieValue);
    } else {
      const dataobj = {
        id: product.id,
        cartQuantity: tempquantity || 1,
        discountedPrice: product.discountedPrice,
        color: color,
        size: size,
        stock: stock,
        productVarientID: productVarientID,
      };

      console.log(
        "this is the final value to be updated in the db",
        tempquantity,
        color,
        size,
        productVarientID,
        stock
      );
      const { success, cookieValue } = await addCartDatatoCookies([dataobj]);
      console.log("this is the cookie value", success, cookieValue);
    }
    callToast({
      title: "Item added to cart",
      description: "successfully added item to cart",
    });

    setItemInCart(true);
  };




  const handleConfirmCart = async () => {

    if (tempquantity == 0) {
      callToast({
        variant: "destructive",
        title: "Please add the quantity first",
        description:
          "Please add the quantity first in order to add the item to cart",
      });
      return;
    }
    // const tempquantity = 1;

    if (user) {
      // this is being added to db also need to add in the cookie when the user is not logged in
      const { success, message } = await addItemToCart(
        user?.id,
        product.id,
        productVarientID,
        color,
        size,
        tempquantity,
        stock
      );
      if (success === true) {
        //   alert("Item added to cart successfully")
      }
      console.log(
        "this is the final value to be updated in the db",
        tempquantity,
        color,
        size,
        productVarientID,
        stock
      );
      // handleClickAdd(user?.id, data.id, selectedColor, selectedSize);

      const dataobj = {
        id: product.id,
        cartQuantity: tempquantity,
        discountedPrice: product.discountedPrice,
        color: color,
        size: size,
        stock: stock,
        productVarientID: productVarientID,
      };

      const value = await addCartDatatoCookies([dataobj]);
      console.log("this is the cookie value", value.success, value.cookieValue);
    } else {
      const dataobj = {
        id: product.id,
        cartQuantity: tempquantity || 1,
        discountedPrice: product.discountedPrice,
        color: color,
        size: size,
        stock: stock,
        productVarientID: productVarientID,
      };

      console.log(
        "this is the final value to be updated in the db",
        tempquantity,
        color,
        size,
        productVarientID,
        stock
      );
      const { success, cookieValue } = await addCartDatatoCookies([dataobj]);
      console.log("this is the cookie value", success, cookieValue);
    }
    callToast({
      title: "Item added to cart",
      description: "successfully added item to cart",
    });
    
    handleClickAdd();

    setItemInCart(true);

  }

  const handleremove = async () => {
    callToast({
      variant: "destructive",
      title: "Item removed from cart",
      description: "Item successfully removed from cart",
    });

    settempQuantity(0);
    await removeProductFromCookies(product.id);
    setItemInCart(false);

    if (user) {
      const userID = user?.id;
      const productID = product.id;

      if (userID) {
        // alert("delete cart item is being called")
        deleteCartItem(userID, productID);
      }
    }
  };

  console.log("this is the product card data", product);
  // console.log("this is the updated products", updatedProducts);

  // console.log("this is the productID from product card", product?.category?.name);

  const completeUrl =
    typeof window !== "undefined" ? window.location.href.split("?")[0] : "";
  console.log("this is the complete url", completeUrl);

  const segments = completeUrl.split("/");

  const matchingSegmentIndex = segments.findIndex(
    (segment) => removeSpaces(segment) === removeSpaces(product?.category?.name)
  );
  console.log("this is the product category name", product?.category?.name);
  // If a matching segment is found, construct the new URL
  let newUrl = completeUrl;

  if (matchingSegmentIndex !== -1) {
    // Remove the segments from the matching segment index onwards

    const newSegments = segments.slice(0, matchingSegmentIndex);

    // Add the product category name and ID to the new segments

    newSegments.push(removeSpaces(product?.category?.name), product?.id);

    // Join the new segments to form the new URL

    newUrl = newSegments.join("/");
  } else {
    // If no matching segment is found, append the product category name and ID to the end of the URL

    newUrl = `${completeUrl}/${removeSpaces(product?.category?.name)}/${
      product?.id
    }`;
  }

  return (
    <div>
      <div className="sembla__slide_product pl-[3rem]  ">
        <div
          className="sembla__slide__number__product flex flex-col relative min-h-[25rem] w-[18rem]  border-2 border-black border-b-8 border-r-4
        transition-transform duration-300 ease-in-out hover:scale-110"
        >
          {/* top part */}
          <button>
            <div className="RelatedProductImageCard  relative ">
              <button
                className={`heartButton z-10 hover:text-red-500`}
                onClick={() => handleWishlistToggle(user?.id, product.id)}
              >
                {/* wishlist icon */}
                {/* <Heart
                  className={`hover:fill-red-500 text-black ${
                    product?.isWishlisted ? "fill-red-500" : ""
                  }`}
                  size={40}
                  strokeWidth={0.8}
                  // className={` hover:fill-red-500 text-black`}
                /> */}
                <WishlistButton
                  isWishlistedData={product?.isWishlisted}
                  Added={Added}
                  Removed={Removed}
                />
              </button>

              <div className="ProductImage bg-red-400 h-full w-full absolute">
                <Link href={url}>
                  <Image
                    alt="product image"
                    fill="true"
                    objectFit="cover"
                    src={product?.images[0]?.url}
                  />
                </Link>
              </div>
            </div>
          </button>
          <div className=" ">
          {/* middle part */}
          <div className="  text-sm flex h-[2rem] justify-between bg-opacity-20 backdrop-blur-lg border border-white/30 ">
            <div className=" bg-gray-200 w-16  ">
              <div className=" flex justify-between px-2 pt-1">
                <span>{product?.ratings?.averageRating.toFixed(1)}</span>
                <div className=" self-center">
                  <StarIcon size={20} stroke="" fill="black" />
                </div>
              </div>
            </div>
            <div>
              {/* {catRelatedProduct && ( */}
              {(
                

                <div className="box flex pr-4">
                  {/* quantity change icons */}
                  <button
                    className=" pr-2  hover:bg-gray-200 pl-1"
                    onClick={handleDecrease}
                  >
                    <Minus size={20} />
                  </button>
                  <div className=" text-[1.5rem]   bg-white  h-[2rem]">
                    <div className=" px-2 py-2 ">{tempquantity || 0}</div>
                  </div>
                  <button
                    className=" pl-2  hover:bg-gray-200 pr-1"
                    onClick={handleIncrease}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Bottom part */}
          <div className="RelatedProductDetails    ">
            <div className="Relatedcard_slider px-2 pb-5 w-full text-[1.5rem]   flex justify-between bg-white bg-opacity-20 backdrop-blur-lg border border-white/30  ">
              <div className="left w-[9rem]  pt-1">
                <h1 className=" text-[19px] font-bold">
                  {product?.brand?.name}
                </h1>
                <p className="font-extralight text-[0.9rem]">
                  {" "}
                  {product?.name.length > 30
                    ? product?.name.slice(0, 25) + "..."
                    : product?.name}
                </p>
                <div className=" flex  mt-4">
                  <h1
                    className=" text-[1.4rem] font-bold"
                    style={{ textDecoration: "line-through" }}
                  >
                    {product?.price}
                  </h1>
                  <h1 className=" text-[1.2rem] font-bold ml-2">
                    {formatPrice(product?.discountedPrice?.toFixed(2))}
                  </h1>
                  <h1 className=" text-[1.2rem] font-bold ml-2">
                    ({product?.discount}%OFF)
                  </h1>
                </div>
              </div>

              {/* {product?.cartQuantity === 0 ||
                (!product?.cartQuantity && (
                  <div className="right self-center pb-7">
                    <button
                      className="nbutton items-center border-2 border-black  px-2  justify-between hidden "
                      onClick={() => {
                        // handleClickAdd(user?.id, product?.id);
                      }}
                    >
                      <div>
                        <ShoppingCart size={20} />
                      </div>
                      <div className="text-sm px-3">Add to Cart</div>
                    </button>
                  </div>
                ))} */}

              {product?.cartQuantity || itemInCart ? (
                <div className="right self-center pb-7">
                  <button
                    className="nbutton items-center border-2 border-black   px-2  py-2 justify-between hidden "
                    onClick={handleremove}
                  >
                    <div>
                      <ShoppingCart size={30} />
                    </div>
                    <div className="text-sm px-1">Remove</div>
                  </button>
                </div>  
              ) : CartRelatedProducts == true ? (
                <>
                  <div className="right self-center pb-7">
                    <button
                      className="nbutton items-center border-2 border-black  px-2  justify-between hidden "
                      onClick={handleConfirmCart}
                    >
                      <div>
                        <ShoppingCart size={20} />
                      </div>
                      <div className="text-sm px-3">Add to Cart</div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="right self-center pb-7">
                    <button
                      className="nbutton items-center border-2 border-black  px-2  justify-between hidden "
                      onClick={handleConfirm}
                    >
                      <div>
                        <ShoppingCart size={20} />
                      </div>
                      <div className="text-sm px-3">Add to Cart</div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
