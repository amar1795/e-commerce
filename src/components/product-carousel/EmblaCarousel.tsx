"use client";
import React, { useState, useCallback, useEffect } from "react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";
import { DotButton, useDotButton } from "./EmblaCarouselDotButton";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./EmblaCarouselArrowButtons";
import { Heart, Minus, Plus, StarIcon, ShoppingCart } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/ui/use-toast";
import { toggleWishlist } from "@/actions/wishlist";
import increaseProductQuantity from "@/actions/cart/increaseProduct";
import decreaseProductQuantity from "@/actions/cart/decreaseProduct";
import {
  addCartDatatoCookies,
  getCartDataFromCookies,
  removeProductFromCookies,
} from "@/actions/cart/addCartDatatoCookies";
import WishlistButton from "../animated_heart/heart";
import ProductCardLower from "../ProductCardLower";

export type Brand = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Image = {
  url: string;
  altText?: string;
};

export type Category = {
  id: string;
  name: string;
  parentId: string;
  parentName: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  brandId: string;
  discount: number | null;
  discountedPrice: number | null;
  description: string;
  categoryId: string;
  category: Category;
  isWishlisted: boolean;
  cartItems: any;
  createdAt: Date;
  updatedAt: Date;
  brand: Brand;
  images: Image[];
};

export type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
  products: Product[];
  category: string;
};

const EmblaCarousel: React.FC<PropType> = (props) => {
  const {
    slides,
    options,
    products,
    category,
    color,
    size,
    productVarientID,
    stock,
  } = props;
  const [updatedProducts, setupdatedProducts] = useState<Product[]>(products);
  // const [color, setColor] = useState();
  // const [size , setSize] = useState();
  // const [productVarientID , setProductVarientID] = useState();
  // const [stock , setStock] = useState();

  console.log("this is the product", updatedProducts);

  const { theme } = useTheme();
  const { toast } = useToast();

  const user = useCurrentUser();

  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const callToast = ({varientType,message,description}) => {
    toast({
      variant: varientType,
      title: `${message}`,
      description: `${description}`,
    });
  }

  const handleWishlistToggle = useCallback(
    async (userId: string, productId: string) => {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Not Logged In",
          description: "Please login to wishlist this item",
        });
        return;
      }

      const updatedProductsList = updatedProducts.map((product) =>
        product.id === productId
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      );

      setupdatedProducts(updatedProductsList);

      setTimeout(async () => {
        const message = await toggleWishlist(userId, productId);
        toast({
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

  const handleQuantityChange = useCallback(
    (userId: string, productId: string, change: number) => {
      const updatedProductsList = updatedProducts.map((product) => {
        if (product.id === productId) {
          // Ensure quantity doesn't go below 0
          const currentQuantity = product?.cartQuantity
            ? product?.cartQuantity
            : 0; // Initialize to 0 if undefined or null
          const newQuantity = Math.max(currentQuantity + change, 0);
          // need to add colour and size of the first pdocut varient as well
          // alert( newQuantity)
          return { ...product, cartQuantity: newQuantity };
        }
        return product;
      });
      setupdatedProducts(updatedProductsList);

      console.log("these are the updated products", updatedProducts);

      // Save updated product information to cookies
      if (
        updatedProductsList.find((product) => product.id === productId)
          ?.cartQuantity === 0
      ) {
        removeProductFromCookies(productId); // Remove product from cookies if cartQuantity is 0
      } else {
        addCartDatatoCookies(updatedProductsList); // Otherwise, save updated data to cookies
      }

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

  // useEffect to monitor changes to updatedProducts and save to cookies
  // useEffect(() => {
  //   async function saveToCookies() {
  //     await addCartDatatoCookies(updatedProducts);
  //   }
  //   saveToCookies();
  // }, [updatedProducts]);

  // useEffect to load data from cookies and merge with fetched products on component mount
  // adding dependency as product was causing infinite loop

  // merging the cookie data with the fetched data
  useEffect(() => {
    async function mergeDataFromCookies() {
      const cookieData = await getCartDataFromCookies();
      // create another function here to merge the login usercart lenght and the cookie cart length and then update the cart length in the shopping cart Icon
      const mergedProducts = updatedProducts.map((product) => {
        const cookieProduct = cookieData.find((item) => item.id === product.id);
        return cookieProduct
          ? { ...product, cartQuantity: cookieProduct.cartQuantity }
          : product;
      });

      setupdatedProducts(mergedProducts);
    }

    mergeDataFromCookies();
  }, []);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;
    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;
    resetOrStop();
  }, []);

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi, onNavButtonClick);

  const formatPrice = (price: number): string =>
    "₹" + price?.toLocaleString("en-IN");

  return (
    <section className="ProductEmbla_product">
      <div className="embla__viewport_product" ref={emblaRef}>
        <div className="Product_embla__container">
          {!products ? (
            <>
              {slides.map((index) => (
                <div className="embla__slide_product" key={index}>
                  <div className="embla__slide__number__product">
                    <div className="ProductImageCard h-60 over">
                      {/* <Link href={`categories/men/sdgsg`}> */}
                        <div className="ProductImage bg-red-400 h-full w-full">
                          <button className="heartButton">
                            <Heart size={40} />
                          </button>
                        </div>
                      {/* </Link> */}
                    </div>
                    <div className="ProductDetails">
                      <div className="card_slider px-4 pb-5">
                        <div className="">Company name</div>
                        <div className="font-extralight text-lg">
                          product name
                        </div>
                        <div>Price</div>
                        {/* <Link href={`categories/${category}/sdgsg`}> */}
                          <button className="buynow">
                            <div>
                              <ShoppingCart size={30} />
                            </div>
                            <div className="text-sm px-3">Buy Now</div>
                          </button>
                        {/* </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {updatedProducts.slice(0, 7).map((product, index) => (
                <div key={product.id}>
                  <div className="embla__slide_product">
                    {index !== 6 ? (
                      <div className="embla__slide__number__product">
                        

                        
                        <div className="ProductImageCard h-[16rem] over ">
                          <div className="ProductImage bg-red-400 h-full w-full">
                            <div
                              className={`heartButton hover:text-red-500`}
                              onClick={() =>
                                handleWishlistToggle(user?.id, product.id)
                              }
                            >
                              {/* <Heart
                                size={40}
                                strokeWidth={0.7}
                                className={`hover:fill-red-500 text-black ${product?.isWishlisted ? "fill-red-500" : ""}`}
                              /> */}
                              <WishlistButton
                                isWishlistedData={product.isWishlisted}
                              />
                            </div>
                            <Link
                              href={`categories/${category}/${product.category?.name.replace(
                                /\s+/g,
                                ""
                              )}/${product.id}`}
                            >
                              {
                                product?.images &&  <img
                                src={product?.images[0]?.url}
                                alt={
                                  product?.images[0]?.altText || "Product Image"
                                }
                              />
                              }
                             
                            </Link>
                          </div>
                        </div>

                        <ProductCardLower product={product} theme={theme} formatPrice={formatPrice} callToast={callToast} />
                        
                      </div>
                    ) : (
                      <Link
                        href={`${process.env.MAIN_DOMAIN}/categories/${category}`}
                      >
                        <div className="embla__slide__number__product bg-yellow-500">
                          <div className="flex flex-col justify-center self-center h-full">
                            <h1 className="text-[3rem] italic pl-5">
                              See More in {category} Categories
                            </h1>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              <div className="lastCard">
                <div className="embla__slide_product"></div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="embla__controls_product">
        <div className="previous absolute top-52 left-5 h-full flex self-center">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        </div>
        <div className="next absolute top-52 right-5">
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  );
};

export default EmblaCarousel;
