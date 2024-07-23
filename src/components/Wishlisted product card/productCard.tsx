"use client"
import { Heart, Minus, Plus, ShoppingCart, StarIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import "./product.css";
import Image from "next/image";
import {
  relatedProduct,
  updatedDataResponse,
} from "@/app/categories/[categories]/[product]/page";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { removeFromWishlist } from "@/actions/wishlist";
import { useCurrentUser } from "@/hooks/use-current-user";
import { revalidatePath } from "next/cache";
import { toast } from "@/components/ui/use-toast";
import { getProductDetailsByID } from "@/actions/product/searchedProductData";

const formatPrice = (price: number): string => {
  // Format the price with the Indian Rupee symbol
  return "₹" + price?.toLocaleString("en-IN");
};

// Function to remove spaces from a string
const removeSpaces = (name: string): string => {
  return name?.replace(/\s+/g, "");
};

const WishlistedProductCard: React.FC<updatedDataResponse> = ({ product,setData }) => {
  const user = useCurrentUser();
  const [url, setUrl] = useState("");

console.log("this is the product",product)
 

  const handleRemoveClick = async (userId, productId) => {
    await removeFromWishlist(userId, productId);
    // setData((prev) => !prev);
    // for the data to be validated the route should be a server component and the data should be fetched from the server 
    toast({
      variant: "destructive",
      title: "ITEM DELETED",
      description: "Item removed from wishlist",
    })
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductDetailsByID(product.id);
      console.log("this is the fetched data", data);
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
  }, [product]);

  return (
    <div>
      <div className="sembla__slide_product pl-[3rem] ">
        <div
          className="sembla__slide__number__product flex flex-col relative min-h-[25rem] w-[18rem]  border-2 border-black border-b-8 border-r-4
        transition-transform duration-300 ease-in-out hover:scale-110"
        >
          {/* top part */}
          <button>
            <div className="ProductImageCard min-h-[19rem] relative ">
              <button className={`heartButton z-10 hover:text-red-500`}>
                <Trash2
                
                  onClick={() => handleRemoveClick(user?.id, product.id)}
                  size={40}
                  strokeWidth={0.8}
                  className={` hover:fill-red-500 text-black`}
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
          {/* middle part */}
          {/* <div className=" text-sm flex justify-between bg-opacity-20 backdrop-blur-lg border border-white/30 ">
            <div className=" bg-gray-200 w-16  ">
              <div className=" flex justify-between px-2 pt-1">
                <span>{product?.ratings?.averageRating.toFixed(1)}</span>
                <div className=" self-center">
                  <StarIcon size={20} stroke="" fill="black" />
                </div>
              </div>
            </div>
            <div>
              <div className="box flex pr-4">
                <button className=" pr-2  hover:bg-gray-200 pl-1">
                  <Minus size={20} />
                </button>
                <div className=" text-[1.5rem] w-7  bg-white  h-[2rem]">
                  <div className=" px-2 py-2 ">0</div>
                </div>
                <button className=" pl-2  hover:bg-gray-200 pr-1">
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div> */}
          {/* Bottom part */}
          <div className="ProductDetails  ">
            <div className="Wishlistedcard_slider px-2 pb-5 w-full text-[1.5rem]   flex justify-between bg-white bg-opacity-20 backdrop-blur-lg border border-white/30  ">
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
                <div className=" flex ">
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
              <div className="right self-center ">
                <Link href={url}>
                <button className="nbutton items-center border-2 border-black p-2   justify-between hidden ">
                  <div>
                    <ShoppingCart size={20} />
                  </div>
                  <div className="text-sm px-3">Buy Now</div>
                </button>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistedProductCard;
