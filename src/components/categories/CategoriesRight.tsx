"use client";
import {
  DollarSign,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  StarIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import React, { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StarChart from "../star charts/starChart";
import Image from "next/image";
import { updatedDataResponse } from "@/app/categories/[categories]/[product]/page";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getProductReviews } from "@/actions/productRating/getProductReview";
import { set } from "zod";
import MiniStarRatingComponent from "../rating star component/MiniStarRatingComponent";
import { ReviewModal } from "../ReviewModal";
import { fetchReview } from "@/actions/productRating/fetchReview";
import Link from "next/link";
import LikeAndDislikeButton from "../likeAndDislikeButton";
import { productLike } from "@/actions/productReview/productLike";
import { productDislike } from "@/actions/productReview/productDislike";
import { toast } from "../ui/use-toast";
import { getUniqueColors } from "@/lib/utils";
import ColorSelection from "../product selection/ColourSelection";
import deleteCartItem from "@/actions/cart/deleteCartProducts";
import {
  addCartDatatoCookies,
  removeProductFromCookies,
} from "@/actions/cart/addCartDatatoCookies";
import { NotifyMeModal } from "../NotifyMeModal";
import addItemToCart from "@/actions/cart/addItemToCart";
import QuantitytLoading from "../quantity loading/QuantitytLoading";
import LoadingAnimation from "../Loading/LoadingAnimation";

type ProductVariant = {
  id: string;
  color: string;
  size: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductVariantResult = {
  id: string;
  stock: number;
} | null;

type CategoriesRightProps = {
  data: updatedDataResponse;
};

function findProductVariant(
  productVariants: ProductVariant[],
  color: string,
  size: string
): ProductVariantResult {
  for (const variant of productVariants) {
    if (
      variant.color.toLowerCase() === color.toLowerCase() &&
      variant.size.toLowerCase() === size.toLowerCase()
    ) {
      return { id: variant.id, stock: variant.stock };
    }
  }
  return null;
}

// Utility function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const handlelike = async (ratingId: string) => {
  const { error, message, like } = await productLike(ratingId);
  // console.log("this is the liked data response", error, message, like);
};

const handleDislike = async (ratingId: string) => {
  const { error, message, dislike } = await productDislike(ratingId);
  // console.log("this is the disliked data response", error, message, dislike);
};

const CategoriesRight: React.FC<CategoriesRightProps> = ({
  data,
  handleWishlistToggle,
  handleClickAdd,
  handleQuantityChange,
  callToast,
  setUpdateChart,
  setUpdateTrigger,
  initialColor,
  initialSize,
}) => {
  // console.log(
  //   "this is the data quantities from categories right",
  //   data?.cartQuantity
  // );
  const user = useCurrentUser();

  // const initialColour= data?.productVariants && data?.productVariants[0]?.color;
  // const initialSize=data?.productVariants && data?.productVariants[0]?.size;
  // console.log(
  //   "this is the initial colour and size inside the categories right",
  //   initialColor,
  //   initialSize
  // );

  const [uniqueColors, setUniqueColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [initialLoadColorAndSize, setInitialLoadColorAndSize] = useState(true);
  const [productVarients, setProductVarients] = useState(data?.productVariants);

  const [tempQuantity, setTempQuantity] = useState(null);
  // console.log("this is the temp quantity", tempQuantity);
  // console.log(
  //   "this is the selected color and size from initial data",
  //   selectedColor,
  //   selectedSize
  // );



  const initialData = [
    {
      name: "5 Stars",
      uv: 5,
      stars: data?.ratings?.count[5],
      amt: 2000,
    },
    {
      name: "4 Stars",
      uv: 4,
      stars: data?.ratings?.count[4],
      amt: 2000,
    },
    {
      name: "3 Stars",
      uv: 3,
      stars: data?.ratings?.count[3],
      amt: 2000,
    },
    {
      name: "2 Stars",
      uv: 2,
      stars: data?.ratings?.count[2],
      amt: 2000,
    },
    {
      name: "1 Stars",
      uv: 1,
      stars: data?.ratings?.count[1],
      amt: 2000,
    },
  ];

  // console.log("this is the initial data", initialData);

  const [reviews, setReviews] = useState([]);
  const [verifiedPurchaseCount, setVerifiedPurchaseCount] = useState("");
  const [reviewData, setReviewData] = useState(null);
  const [newData, setNewData] = useState(true);
  const [barChartData, setbarChartData] = useState(initialData);
  const [VarientQuantity, setVarientQuantity] = useState(null);
  const [productVarientStock, setProductVarientStock] = useState(0);
  const [productVarientID, setProductVarientID] = useState("");
  const [itemInCart, setItemInCart] = useState(false);
  const [loadingQuantity, setLoadingQuantity] = useState(true);

  // console.log("this is the item in cart value", itemInCart);

  // console.log("this is the chart data", barChartData);

  if (!data) {
    return <div><LoadingAnimation/></div>;
  }

   // Effect for setting tempQuantity
  //  useEffect(() => {
  //   if (data?.cartQuantity !== undefined) {
  //     setLoadingQuantity(true);
  //     // Simulate a delay for loading
  //     setTempQuantity(data.cartQuantity);
  //     setLoadingQuantity(false);
     
  //   }
  // }, [data?.cartQuantity]);

  
  useEffect(() => {
    const fetchReviewData = async () => {
      const Data = await fetchReview({ productId: data?.id });
      // alert("fethcreviewdata is  been called")

      if (data?.cartQuantity !== undefined) {
        setLoadingQuantity(true);
        // Simulate a delay for loading
        setTempQuantity(data.cartQuantity);
        setLoadingQuantity(false);
       
      }

      // console.log("this is the fetchreview data", Data);
      setReviewData(Data);
      setUniqueColors(getUniqueColors(data?.productVariants));

      if (data?.cartQuantity) {
        // console.log("this is the data cart quantity", data?.cartQuantity);
        setItemInCart(true);
        setVarientQuantity(data?.cartQuantity);
      }
    };
    fetchReviewData();
  }, [data, newData,data?.cartQuantity]);

  // console.log("this is the unique colors", uniqueColors);

  useEffect(() => {
    const getReviews = async () => {
      if (data?.id) {
        const { reviews, verifiedPurchaseCount, error } =
          await getProductReviews({
            productId: data?.id,
            fetchLimit: 1,
            sortDirection: "asc",
          });
        const value = reviews;
        setVerifiedPurchaseCount(verifiedPurchaseCount);
        setReviews(value);
        // console.log(
        //   `this is the reviews data for the product ID ${data?.id} ${verifiedPurchaseCount}`,
        //   value
        // );

        setUpdateChart((prev) => !prev);
      }
    };
    getReviews();
  }, [data, newData]);

  // brand cannot be destructured from data issue arised because the data  was null , so i added a check to see if data is null or not and display the loading message if it is null
  // console.log("this is the data from categories right", data);
  // data.ratings.count
  const { brand, price, discountedPrice, description } = data;

  const [outOfStock, setoutOfStock] = React.useState(false);

  // Effect to update data based on ratingsCount
  useEffect(() => {
    const updatedData = initialData.map((item, index) => ({
      ...item,
      stars: data?.ratings?.count[index] || item.stars,
    }));
    setbarChartData(updatedData);
  }, [data, newData]);

  const addToCart = () => {
    // need to optmize the toggle varient part code so that the quantity will be shown in the cart
    if (selectedColor == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size and colour `,
        description: `You have successfully selected the colour ${selectedColor} `,
      });
    } else if (selectedSize == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size `,
        description: `You have successfully selected the size ${selectedSize} `,
      });
    } else {
      handleClickAdd(user?.id, data.id, selectedColor, selectedSize);
      const productVarietnID = findProductVariant(
        data?.productVariants,
        selectedColor,
        selectedSize
      );
      setProductVarientStock(productVarietnID?.stock);
      // console.log(
      //   "this is the product varient id which is selected",
      //   productVarietnID
      // );
    }
  };

  const handleDecrease = () => {
    if (selectedColor == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size and colour `,
        description: `You have successfully selected the colour ${selectedColor} `,
      });
    } else if (selectedSize == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size `,
        description: `You have successfully selected the size ${selectedSize} `,
      });
    } else {
      if (tempQuantity == 0) {
        return;
      }

      setTempQuantity((prev) => prev - 1);

      // the below needs to be done when the product is finalized and clicked on proceed to buy

      // handleQuantityChange(user?.id, data.id, -1);
      // const productVarietnID = findProductVariant(
      //   data?.productVariants,
      //   selectedColor,
      //   selectedSize
      // );

      // console.log(
      //   "this is the product varient id which is selected",
      //   productVarietnID
      // );
    }
  };

  const handleIncrease = () => {
    if (selectedColor == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size and colour `,
        description: `You have successfully selected the colour ${selectedColor} `,
      });
    } else if (selectedSize == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size `,
        description: `You have successfully selected the size ${selectedSize} `,
      });
    } else {
      if (tempQuantity > productVarientStock - 1 || tempQuantity > 4) {
        return;
      }
      setTempQuantity((prev) => prev + 1);

      // handleQuantityChange(user?.id, data.id, 1)

      // the below needs to be done when the product is finalized and clicked on proceed to buy
      // handleClickAdd(user?.id, data.id, selectedColor, selectedSize);

      // const productVarietnID = findProductVariant(
      //   data?.productVariants,
      //   selectedColor,
      //   selectedSize
      // );

      // console.log(
      //   "this is the product varient id which is selected",
      //   productVarietnID
      // );
    }
  };

  const handleConfirm = async () => {
    // alert("i have been called")

    if (tempQuantity == 0) {
      callToast({
        variant: "destructive",
        title: "Please add the quantity first",
        description:
          "Please add atleast one quantity first in order to add the item to cart",
      });
      return;
    }

    if (selectedColor == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size and colour `,
        description: `You have successfully selected the colour ${selectedColor} `,
      });
    } else if (selectedSize == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size `,
        description: `You have successfully selected the size ${selectedSize} `,
      });
    } else {
      if (user) {
        // this is being added to db also need to add in the cookie when the user is not logged in
        const { success, message } = await addItemToCart(
          user?.id,
          data.id,
          productVarientID,
          selectedColor,
          selectedSize,
          tempQuantity,
          productVarientStock
        );
        if (success === true) {
          // alert("Item added to cart successfully")
        }
        // console.log(
        //   "this is the final value to be updated in the db",
        //   tempQuantity,
        //   selectedColor,
        //   selectedSize,
        //   productVarientID,
        //   productVarientStock
        // );
        // handleClickAdd(user?.id, data.id, selectedColor, selectedSize);
        const dataobj = {
          id: data.id,
          cartQuantity: tempQuantity,
          discountedPrice: data.discountedPrice,
          color: selectedColor,
          size: selectedSize,
          stock: productVarientStock,
          productVarientID: productVarientID,
        };

        const value = await addCartDatatoCookies([dataobj]);
        // console.log(
        //   "this is the cookie value",
        //   value.success,
        //   value.cookieValue
        // );
      } else {
        const dataobj = {
          id: data.id,
          cartQuantity: tempQuantity,
          discountedPrice: data.discountedPrice,
          color: selectedColor,
          size: selectedSize,
          stock: productVarientStock,
          productVarientID: productVarientID,
        };

        // console.log(
        //   "this is the final value to be updated in the cookie",
        //   tempQuantity,
        //   selectedColor,
        //   selectedSize,
        //   productVarientID,
        //   productVarientStock
        // );
        const { success, cookieValue } = await addCartDatatoCookies([dataobj]);
        // console.log("this is the cookie value", success, cookieValue);
      }
    }

    callToast({
      title: "Item added to cart",
      description: "successfully added item to cart",
    });

    setItemInCart(true);
  };

  const handleUpdate = async () => {
    if (tempQuantity === data?.cartQuantity) {
      return;
    }

    // alert("i have been called")

    if (tempQuantity == 0) {
      callToast({
        variant: "destructive",
        title: "Please add the quantity first",
        description:
          "Please add atleast one quantity first in order to add the item to cart",
      });
      return;
    }

    if (selectedColor == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size and colour `,
        description: `You have successfully selected the colour ${selectedColor} `,
      });
    } else if (selectedSize == null) {
      callToast({
        variant: "destructive",
        title: `Please select a size `,
        description: `You have successfully selected the size ${selectedSize} `,
      });
    } else {
      if (user) {
        // this is being added to db also need to add in the cookie when the user is not logged in
        const { success, message } = await addItemToCart(
          user?.id,
          data.id,
          productVarientID,
          selectedColor,
          selectedSize,
          tempQuantity,
          productVarientStock
        );
        if (success === true) {
          // alert("Item added to cart successfully")
        }
        // console.log(
        //   "this is the final value to be updated in the db",
        //   tempQuantity,
        //   selectedColor,
        //   selectedSize,
        //   productVarientID,
        //   productVarientStock
        // );
        // handleClickAdd(user?.id, data.id, selectedColor, selectedSize);
        const dataobj = {
          id: data.id,
          cartQuantity: tempQuantity,
          discountedPrice: data.discountedPrice,
          color: selectedColor,
          size: selectedSize,
          stock: productVarientStock,
          productVarientID: productVarientID,
        };

        const value = await addCartDatatoCookies([dataobj]);
        // console.log(
        //   "this is the cookie value",
        //   value.success,
        //   value.cookieValue
        // );
      } else {
        const dataobj = {
          id: data.id,
          cartQuantity: tempQuantity,
          discountedPrice: data.discountedPrice,
          color: selectedColor,
          size: selectedSize,
          stock: productVarientStock,
          productVarientID: productVarientID,
        };

        // console.log(
        //   "this is the final value to be updated in the cookie",
        //   tempQuantity,
        //   selectedColor,
        //   selectedSize,
        //   productVarientID,
        //   productVarientStock
        // );
        const { success, cookieValue } = await addCartDatatoCookies([dataobj]);
        // console.log("this is the cookie value", success, cookieValue);
      }
    }

    callToast({
      title: "Item updated in cart",
      description: "successfully updated item in cart",
    });

    setItemInCart(true);
  };

  const handleremove = async () => {
    callToast({
      varient: "destructive",
      title: "Item removed from cart",
      description: "Item successfully removed from cart",
    });

    setTempQuantity(0);
    setVarientQuantity(0);
    await removeProductFromCookies(data?.id);
    setItemInCart(false);

    if (user) {
      const userID = user?.id;
      const productID = data?.id;

      if (userID) {
        // alert("delete cart item is being called")
        deleteCartItem(userID, productID);
      }
    }
  };

  // useEffect(() => {
  // },[itemInCart])

  useEffect(() => {
    // remove the items from cookies when the product varient is swithced
    // removeProductFromCookies(data.id);

    // remove the items from the db as well when the product varient is swithced

    // deleteCartItem(user?.id, data.id);
    // setToggledVarientQuantity( (prev) => !prev);

    // setUpdateTrigger((prev) => !prev);

    if (selectedColor && selectedSize) {
      const productVarietnID = findProductVariant(
        data?.productVariants,
        selectedColor,
        selectedSize
      );
      setProductVarientStock(productVarietnID?.stock);
      setProductVarientID(productVarietnID?.id);
      // console.log(
      //   "this is the product varient id which is selected",
      //   productVarietnID
      // );
      // setToggledVarientQuantity( (prev) => !prev);
      // setTempQuantity(0);
    }

    setTempQuantity(data?.cartQuantity);
  }, [selectedColor, selectedSize]);

  return (
    <div>
      <div className=" bg-teal-600 w-full  ">
        <div className=" px-4   w-full"> 
          <h1 className=" text-[4rem] font-bold  below-1000:text-[1.5rem] uppercase">{data?.brand?.name}</h1>
          <h2 className=" text-[1.2rem] below-1000:text-[1.2rem] below-1000:w-[30rem] below-868:w-[20rem] uppercase below-868:text-[1rem]  ">{data?.name}</h2>
          <div className="star_rating flex justify-between w-[14rem] border border-black mt-5 h-[2rem]">
            <div className="star flex self-center border-r border-black pr-4">
              <div className=" pl-2">
                {data?.ratings?.averageRating.toFixed(1)}
              </div>
              <div className=" pl-2 self-center">
                <Star fill="yellow" size={18} strokeWidth={0.5} />
              </div>
            </div>
            <div className="rating self-center  pr-5">
              {data?.ratings?.totalRatings}{" "}
              <span className=" font-bold">Ratings</span>
            </div>
          </div>
          <div className=" border-b-2 border-gray-300 mt-5"></div>
          <div className=" mt-2">
            <div className=" flex  w-[35rem]  mb-2">
              <h1 className=" self-center text-[2rem] below-1025:text-[1.5rem] below-868:text-[1rem]">MRP</h1>

              <div className=" flex  self-center">
              
                <h1
                  className=" text-[2.5rem] font-bold ml-2 below-1025:text-[1.5rem] below-868:text-[1rem]"
                  style={{ textDecoration: "line-through" }}
                >
                  {data?.price?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </h1>
                <h1 className=" text-[2.5rem] font-bold ml-5 below-1025:text-[1.5rem]  below-868:text-[1rem]">
                  {data?.discountedPrice?.toFixed(2)}
                </h1>
                <h1 className=" text-[2.5rem] font-bold ml-5 text-yellow-400 below-1025:text-[1.5rem]  below-868:text-[1rem]">
                  ({data?.discount}%OFF)
                </h1>
              </div>
            </div>
            <h3 className=" uppercase">Inclusive of all taxes</h3>

            <div>
              <div>
                <ColorSelection
                  setInitialLoadColorAndSize={setInitialLoadColorAndSize}
                  variants={data?.productVariants}
                  setColor={setSelectedColor}
                  setSize={setSelectedSize}
                />
              </div>
            </div>

            <div className="button flex w-[15rem] justify-between mt-5 below-868:flex-col">
              {
                <div className="button flex w-[15rem] justify-between mt-4">
                  {productVarientStock > 0 ? (
                    <div className=" flex self-center ">
                      <div className="box flex pr-4 self-center">
                        {/* quantity change icons */}
                        <button
                          className=" pr-2  hover:bg-gray-200 pl-1"
                          onClick={handleDecrease}
                        >
                          <Minus size={30} />
                        </button>
                        <div className=" text-[2rem] w-11  bg-white h-[2.5rem]  ">
                          <h1 className="  flex text-center justify-center align-middle  ">
                            {/* {data?.cartQuantity || 0} */}
                            {loadingQuantity ? (
                              <div className=" flex justify-center items-center mt-2">
                                <QuantitytLoading />
                              </div>
                            ) : (
                              tempQuantity
                            )}
                          </h1>
                        </div>
                        <button
                          className=" pl-2  hover:bg-gray-200 pr-1"
                          onClick={handleIncrease}
                        >
                          <Plus size={30} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    productVarientStock === 0 || productVarientStock <0 &&
                    selectedColor &&
                    selectedSize && (
                      <div className=" h-[4rem]">
                        <h1 className="w-40  p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4  bg-yellow-500 font-bold">
                          {"Out of stock"}
                        </h1>
                      </div>
                    )
                  )}
                </div>
              }

              {!data?.isWishlisted ? (
                <div className=" h-[4rem] ml-5 below-868:ml-0">
                  <button
                    type="submit"
                    className="w-60  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500  "
                    onClick={() => handleWishlistToggle(user?.id, data.id)}
                  >
                    <Heart size={25} className=" mr-2" />
                    <h1 className=" font-bold below-868:text-[0.8rem] uppercase">{"Wishlist this item"} </h1>
                  </button>
                </div>
              ) : (
                <div className=" h-[4rem] ml-5 below-868:ml-0">
                  <button
                    type="submit"
                    className="w-60  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
                    onClick={() => handleWishlistToggle(user?.id, data.id)}
                  >
                    <Heart size={25} className=" mr-2" fill="red" />
                    <h1 className=" font-bold">{"Item Wishlisted"} </h1>
                  </button>
                </div>
              )}
            </div>
            {productVarientStock === 0 ? (
              <div className=" h-[4rem] mt-8">
                <NotifyMeModal buttonName="Notify Me" />
              </div>
            ) : itemInCart || VarientQuantity ? (
              <div className=" ">
                <div>
                  <div className=" h-[4rem] mt-8">
                    <button
                      type="submit"
                      className={`w-60  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-red-600  `}
                      onClick={handleremove}
                    >
                      <ShoppingCart />

                      <h1 className=" font-bold pl-4 below-868:text-[0.8rem] uppercase">Remove </h1>
                    </button>
                  </div>
                </div>

                <div className=" flex below-925:flex-col">
                  <div className=" h-[4rem]  mr-4">
                    <button
                      type="submit"
                      className={`w-60  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500 `}
                      onClick={handleUpdate}
                    >
                      <ShoppingCart />
                      <h1 className=" font-bold pl-4 below-868:text-[0.8rem] uppercase">Update </h1>
                    </button>
                  </div>
                  <div className=" h-[4rem] ">
                    <Link href="/cart">
                      <button
                        className={`w-60  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500 `}
                        // onClick={handleremove}
                      >
                        <ShoppingCart />
                        <h1 className=" font-bold pl-4 below-868:text-[0.8rem] uppercase">Go to Cart </h1>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className=" h-[4rem] mt-8">
                <button
                  type="submit"
                  className={`w-60  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-green-500 `}
                  onClick={handleConfirm}
                >
                  <ShoppingCart />
                  <h1 className=" font-bold pl-4">{"Add to Cart"} </h1>
                </button>
              </div>
            )}
          </div>
          <div className=" border-b-2 border-gray-300 mt-5"></div>
          <div className="   mt-10 text-[1.2rem]">
            <h1 className=" text-[2rem] font-bold  uppercase">Product Details</h1>
            <p className=" uppercase below-1025:w-[32rem] below-868:text-[1rem] below-868:w-[25rem] below-835:w-[20rem] below-835:text-[0.8rem] ">
            {data?.description}
            </p>
          </div>
          <div className=" border-b-2 border-gray-300 mt-5"></div>
          <div className="  mt-4 bg">
            <div className=" text-white  mb-14 flex flex-col ">
              <div className=" flex  pl-8">
                <div>
                  <h1 className=" text-[3rem]"> RATINGS </h1>
                </div>
                <div className=" px-5">
                  <Star
                    fill="yellow"
                    strokeWidth={0.5}
                    size={65}
                    stroke="black"
                  />
                </div>
                
              </div>

              <div className=" hidden below-1025:block pl-8">
                    <div className="top flex mt-5 mb-2">
                      <p className=" text-[5rem] leading-none m-0 p-0 font-thin ">
                        {data?.ratings?.averageRating.toFixed(1)}
                      </p>
                      <div className=" self-center ml-5">
                        <Star
                          fill="yellow"
                          size={38}
                          stroke="black"
                          strokeWidth={0.5}
                        />
                      </div>
                    </div>
                    <div className="Bottom">
                      {verifiedPurchaseCount} Verified Buyers
                    </div>
                  </div>

              <div className=" flex mt-6 ">
                <div className="left flex-1 border-r-2 border-gray-600 pl-8 pr-4 below-1025:hidden ">
                  <div className="">
                    <div className="top flex mt-5 mb-2">
                      <p className=" text-[5rem] leading-none m-0 p-0 font-thin ">
                        {data?.ratings?.averageRating.toFixed(1)}
                      </p>
                      <div className=" self-center ml-5">
                        <Star
                          fill="yellow"
                          size={38}
                          stroke="black"
                          strokeWidth={0.5}
                        />
                      </div>
                    </div>
                    <div className="Bottom">
                      {verifiedPurchaseCount} Verified Buyers
                    </div>
                  </div>
                </div>
            
                
                <div className=" below-1025:hidden  text-black w-[5rem] pl-5  flex flex-col justify-between">
                  <div className=" flex w-5">
                    5{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="aqua" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    4{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="yellow" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    3{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="green" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    2{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="orange" size={15} />
                    </div>
                  </div>
                  <div className=" flex w-5">
                    1{" "}
                    <div className=" self-center pl-2 ">
                      <Star stroke="2" fill="red" size={15} />
                    </div>
                  </div>
                </div>

                <div className="right flex-1 pl-[14rem]  z-0 below-1025:hidden">
                  <div className="  rotate-90 w-[5.5rem] h-[2rem] ">
                    <StarChart
                      barChartData={initialData}
                      initialCount={data?.ratings?.count}
                    />
                  </div>
                </div>
                <div className=" text-black w-[5rem]  below-1025:hidden  flex flex-col justify-between">
                  <p className=" flex w-5 pl-0">{data?.ratings?.count[5]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[4]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[3]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[2]} </p>
                  <p className=" flex w-5">{data?.ratings?.count[1]} </p>
                </div>
              </div>
            </div>

            {/* review component */}
            <div className=" below-900:w-[30rem] below-835:w-[23rem]">
              {reviewData?.review?.rating ? (
                <div className="mr-11">
                  <div className=" flex ">
                    <p>You Rated {reviewData?.review?.rating} Stars </p>
                    <div className=" self-center ml-2">
                      <MiniStarRatingComponent
                        reviewStars={reviewData?.review?.rating}
                      />
                    </div>
                  </div>

                  {reviewData?.review?.review === "" ? (
                    <ReviewModal
                      setNewData={setNewData}
                      buttonName="Add your Review"
                      reviewId={reviewData?.review?.id}
                      ProductName={data?.name}
                      ProductId={data?.id}
                      reviewStars={reviewData?.review?.rating}
                      reviewTitle={reviewData?.review?.reviewTitle}
                      reviewMessage={reviewData?.review?.review}
                      ProductImage={data?.images ? data?.images[0]?.url : ""}
                      isPaid={false}
                    />
                  ) : (
                    <div>
                      <p>Your Review is :</p>
                      <p >{reviewData?.review?.review}</p>
                      <ReviewModal
                        setNewData={setNewData}
                        reviewId={reviewData?.review?.id}
                        buttonName="Edit your Review"
                        reviewStars={reviewData?.review?.rating}
                        reviewTitle={reviewData?.review?.reviewTitle}
                        reviewMessage={reviewData?.review?.review}
                        ProductName={data?.name}
                        ProductId={data?.id}
                        ProductImage={data?.images ? data?.images[0]?.url : ""}
                        isPaid={false}
                      />
                    </div>
                  )}
                </div>
              ) : user ? (
                <div className="mr-11">
                  <ReviewModal
                    setNewData={setNewData}
                    buttonName="Rate the product"
                    reviewId={reviewData?.review?.id}
                    ProductName={data?.name}
                    ProductId={data?.id}
                    ProductImage={data?.images ? data?.images[0]?.url : ""}
                    reviewStars={reviewData?.review?.rating}
                    reviewTitle={reviewData?.review?.reviewTitle}
                    reviewMessage={reviewData?.review?.review}
                    isPaid={false}
                  />
                </div>
              ) : (
                <div className=" h-[4rem]">
                  <button
                    type="submit"
                    className="w-80  p-2 border-2 border-black text-black mt-4 flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500"
                    onClick={() =>
                      callToast({
                        variant: "destructive",
                        title: "Not Logged In",
                        description: "Please login to add the review",
                      })
                    }
                  >
                    <h1 className=" font-bold">{"Add review"} </h1>
                  </button>
                </div>
              )}
            </div>

            <div className="reviews border-2 border-black mt-11 below-1000:w-[32rem]  below-868:w-[25rem] below-835:w-[20rem]">
              <div className=" cxphotos   px-4 pt-4 border-b-2 border-black ">
                <div>
                  <h1 className=" text-[1.2rem] font-semibold">
                    CUSTOMER PHOTOS({reviews?.images?.length || 0})
                  </h1>
                </div>

                {reviews?.images?.length > 0 ? (
                  <div className=" flex mt-4">
                    <Image
                      src=""
                      alt="test image"
                      width={100}
                      height={100}
                      className=" bg-green-600 mr-3"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className=" text-[1.2rem] font-semibold">
                      No photos uploaded yet
                    </h1>
                  </div>
                )}
              </div>
              <div className=" cxreviews   mb-4  px-4 pt-4">
                <div className="">
                  <h1 className=" text-[1.2rem] font-semibold mb-4">
                    CUSTOMER REVIEWS({data?.ratings?.totalReviews})
                  </h1>
                  {/* review component */}
                  {reviews?.length > 0 ? (
                    reviews
                      .filter((review) => review?.review !== null)
                      .map((review,index) => (
                        <div key={index} className=" flex border-2 border-black  bg-teal-600  min-h-28 mt-6">
                          <div className=" w-[3rem] border-r-2 border-black ">
                            <div className=" flex justify-between px-2 pt-1">
                              <div>{review?.rating}</div>
                              <div className=" self-center">
                                <StarIcon size={20} stroke="" fill="white" />
                              </div>
                            </div>
                          </div>
                          <div className="  w-full flex flex-col ">
                            {review?.reviewTitle && (
                              <p className="  h-auto px-2 py-2 border-b-2 border-black font-bold uppercase">
                                TITLE: {review?.reviewTitle}
                              </p>
                            )}

                            <p className="  h-auto px-2 py-2 border-b-2 border-black">
                              {review?.review}
                            </p>

                            {review?.images && review?.images.length > 0 && (
                              <div className=" px-2 py-2 ImageComponent">
                                <Image
                                  src=""
                                  alt="test image"
                                  width={100}
                                  height={100}
                                  className=" bg-green-600 mr-3"
                                />
                              </div>
                            )}

                            <div className="   flex justify-between px-2 py-2  mt-5 below-868:flex-col">
                              <div className=" below-868:mb-2 bg-white border-2 border-black flex self-center py-1 px-4    ">
                                <p className="border-gray-500 border-r-2 pr-2 below-868:text-[0.8rem] ">
                                  {review?.user?.name}
                                </p>

                                <p className=" pl-2 below-868:text-[0.8rem] ">
                                  {formatDate(review?.createdAt)}{" "}
                                </p>
                              </div>
                              {review?.verifiedPurchase && (
                                <div className=" bg-white border-2 border-black flex self-center py-1 px-4    ">
                                  <p className="border-gray-500  pr-2 ">
                                    {"Verified "}
                                  </p>
                                </div>
                              )}

                              <LikeAndDislikeButton
                                handlelike={handlelike}
                                handleDislike={handleDislike}
                                review={review}
                                callToast={callToast}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div>
                      <h1 className=" text-[1.2rem] font-semibold">
                        No reviews yet
                      </h1>
                    </div>
                  )}

                  {reviews?.length > 0 &&
                    reviews?.length < data?.ratings?.totalReviews && (
                      <div className=" ">
                        <div className=" h-[4rem] mt-5  flex flex-row-reverse ">
                          <Link href={`/reviews/${data?.id}`}>
                            <button
                              type="submit"
                              className="w-80  p-2  border-2 border-black text-black flex self-center justify-center border-b-8 border-r-4 active:border-b-2 active:border-r-2 bg-yellow-500 below-835:w-[15rem] uppercase below-868:text-[1rem] below-868:mr-5"
                            >
                              <h1 className=" font-bold">
                                {"Read all the reviews"}{" "}
                              </h1>
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesRight;
