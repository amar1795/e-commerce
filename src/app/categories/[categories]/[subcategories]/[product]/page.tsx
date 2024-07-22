"use client";
import { BreadcrumbWithCustomSeparator } from "@/components/breadcrumb";
import MainFooter from "@/components/footer";
import { MainNav } from "@/components/main-nav";
import React, { use, useCallback, useEffect, useState } from "react";
import {
  DollarSign,
  Heart,
  Star,
  StarIcon,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { SelectSeparator } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import StarChart from "@/components/star charts/starChart";
import ProductCard from "@/components/product card/productCard";
import Image from "next/image";
import PhotoViewer from "@/components/photo viewer/photoViewer";
import CategoriesRight from "@/components/categories/CategoriesRight";
import CategoriesRelatedProduct from "@/components/categories/CategoriesRelatedProduct";
import {
  fetchProductAllData,
  getProductsByCategory,
  getProductsByCategoryOriginal,
} from "@/actions/createProduct";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/ui/use-toast";
import { toggleWishlist } from "@/actions/wishlist";
import {
  addCartDatatoCookies,
  getCartDataFromCookies,
  removeProductFromCookies,
} from "@/actions/cart/addCartDatatoCookies";
import { fetchSingleProduct } from "@/actions/cart/fetchSingleProduct";
import increaseProductQuantity from "@/actions/cart/increaseProduct";
import decreaseProductQuantity from "@/actions/cart/decreaseProduct";
//meta data generation
// export async function generateMetadata({ params }: { params: { product: string}}) {

//   const post = await await fetchProductAllData(params.product)
//   return {
//     title: post?.name,
//     description: post?.description,
//   };
// }

export type relatedProduct = {
  id: string;
  name: string;
};

export type updatedDataResponse = {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  discountedPrice: number | null;
  description: string;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
  images: {
    id: string;
    url: string;
  }[];

  ratings: {
    count: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
    reviews: {
      rating: number;
      review: string;
    }[];
    totalReviews: number;
    totalRatings: number;
    averageRating: number;
  };
  createdAt: string;
  updatedAt: string;
};

const page = ({ params }: { params: { product: string } }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const user = useCurrentUser();

  console.log("this is the session", session?.user?.id);

  const [outOfStock, setoutOfStock] = React.useState(false);

  const [data, setData] = React.useState<updatedDataResponse | null>(null);

  const [relatedProducts, setRelatedProducts] = React.useState<
    relatedProduct[] | null
  >(null);
  
  const [parentCategory, setParentCategory] = React.useState<string>("");
  const [mensCollectionData, setMensCollectionData] = React.useState<any[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [updateChart, setUpdateChart] = useState(false);
  const [initialColor, setInitialColor] = useState("");
  const [initialSize, setInitialSize] = useState("");
  const [updatedProducts, setupdatedProducts] = useState([]);
console.log("this is the initial colour and size", initialColor, initialSize)
  console.log(
    "this is the updatedProducts product from related products page",
    updatedProducts
  );



  // this user doesn't work for some reason whereas this is meant to be used in the client side
  // const { user } = useCurrentUser();

  const currentUser = session?.user?.id;

  const callToast = ({ variant, title, description }) => {
    // alert("toast is being  called")
    toast({
      variant: variant,
      title: title,
      description: description,
    });
  };

  useEffect(() => {
    const updateData = async () => {
      // alert("I am being called")
      // this needs to be revalidated via polling every 30 minutes because if everyone starts rating it simulteneously it will hit the backend mulitple times
      const updatedData: updatedDataResponse | undefined =
        await fetchProductAllData(params.product);
      console.log("this is the updatedData:", updatedData);
      setupdatedProducts(updatedData || null);

      // const relatedProducts = await getProductsByCategoryOriginal(updatedData?.category?.parentId)
      const relatedProducts = await getProductsByCategory(
        updatedData?.category?.id
      );
      // issue is here the wihsliost is coming to be empty "" string hence unable to update the wishlist properly
      console.log("this is the related products test", relatedProducts);

      const filteredRelatedProducts = relatedProducts.filter(
        (item) => item.id !== updatedData?.id
      );
      setRelatedProducts(filteredRelatedProducts);

      setParentCategory(updatedData?.category?.parentName || "");
      // alert("update Data is being called")
      // console.log("these are the related products:", relatedProducts);
    };

    updateData();
  }, []);

  // useEffect(() => {
  //   const updateData = async () => {

  //     // alert("I am being called")
  //         const relatedProducts = await getProductsByCategory(updatedProducts?.id)
  //       setRelatedProducts(relatedProducts);

  //       // console.log("these are the related products:", relatedProducts);
  //   };

  //   updateData();

  // }, [updateTrigger]);

  const handleWishlistToggle = useCallback(
    async (userId: string, productId: string) => {
      if (!user) {
        callToast({
          variant: "destructive",
          title: "Not Logged In",
          description: "Please login to wishlist this item",
        });
        return;
      }

      if (updatedProducts.id === productId) {
        const updatedProductsList = {
          ...updatedProducts,
          isWishlisted: !updatedProducts.isWishlisted,
        };

        setupdatedProducts(updatedProductsList);
      }

      setTimeout(async () => {
        const message = await toggleWishlist(userId, productId);
        callToast({
          variant: message.message === "added" ? "default" : "destructive",
          title:
            message.message === "added"
              ? "Added to Wishlist"
              : "Removed from Wishlist",
          description:
            message.message === "added"
              ? "The item has been wishlisted"
              : "The item has been removed from wishlist",
        });
      }, 200);
    },
    [updatedProducts, user, toast]
  );

  const handleClickAdd = async (
    userID,
    productID,
    selectedColor,
    selectedSize
  ) => {
    // alert("add to cart is being called")
    console.log(
      "this is the product from handleadd to the cart function ",
      userID,
      productID,
      selectedColor,
      selectedSize
    );
    console.log("this is the product id", productID);
    const completedata = await fetchSingleProduct(productID);
    completedata.map((item) => {
      if (item.id === productID) {
        const newData = { ...item, cartQuantity: 1 };
        console.log("this is the new data", newData);
        addCartDatatoCookies([newData]);
      }
    });

    if (user) {
      setTimeout(async () => {
        // alert("increase quantity is called", userID, productId)
        await increaseProductQuantity(userID, productID);
      }, 200);
    }

    // addProductToCart(userID, productID);

    setUpdateTrigger((prev) => !prev);
  };

  const handleQuantityChange = useCallback(
    (userId: string, productId: string, change: number) => {
      // alert("i have been called")

      // let updatedProductsList;
      if (updatedProducts.id === productId) {
        // Ensure quantity doesn't go below 0
        const currentQuantity = updatedProducts?.cartQuantity
          ? updatedProducts?.cartQuantity
          : 0; // Initialize to 0 if undefined or null
        const newQuantity = Math.max(currentQuantity + change, 0);
        // alert( newQuantity)
        const updatedProductsList = {
          ...updatedProducts,
          cartQuantity: newQuantity,
        };
        setupdatedProducts(updatedProductsList);
        console.log("this is the updated products", updatedProductsList);

        if (updatedProductsList?.cartQuantity === 0) {
          // alert(updatedProductsList?.cartQuantity)
          removeProductFromCookies(productId); // Remove product from cookies if cartQuantity is 0
        } else {
          addCartDatatoCookies([updatedProductsList]); // Otherwise, save updated data to cookies
        }
      }

      // Save updated product information to cookies

      if (user) {
        setTimeout(async () => {
          if (change > 0) {
            // alert("increase quantity is called", userId, productId)
            await increaseProductQuantity(userId, productId);
          } else {
            // alert("decrease quantity is called")
            await decreaseProductQuantity(userId, productId);
          }
        }, 200);
      }
    },
    [updatedProducts]
  );

  useEffect(() => {
    async function mergeDataFromCookies() {
      const cookieData = await getCartDataFromCookies();
      // create another function here to merge the login usercart lenght and the cookie cart length and then update the cart length in the shopping cart Icon
      // alert("Merge data from cookie called")
      const updatedData: updatedDataResponse | undefined =
        await fetchProductAllData(params.product);
      console.log("this is the updatedData:", updatedData);

      const cookieProduct = cookieData.find(
        (item) => item.id === updatedData?.id
      );
      if (cookieProduct) {
        const mergedProducts = {
          ...updatedData,
          cartQuantity: cookieProduct.cartQuantity,
        };

        setupdatedProducts(mergedProducts);
      }

      else{
        // need to optimize this part 
        const mergedProducts = {
          ...updatedData,
          cartQuantity: 0,
        };
        
        setupdatedProducts(mergedProducts)
      }

      setInitialColor(updatedProducts?.productVariants?.[0]?.color);
       setInitialSize(updatedProducts?.productVariants?.[0]?.size);
    }

    mergeDataFromCookies();
  }, [updateTrigger]);

  const ProductId = data?.id;
  // console.log("this is the product id:", ProductId);
  //   console.log("these are the related product:", relatedProducts);
  const completeUrl = typeof window !== "undefined" ? window.location.href : "";
  const segments = completeUrl.split("/");
  const previousSegment = segments[segments.length - 2];
  const previousSegment1 = segments[segments.length - 3];
  // console.log("this is the Previous segment:", previousSegment);
  const images = [
    "https://images.pexels.com/photos/23541799/pexels-photo-23541799/free-photo-of-shine-bright.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/17395579/pexels-photo-17395579/free-photo-of-shiny-water-at-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/20632751/pexels-photo-20632751/free-photo-of-a-cup-of-tea-and-dates-on-a-white-cloth.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/19602378/pexels-photo-19602378/free-photo-of-hands-holding-pizzas.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/23541799/pexels-photo-23541799/free-photo-of-shine-bright.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/20582544/pexels-photo-20582544/free-photo-of-waves.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/24023467/pexels-photo-24023467/free-photo-of-a-wedding-reception-in-a-greenhouse-with-chandeliers.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ];

  const breadcrumbsData = [
    { id: 1, href: "/", label: "Home" },
    { id: 2, href: `/categories/${previousSegment1}`, label: previousSegment1 },
    {
      id: 3,
      href: `/categories/${previousSegment1}/${previousSegment}`,
      label: previousSegment,
    },
    { id: 4, href: params.product, label: data?.name },
  ];

  // console.log("this is the data:", data);

  // console.log("this is the data i am searching:", data?.images);
  return (
    <div className=" overflow-hidden">
      {/* <div className="fixed top-0 left-0 right-0  z-10">
        <MainNav mensCollectionData={mensCollectionData} />
      </div> */}

      <div className=" mt-[8rem]">
        <div>
          <div className="mt-5 mb-5">
            <BreadcrumbWithCustomSeparator items={breadcrumbsData} />
          </div>

          <div className=" bg-orange-300 h-auto flex ">
            <div className=" bg-orange-300 flex-1 h-auto">
              <PhotoViewer images={updatedProducts?.images} />
            </div>
            <div className="flex-1 h-[100rem]">
              {/* right component */}
              {/* brand:string */}

              <CategoriesRight
                data={updatedProducts}
                initialColor={initialColor}
                initialSize={initialSize}
                handleWishlistToggle={handleWishlistToggle}
                handleClickAdd={handleClickAdd}
                handleQuantityChange={handleQuantityChange}
                callToast={callToast}
                setUpdateChart={setUpdateChart}
                setUpdateTrigger={setUpdateTrigger}
              />
              {/* <h1 className=" text-[2rem]">{data?.brand.name}</h1>  */}
            </div>
          </div>
          <div>
            <div className="bg-teal-600   pt-6">
              <h3 className=" ml-8 w-[20rem] text-[2rem] leading-none p-2 border-2 border-black text-black  flex self-center justify-center border-b-8 border-r-4 bg-yellow-500">
                Related Products
              </h3>
            </div>
            <CategoriesRelatedProduct
              relatedProduct={relatedProducts}
              ProductId={ProductId}
              callToast={callToast}
              filteredId={params.product}
            />
          </div>
          <MainFooter />
        </div>
      </div>
    </div>
  );
};

export default page;
