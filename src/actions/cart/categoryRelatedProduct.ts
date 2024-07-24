"use server";

import { prismadb } from "@/lib/db";
import { tr } from "@faker-js/faker";
import { revalidatePath } from "next/cache";
import { fetchAllCartCookieData } from "./fetchAllCartCookieData";

// let count=0;
// Function to get related products
export async function getRelatedProducts(userId: string) {
  // console.log("get related products function  has been called", count++);
  // Fetch the user's cart

  let cartProducts=[];

  if(userId) 
  {
    const cart = await prismadb.cart.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { cartItems: { include: { product: true } } }
    });
  
    if (!cart ) {
      const { mergedData } = await fetchAllCartCookieData();
    cartProducts = mergedData;
    }
    else if (cart.cartItems.length === 0)
    {
       cartProducts = [];
    }
    else
    cartProducts = cart.cartItems.map(item => item.product);

  }
  else{
    
    const { mergedData } = await fetchAllCartCookieData();
    cartProducts = mergedData;
  }
 


  const parentCategories = [];

  // Find parent categories for each product in the cart
  for (const product of cartProducts) {
    const category = await prismadb.category.findUnique({
      where: { id: product.categoryId },
      select: { parentId: true }
    });
    if (category?.parentId) {
      parentCategories.push(category.parentId);
    }
  }

  const uniqueParentCategories = [...new Set(parentCategories)];

  // Find all children categories from the unique parent categories
  let allChildrenCategories = [];
  for (const parentId of uniqueParentCategories) {
    const childrenCategories = await prismadb.category.findMany({
      where: { parentId },
      select: { id: true }
    });
    allChildrenCategories.push(...childrenCategories.map(category => category.id));
  }

  allChildrenCategories = [...new Set(allChildrenCategories)]; // Deduplicate

//   // Fetch related products in a cyclic manner from the children categories
//   let relatedProducts = [];
//   let index = 0;

//   while (relatedProducts.length < 6 && allChildrenCategories.length > 0) {
//     const categoryId = allChildrenCategories[index % allChildrenCategories.length];
//     const products = await prismadb.product.findMany({
//       where: { categoryId },
//       include: {
//         images: {
//           select: { url: true },
//           take: 1
//         }
//       },
//       take: 10, // Fetch more products to ensure we can pick a different one
//     });

//     // Filter out already selected products
//     const newProducts = products.filter(
//       product => !relatedProducts.some(rp => rp.id === product.id)
//     );

//     // Select the first new product
//     if (newProducts.length > 0) {
//       relatedProducts.push(newProducts[0]);
//     }

//     index++;
//   }
  

 // Fetch a large number of products from the children categories
 let potentialProducts = [];
 for (const categoryId of allChildrenCategories) {
   const products = await prismadb.product.findMany({
     where: { categoryId },
     include: {
       images: {
         select: { url: true },
         take: 1
       },
       productVariants: {
        take: 1, // Fetch only the first product variant
        include: {
          color: true,
          size: true,
        },
      },
       ratings: true,
       ...(userId && {
        wishlists: {
          where: {
            userId: userId,
          },
        },
      }),
     }
   });
   potentialProducts.push(...products);
 }

 potentialProducts = potentialProducts.filter(
   product => !cartProducts.some(cartProduct => cartProduct.id === product.id)
 );

 // Shuffle the array to pick random products
 potentialProducts = potentialProducts.sort(() => 0.5 - Math.random());

 const formattedProducts = potentialProducts.map((product) => {
    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const reviews = [];
    let totalRatings = 0;
    let totalRatingValue = 0;

    product.ratings.forEach((rating) => { 
      ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
      totalRatingValue += rating.rating; // Sum the star counts weighted by their star value
      totalRatings += 1;
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalRatings > 0 ? totalRatingValue / totalRatings : 0;

      const isWishlisted = userId && product.wishlists.length > 0;

    return {
      ...product,
      isWishlisted: isWishlisted,
      color:product.productVariants && product.productVariants[0]?.color?.name,
      size: product.productVariants && product.productVariants[0]?.size?.name,
      stock: product.productVariants && product.productVariants[0]?.stock,
      productVarientID:product.productVariants &&  product.productVariants[0]?.id,
      ratings: {
        count: ratingsCount,
        reviews: reviews,
        totalReviews: totalReviews,
        totalRatings: totalRatings,
        averageRating: averageRating,
      },
    };
  });


  // Select 6 unique products
  const relatedProducts = formattedProducts.slice(0, 6);
  revalidatePath("/cart")
  // Ensure we do not exceed 6 products
  console.log("relatedProducts", relatedProducts.length);
  return relatedProducts;
}


  
