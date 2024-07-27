import React, { use, useCallback, useEffect, useState } from "react";
import ProductCard from "../product card/productCard";
// import {
//   relatedProduct,
//   updatedDataResponse,
// } from "@/app/categories/[categories]/[product]/page";

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
import { useCurrentUser } from "@/hooks/use-current-user";
import { fetchSingleProduct } from "@/actions/cart/fetchSingleProduct";
import LoadingAnimation from "../Loading/LoadingAnimation";

interface CategoriesRelatedProductProps {
  relatedProduct: relatedProduct[];
  ProductId: string; // Define ProductId as string
}

const CategoriesRelatedProduct: React.FC<CategoriesRelatedProductProps> = ({
  relatedProduct,
  ProductId,
  callToast,
  filteredId,
  categoryPageData,
}) => {
  if (!relatedProduct) return <div className=" bg-teal-600 min-h-[30rem] px-5 flex  items-center justify-center">
    <LoadingAnimation />
  </div>;

  const testData = relatedProduct;
  // console.log("this is the test related Data for wishlist", testData);
  // console.log(
  //   "this is the related product from related products page",
  //   relatedProduct
  // );
  // Filter out the product with the same ID as ProductId
  const filteredProducts = relatedProduct.filter(
    (product) => product.id !== filteredId
  );
  // console.log("this is the filtered test ", filteredProducts);
  // console.log("this is the product id from related products page:", filteredId);
  const [updatedProducts, setupdatedProducts] =
    useState<Product[]>(filteredProducts);

  // console.log("this is the updated test products", updatedProducts);
  // Initialize a state to control the merging process
  const [isMerged, setIsMerged] = useState(false);

  
  const [Added, setAdded] = useState(false);
  const [Removed, setRemoved] = useState(false);

  const [updatedRelatedProducts, setupdatedRelatedProducts] =
    useState(relatedProduct);

  useEffect(() => {
    const updatefunction = () => {
      setupdatedRelatedProducts(relatedProduct);
      setupdatedProducts(relatedProduct);
      // console.log(
      //   "this is the related product from categories products page",
      //   relatedProduct
      // );
      setIsMerged(false);
    };
    updatefunction();
  }, [relatedProduct]);

  // console.log(
  //   "this is the updatedProducts product from related products page",
  //   updatedProducts
  // );

  const { toast } = useToast();
  const user = useCurrentUser();
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // useEffect(() => {
  //   // Filter out the product with the filteredId
  //   // alert(filteredId)
  //   const filteredProducts = relatedProduct.filter(
  //     (product) => product.id !== filteredId
  //   );
  //   setupdatedProducts(filteredProducts);
  // }, [relatedProduct,filteredId]);

  const handleClickAdd = async (userID, productID) => {
    // alert("add to cart is being called")
    // console.log("this is the product id", productID);
    // const completedata = await fetchSingleProduct(productID);
    // console.log("this is the completed data", completedata);
    // // addProductToCart(userID, productID);
    // addCartDatatoCookies(completedata);

    if (categoryPageData == true) {
      const updatedRelatedProductsList = updatedRelatedProducts.map(
        (product) => {
          if (product.id === productID) {
            return { ...product, cartQuantity: 1 };
          }
          return product;
        }
      );
      // console.log(
      //   "this is the updated products test handliclick list",
      //   updatedRelatedProductsList
      // );

      setupdatedRelatedProducts(updatedRelatedProductsList);
      addCartDatatoCookies(updatedRelatedProductsList); // Otherwise, save updated data to cookies
    } else {
      const updatedProductsList = updatedProducts.map((product) => {
        if (product.id === productID) {
          return { ...product, cartQuantity: 1 };
        }
        return product;
      });
      // console.log(
      //   "this is the updated products test handliclick list",
      //   updatedProductsList
      // );

      setupdatedProducts(updatedProductsList);
      addCartDatatoCookies(updatedProductsList); // Otherwise, save updated data to cookies
    }

    if (userID) {
      await increaseProductQuantity(userID, productID);
    }

    // setUpdateTrigger((prev) => !prev);
  };

  const handleWishlistToggle = useCallback(
    // alert("handleWishlistToggle is called"),
    async (userId: string, productId: string) => {
      if (!user) {
        callToast({
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
      // console.log(
      //   "this is the updated test products list",
      //   updatedProductsList
      // );
      setupdatedProducts(updatedProductsList);

      const updatedRelatedProductsList = updatedRelatedProducts.map((product) =>
        product.id === productId
          ? { ...product, isWishlisted: !product.isWishlisted }
          : product
      );
      setupdatedRelatedProducts(updatedRelatedProductsList);

      const message = await toggleWishlist(userId, productId);

      setAdded(message.message === "added" ? true : false);
      setRemoved(message.message === "removed" ? true : false);

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
    },
    [updatedProducts, user, toast, updatedRelatedProducts]
  );

  const handleQuantityChange = useCallback(
    (userId: string, productId: string, change: number) => {
      // alert("i have been called")

      const updatedProductsList = updatedProducts.map((product) => {
        if (product.id === productId) {
          // Ensure quantity doesn't go below 0
          const currentQuantity = product?.cartQuantity
            ? product?.cartQuantity
            : 0; // Initialize to 0 if undefined or null
          const newQuantity = Math.max(currentQuantity + change, 0);
          // alert( newQuantity)
          return { ...product, cartQuantity: newQuantity };
        }
        return product;
      });
      // console.log(
      //   "this is the updated products test handliclick list",
      //   updatedProductsList
      // );
      setupdatedProducts(updatedProductsList);

      const updatedProductsListRelated = updatedRelatedProducts.map(
        (product) => {
          // alert("handlequantity changed is called")
          if (product.id === productId) {
            // Ensure quantity doesn't go below 0
            const currentQuantity = product?.cartQuantity
              ? product?.cartQuantity
              : 0; // Initialize to 0 if undefined or null
            const newQuantity = Math.max(currentQuantity + change, 0);
            // alert( newQuantity)
            return { ...product, cartQuantity: newQuantity };
          }
          return product;
        }
      );
      setupdatedRelatedProducts(updatedProductsListRelated);
      // console.log("these are the updated products", updatedProducts);

      if (categoryPageData == true) {
        // Save updated product information to cookies
        if (
          updatedProductsListRelated.find((product) => product.id === productId)
            ?.cartQuantity === 0
        ) {
          removeProductFromCookies(productId); // Remove product from cookies if cartQuantity is 0
        } else {
          // alert("addCartDatatoCookies is called")
          addCartDatatoCookies(updatedProductsListRelated); // Otherwise, save updated data to cookies
        }
      } else {
        // Save updated product information to cookies
        if (
          updatedProductsList.find((product) => product.id === productId)
            ?.cartQuantity === 0
        ) {
          removeProductFromCookies(productId); // Remove product from cookies if cartQuantity is 0
        } else {
          // alert("addCartDatatoCookies is called")
          addCartDatatoCookies(updatedProductsList); // Otherwise, save updated data to cookies
        }
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
    [updatedProducts, updatedRelatedProducts]
  );

  useEffect(() => {
    if (!isMerged) {
      async function mergeDataFromCookies() {
        const cookieData = await getCartDataFromCookies();
        // console.log("this is the updatedProducts data", updatedProducts);
        // create another function here to merge the login usercart lenght and the cookie cart length and then update the cart length in the shopping cart Icon
        const mergedProducts = updatedProducts.map((product) => {
          const cookieProduct = cookieData.find(
            (item) => item.id === product.id
          );
          return cookieProduct
            ? { ...product, cartQuantity: cookieProduct.cartQuantity }
            : product;
        });
        // console.log(
        //   "this is the meregedproduct inside the merged cookies",
        //   mergedProducts
        // );
        setupdatedProducts(mergedProducts);
        // console.log(
        //   "this is the updated related inside the useeffect products",
        //   updatedRelatedProducts
        // );

        const mergedRelatedProducts = updatedRelatedProducts.map((product) => {
          const cookieProduct = cookieData.find(
            (item) => item.id === product.id
          );
          return cookieProduct
            ? { ...product, cartQuantity: cookieProduct.cartQuantity }
            : product;
        });

        setupdatedRelatedProducts(mergedRelatedProducts);
        // console.log(
        //   "Merged related products with cookies:",
        //   mergedRelatedProducts
        // );

        // Set isMerged to true to avoid re-running the effect unnecessarily
        setIsMerged(true);
      }
      mergeDataFromCookies();
    }
  }, [updateTrigger, relatedProduct, isMerged]);

  // console.log("this is the updated related products", updatedRelatedProducts);
  return (
    <div>
      <div className="  bg-teal-600 min-h-[30rem] px-5 ">
        {/* <h1 className=" pt-4 pb-4 text-[2rem]">Related products</h1> */}
        {/* relatedProduct */}
        <div className=" flex  flex-wrap pl-3 below-460:w-[24rem] below-378:w-[20rem] below-378:pl-[5rem] below-321:pl-[1rem] below-695:pl-[1rem] ">
          {categoryPageData
            ? updatedRelatedProducts
                .filter((product) => product.id !== ProductId)
                .map((product) => (
                  <div className="py-4" key={product.id}>
                    <ProductCard
                    callToast={callToast}
                    Added={Added}
                    Removed={Removed}
                      product={product}
                      productId={product.id}
                      handleQuantityChange={handleQuantityChange}
                      handleWishlistToggle={handleWishlistToggle}
                      handleClickAdd={handleClickAdd}
                      catRelatedProduct={true}
                    />
                  </div>
                ))
            : updatedProducts
                .filter((product) => product.id !== ProductId)
                .map((product) => (
                  <div className="py-4" key={product.id}>
                    <ProductCard
                    callToast={callToast}
                    Added={Added}
                    Removed={Removed}
                      product={product}
                      productId={product.id}
                      handleQuantityChange={handleQuantityChange}
                      handleWishlistToggle={handleWishlistToggle}
                      handleClickAdd={handleClickAdd}
                      catRelatedProduct={true}
                    />
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesRelatedProduct;
