"use server";
// pages/api/createDummyUsers.js
import { faker } from "@faker-js/faker";
import { prismadb } from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs";
import { cache } from "react";
import { auth } from "@/auth";

interface ProductParams {
  productName: string;
  productPrice: number;
  productDiscountPercentage: number;
  productDescription: string;
  productImages: string[];
  productCategoryId: string;
  productBrandId: string;
}

export async function deleteProduct(productId: string) {
  try {
    const deletedProduct = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });
    // console.log("Product deleted:", deletedProduct);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}
export async function createProduct({
  productName,
  productPrice,
  productDiscountPercentage,
  productDescription,
  productImages,
  productCategoryId,
  productBrandId,
}: ProductParams) {
  try {
    const price = productPrice; // Original price of the product
    const discountPercentage = productDiscountPercentage; // Discount percentage (e.g., 10% off)

    // Calculate the discount amount
    const discountAmount = (price * discountPercentage) / 100;

    // Calculate the discounted price
    const discountedPrice = price - discountAmount;
    const formalShirt = await prismadb.product.create({
      data: {
        name: productName,
        price: price,
        discount: discountPercentage, // Discount amount in currency (e.g., $10 off)
        discountedPrice: discountedPrice, // Discounted price after applying the discount
        brandId: productBrandId, // Replace with the actual Brand ID
        description: productDescription,
        categoryId: productCategoryId, // Replace with actual Formal Shirts Category ID
        images: {
          create: productImages.map((image) => ({
            url: image,
          })),
        },
      },
    });
    // console.log("Product created:", formalShirt);
  } catch (error) {
    console.error("Error creating product:", error);
  }
}

// creating product varient

export async function createProductVarientOld() {
  try {
    const productID = "665af50e3220eba7c7eab944"; // Replace with the actual product ID
    const productVariants = await prismadb.productVariant.createMany({
      data: [
        {
          productId: productID,
          colorId: "66570726617228492bfcb586",
          sizeId: "665aca6e5788e185779d7ce6",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb586",
          sizeId: "665aca6e5788e185779d7ce7",
          stock: 12,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb586",
          sizeId: "665aca6e5788e185779d7ce8",
          stock: 15,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb588",
          sizeId: "665aca6e5788e185779d7ce6",
          stock: 17,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb588",
          sizeId: "665aca6e5788e185779d7ce7",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb588",
          sizeId: "665aca6e5788e185779d7ce8",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb589",
          sizeId: "665aca6e5788e185779d7ce6",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb589",
          sizeId: "665aca6e5788e185779d7ce7",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb589",
          sizeId: "665aca6e5788e185779d7ce8",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb58a",
          sizeId: "665aca6e5788e185779d7ce6",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb58a",
          sizeId: "665aca6e5788e185779d7ce7",
          stock: 10,
        },
        {
          productId: productID,
          colorId: "66570726617228492bfcb58a",
          sizeId: "665aca6e5788e185779d7ce8",
          stock: 10,
        },
      ],
    });

    // console.log("Product variants created:", productVariants);
  } catch (error) {
    console.error("Error creating product variant:", error);
  }
}

export async function createProductRating() {
  try {
    const productId = "665af50e3220eba7c7eab944"; // Replace with the actual product ID
    const userId = "6655adcc05f2665c9bc85c1a"; // Replace with the actual User ID

    // Create 75 five-star ratings without reviews
    for (let i = 0; i < 90; i++) {
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 5,
          userId: userId,
        },
      });
    }

    // Create 15 four-star ratings without reviews
    for (let i = 0; i < 85; i++) {
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 4,
          userId: userId,
        },
      });
    }

    // Create 5 three-star ratings without reviews
    for (let i = 0; i < 15; i++) {
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 3,
          userId: userId,
        },
      });
    }

    // Create 4 two-star ratings without reviews
    for (let i = 0; i < 14; i++) {
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 2,
          userId: userId,
        },
      });
    }

    // Create 1 one-star rating without review
    await prismadb.rating.create({
      data: {
        productId: productId,
        rating: 1,
        userId: userId,
      },
    });
  } catch (error) {}
}
export async function createProductReview(productID: string) {
  try {
    const productId = productID; // Replace with the actual product ID
    const userId = "6655adcc05f2665c9bc85c1a";
    // Define arrays of different reviews for each star rating
    const fiveStarReviews = [
      "This product exceeded my expectations! Amazing quality and fit.",
      "Absolutely love this shirt! Great fabric and comfortable to wear.",
      "Excellent purchase! Exactly what I was looking for.",
      "Highly recommend this shirt. It looks even better in person!",
      "Couldn't be happier with my purchase. Will definitely buy again.",
    ];

    const fourStarReviews = [
      "Overall satisfied with the product, although the sizing runs a bit large.",
      "Good quality shirt, but the color is slightly different from the picture.",
      "Nice design and comfortable to wear, but the fabric is thinner than expected.",
      "Decent shirt for the price, but the stitching could be better.",
      "Happy with the purchase, but delivery took longer than anticipated.",
    ];

    const threeStarReviews = [
      "Average shirt. Not exceptional, but not terrible either.",
      "Expected better quality for the price. It's just okay.",
      "The shirt arrived with a small stain, which was disappointing.",
      "Meh. Nothing special about this shirt.",
      "The fit is okay, but the material feels cheap.",
    ];

    const twoStarReviews = [
      "Not impressed. Shirt started to fade after just a few washes.",
      "Poor quality. Seams started coming apart after wearing it twice.",
      "Disappointed with the sizing. It runs much smaller than expected.",
      "Shirt arrived damaged. Looks like it was poorly packaged.",
      "Would not recommend. Better off spending a bit more for better quality.",
    ];

    const oneStarReview = [
      "Absolutely terrible! The shirt arrived with holes in it.",
      "Complete waste of money. The fabric feels like sandpaper.",
      "Zero stars if I could! The color faded after just one wash.",
      "Horrible quality. It shrunk two sizes after washing.",
      "I wouldn't even use this shirt as a rag. It's that bad.",
      "Avoid at all costs! The stitching unraveled after wearing it once.",
    ];
    // Create 75 five-star ratings with random reviews
    for (let i = 0; i < 55; i++) {
      const randomReview =
        fiveStarReviews[Math.floor(Math.random() * fiveStarReviews.length)];
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 5,
          review: randomReview,
          userId: userId, // Replace userId with the actual User ID
        },
      });
    }

    // Create 15 four-star ratings with random reviews
    for (let i = 0; i < 45; i++) {
      const randomReview =
        fourStarReviews[Math.floor(Math.random() * fourStarReviews.length)];
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 4,
          review: randomReview,
          userId: userId, // Replace userId with the actual User ID
        },
      });
    }

    // Create 5 three-star ratings with random reviews
    for (let i = 0; i < 15; i++) {
      const randomReview =
        threeStarReviews[Math.floor(Math.random() * threeStarReviews.length)];
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 3,
          review: randomReview,
          userId: userId, // Replace userId with the actual User ID
        },
      });
    }

    // Create 4 two-star ratings with random reviews
    for (let i = 0; i < 10; i++) {
      const randomReview =
        twoStarReviews[Math.floor(Math.random() * twoStarReviews.length)];
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 2,
          review: randomReview,
          userId: userId, // Replace userId with the actual User ID
        },
      });
    }

    // Create 1 one-star rating with fixed review
    for (let i = 0; i < 20; i++) {
      const randomReview =
        twoStarReviews[Math.floor(Math.random() * oneStarReview.length)];
      await prismadb.rating.create({
        data: {
          productId: productId,
          rating: 1,
          review: randomReview,
          userId: userId, // Replace userId with the actual User ID
        },
      });
    }

    // console.log("Product reviews created");
  } catch (error) {
    console.error("Error creating product reviews:", error);
  }
}

export async function fetchProduct(productId) {
  
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: true, // Include the category
      brand: true, // Include the brand
      // images: true, // Include the images

      productVariants: {
        include: {
          color: true,
          size: true,
        },
      },
    },
  });

     // Transform productVariants to include color and size names
     const transformedProductVariants = product.productVariants.map((variant) => ({
      ...variant,
      color: variant.color.name, // Replace color object with its name
      size: variant.size.name, // Replace size object with its name
    }));

    const transformedProduct = {
      ...product,
      productVariants: transformedProductVariants.length,
      productVariants: transformedProductVariants,
    };
  // product?.productVariants.forEach((variant) => {
  //   // Accessing color and size properties directly
  //   const color = variant.color.name; // Assuming 'name' is the property containing the color name
  //   const size = variant.size.name; // Assuming 'name' is the property containing the size name

  //   console.log("Color:", color);
  //   console.log("Size:", size);
  // });

  // const category = await prismadb.category.findUnique({
  //   where: {
  //     id: product?.categoryId,
  //   },
  // });

  // Access category name
  // const categoryName = category?.name;

  // console.log("Product:", transformedProduct);
  // console.log("Category:", categoryName);
}

export async function fetchAllProduct() {
  const product = await prismadb.product.findMany();
  const productCount = product.length;

  // console.log("This is the product Category:", product);
  try {
    //   // Convert products to JSON string
    //   const productsJSON = JSON.stringify(product, null, 2);

    //   // Write JSON string to a file named products.json
    //   fs.writeFileSync('products.json', productsJSON);

    // console.log("Products saved to products.json", productCount);
  } catch (error) {
    console.error("Error saving products:", error);
  }
}

// fethces only the items per specific category
export async function fetchProductsByCategory(category: string) {
  const products = await prismadb.product.findMany({
    where: {
      categoryId: category,
    },
    // include: {
    //   category: true,
    //   brand: true,
    //   images: true,
    //   productVariants: {
    //     include: {
    //       color: true,
    //       size: true,
    //     },
    //   },
    //   ratings: true,

    // },
    select: {
      id: true,
    },
  });
  const productCount = products.length;
  // console.log("Products:", products, "Product Count:", productCount);
  return products;
}

export async function fethChildrenCategories(categoryId: string) {
  const childrenCategories = await prismadb.category.findMany({
    where: {
      parentId: categoryId,
    },
  });
  // console.log("Children Categories:", childrenCategories);
}

// gives all the products of a specific category and its nested subcategories
export async function getProductsByCategoryOriginal(categoryId: string) {
  // Fetch the category and its nested children categories
  const categories = await prismadb.category.findMany({
    where: {
      OR: [{ id: categoryId }, { parentId: categoryId }],
    },
    select: {
      id: true,
      subcategories: {
        select: {
          id: true,
        },
      },
    },
  });

  // Extract all category IDs (including subcategories)
  const categoryIds = categories.flatMap((category) => [
    category.id,
    ...category.subcategories.map((subcategory) => subcategory.id),
  ]);

  // Fetch products under the extracted category IDs
  const products = await prismadb.product.findMany({
    where: {
      categoryId: {
        in: categoryIds,
      },
    },
    include: {
      brand: true, // Include brand details
      images: true, // Include product images
      ratings: {
        include: {
          images: true, // Include review images
        },
      },
      // Include any other relations you need
    },
  });
  const formattedProducts = products.map((product) => {
    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const reviews = [];
    let totalRatings = 0;
    let totalRatingValue = 0;

    product.ratings.forEach((rating) => {
      const reviewWithImages = {
        rating: rating.rating,
        review: rating.review,
        images: rating.images.map((image) => ({
          id: image.id,
          url: image.url,
        })),
      };
      if (rating.review) {
        reviews.push(reviewWithImages);
      }
      ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
      totalRatingValue += rating.rating; // Sum the star counts weighted by their star value
      totalRatings += 1;
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalRatings > 0 ? totalRatingValue / totalRatings : 0;

    return {
      ...product,
      ratings: {
        count: ratingsCount,
        reviews: reviews,
        totalReviews: totalReviews,
        totalRatings: totalRatings,
        averageRating: averageRating,
      },
    };
  });

  const productCount = formattedProducts.length;
  // Fetch random related products
  const relatedProducts = await prismadb.product.findMany({
    where: {
      categoryId: {
        in: categoryIds,
      },
    },
    include: {
      brand: true,
      images: true,
    },
    take: 10, // Limit to 10 related products
    orderBy: {
      createdAt: "desc", // Change this to a random order if desired
    },
  });

  // Select 10 random related products
  const shuffledRelatedProducts = relatedProducts.sort(
    () => 0.5 - Math.random()
  );
  const selectedRelatedProducts = shuffledRelatedProducts.slice(0, 10);

  // console.log(
  //   "These are the Products:",
  //   formattedProducts,
  //   "Product Count:",
  //   productCount
  // );
  // console.log("Related Products:", selectedRelatedProducts);

  // return { products: formattedProducts, relatedProducts: relatedProducts };
  return selectedRelatedProducts;
}





// gives all the products of a specific category and its nested subcategories
export async function getProductsByCategory(
  categoryId: string
) {

     
  const userSession = await auth();
  const userId = userSession?.user?.id;
  // Fetch the category and its nested children categories
  const categories = await prismadb.category.findMany({
    where: {
      OR: [{ id: categoryId }, { parentId: categoryId }],
    },
    select: {
      id: true,
      subcategories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  // Extract all category IDs (including subcategories)
  const categoryIds = categories.flatMap((category) => [
    category.id,
    ...category.subcategories.map((subcategory) => subcategory.id),
  ]);
  // console.log("Category Ids:", categoryIds);

  // Fetch products under the extracted category IDs
  let products = await prismadb.product.findMany({
    where: {
      categoryId: {
        in: categoryIds,
      },
    },
    include: {
      brand: true, // Include brand details
      images: {
        // Fetch only the first image
        take: 1,
      }, // Include product images
      productVariants: {
        take: 1, // Fetch only the first product variant
        include: {
          color: true,
          size: true,
        },
      },
      ratings: {
        include: {
          images: true, // Include review images
        },
      },
      category: {
        include: {
          parent: true, // Include the parent category
        },
      },
      // Include wishlists related to each product only if userId is provided
      ...(userId && {
        wishlists: {
          where: {
            userId: userId,
          },
        },
      }),
      // cartItems: true,
      // Include cart items this should only be treu when the user is logged in
      // Include any other relations you need
    },
    take: 7, // Limit to 7 products per category
  });

  // Fetch the total number of wishlisted items for the user
  let totalWishlistCount = 0;
  if (userId) {
    totalWishlistCount = await prismadb.wishlist.count({
      where: {
        userId: userId,
      },
    });
  }

  // Fetch the user's cart items
  let cartItems = [];
  if (userId) {
    const cart = await prismadb.cart.findFirst({
      where: { userId },
      include: { cartItems: true },
    });
    cartItems = cart ? cart.cartItems : [];
  }
  // console.log("this is the user cart items from serrver action", cartItems)
  // Map the cart items to products and include cart quantity
  products = products.map((product) => {
    const cartItem = cartItems.find((item) => item.productId === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    return {
      ...product,
      cartQuantity: cartQuantity,
    };
  });
  // console.log("this is the user cart items from serrver action", products)

  const formattedProducts = products.map((product) => {
    const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const reviews = [];
    let totalRatings = 0;
    let totalRatingValue = 0;

    product.ratings.forEach((rating) => {
      const reviewWithImages = {
        rating: rating.rating,
        review: rating.review,
        images: rating.images.map((image) => ({
          id: image.id,
          url: image.url,
        })),
      };
      if (rating.review) {
        reviews.push(reviewWithImages);
      }
      ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
      totalRatingValue += rating.rating; // Sum the star counts weighted by their star value
      totalRatings += 1;
    });

    // Get the unique product IDs from cart items
    const uniqueProductIds = [
      ...new Set(cartItems.map((item) => item.productId)),
    ];

    // Calculate the total unique items in the cart
    const totalUniqueCartItems = uniqueProductIds.length;

    const totalReviews = reviews.length;
    const averageRating =
      totalRatings > 0 ? totalRatingValue / totalRatings : 0;

    // Check if the product is wishlisted by the user
    const isWishlisted = userId && product.wishlists.length > 0;
    const cartQuantity = cartItems ? product.cartQuantity : 0;

    return {
      ...product,
      isWishlisted: isWishlisted,
      totalWishlistCount: totalWishlistCount,
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
        parentCategory: product?.category?.parent?.name,
      },
      cartQuantity: cartQuantity, // Add cart quantity to the product
      totalUniqueCartItems: totalUniqueCartItems, // Add cart items to the product
    };
  });

  const productCount = formattedProducts.length;
  // console.log(
  //   "These are the Wishlisted Products:",
  //   formattedProducts,
  //   "Product Count:",
  //   productCount
  // );
  return formattedProducts;
}

// optimsed version of the getproductsbycategory

// export async function getProductsByCategory(
//   categoryId: string,
//   userId: string = ""
// ) {
//   // Fetch the category and its nested children categories
//       const categories = await prismadb.category.findMany({
//         where: {
//           OR: [{ id: categoryId }, { parentId: categoryId }],
//         },
//         select: {
//           id: true,
//           name: true,
//           subcategories: {
//             select: {
//               id: true,
//               name: true,
//               parentId: true, // Include the parent category ID
//               products: {
//                 // Include products for each subcategory
//                 include: {
//                   brand: true,
//                   images: { take: 1 },
//                   ratings: { include: { images: true } },
//                   category: { include: { parent: true } },
//                   wishlists: userId ? { where: { userId } } : false, // Include wishlists if userId is provided
//                   cartItems: userId ? true : false, // Include cart items if userId is provided
//                 },
//                 take: 7,
//               },
//             },
//           },
//         },
//       });

//       // Map and format categories and subcategories
//       const formattedCategories = categories.map((category) => ({
//         ...category,
//         subcategories: category.subcategories.map((subcategory) => ({
//           ...subcategory,
//           products: subcategory.products.map((product) =>
//             formatProduct(product, userId)
//           ),
//         })),
//       }));

//       return formattedCategories;
// }


// // Helper function to format product data
// function formatProduct(product, userId) {
//   const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//   const reviews = [];
//   let totalRatings = 0;
//   let totalRatingValue = 0;

//   product.ratings.forEach((rating) => {
//     const reviewWithImages = {
//       rating: rating.rating,
//       review: rating.review,
//       images: rating.images.map((image) => ({
//         id: image.id,
//         url: image.url,
//       })),
//     };
//     if (rating.review) {
//       reviews.push(reviewWithImages);
//     }
//     ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
//     totalRatingValue += rating.rating;
//     totalRatings += 1;
//   });

//   const totalReviews = reviews.length;
//   const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;
//   const isWishlisted = userId && product.wishlists.length > 0;
//   const cartQuantity = product.cartItems ? product.cartItems.length : 0;

//   return {
//     ...product,
//     isWishlisted,
//     totalWishlistCount: 0, // You might want to pass this value from outside if necessary
//     ratings: {
//       count: ratingsCount,
//       reviews: reviews,
//       totalReviews: totalReviews,
//       totalRatings: totalRatings,
//       averageRating: averageRating,
//       parentCategory: product?.category?.parent?.name,
//     },
//     cartQuantity: cartQuantity,
//     cart: product.cartItems, // Add cart items to the product
//   };
// }

// gives all the products of a specific category and its nested subcategories using filter and pagination
// export async function getProductsByCategoryfiltered(categoryId: string, page:number = 1, pageSize:number = 9) {
//   // Fetch the category and its nested children categories
//   const categories = await prismadb.category.findMany({
//     where: {
//       OR: [
//         { id: categoryId },
//         { parentId: categoryId }
//       ]
//     },
//     select: {
//       id: true,
//       subcategories: {
//         select: {
//           id: true
//         }
//       }
//     }
//   });

//   // Extract all category IDs (including subcategories)
//   const categoryIds = categories.flatMap(category =>
//     [category.id, ...category.subcategories.map(subcategory => subcategory.id)]
//   );

//     // Calculate the skip value
//     const skip = (page - 1) * pageSize;

//   // Fetch products under the extracted category IDs
//   const products = await prismadb.product.findMany({
//     where: {
//       categoryId: {
//         in: categoryIds
//       }
//     },
//     include: {
//       brand: true, // Include brand details
//       images: true, // Include product images
//       ratings: {
//         include: {
//           images: true, // Include review images
//         },
//       },
//       // Include any other relations you need
//     },
//     skip: skip,
//     take: pageSize
//   });

//    // Fetch the total count of products for pagination
//    const totalProducts = await prismadb.product.count({
//     where: {
//       categoryId: {
//         in: categoryIds
//       }
//     }
//   });

//   const formattedProducts = products.map(product => {
//     const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     const reviews = [];
//     let totalRatings = 0;
//     let totalRatingValue = 0;

//     product.ratings.forEach(rating => {
//       const reviewWithImages = {
//         rating: rating.rating,
//         review: rating.review,
//         images: rating.images.map(image => ({
//           id: image.id,
//           url: image.url,
//         })),
//       };
//       if (rating.review) {
//         reviews.push(reviewWithImages);
//       }
//       ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
//       totalRatingValue += rating.rating; // Sum the star counts weighted by their star value
//       totalRatings += 1;
//     });

//     const totalReviews = reviews.length;
//     const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;

//     return {
//       ...product,
//       ratings: {
//         count: ratingsCount,
//         reviews: reviews,
//         totalReviews: totalReviews,
//         totalRatings: totalRatings,
//         averageRating: averageRating,
//       },
//     };
//   });

//   const productCount = formattedProducts.length;
//   console.log("These are the Products:", formattedProducts, "Product Count:", productCount);
//     return {
//     products: formattedProducts,
//     totalProducts: totalProducts,
//     currentPage: page,
//     totalPages: Math.ceil(totalProducts / pageSize),
//   };;
// }

export const getProductsByCategoryFiltered = cache(
  async (
    parentCategoryName: string,
    categoryName: string[],
    brandName: string[],
    minDiscountedPrice: number,
    maxDiscountedPrice: number,
    // selectedPriceRanges: { min: number; max: number }[], // Updated to accept an array of selected price ranges
    minDiscountPercentage: number,
    maxDiscountPercentage: number,
    page: number = 1,
    pageSize: number = 9,
    sortBy: string = "" // 'priceAsc', 'priceDesc', 'discountAsc', 'discountDesc', 'ratingsAsc', 'ratingsDesc'
  ) => {
    const userSession = await auth();
    const userId = userSession?.user?.id;
    // console.log("Filtered User ID:", userId);
    // Function to format camel case or Pascal case strings to separate words
    const formatCategoryName = (name: string): string => {
      return name.replace(/([a-z])([A-Z])/g, "$1 $2");
    };
    // First, retrieve the categoryId based on the parentCategoryName
    const parentCategory = await prismadb.category.findFirst({
      where: {
        name: formatCategoryName(parentCategoryName),
      },
      select: {
        id: true,
      },
    });

    let categoryId;
    // Check if the parentCategory exists
    if (parentCategory) {
      categoryId = parentCategory.id;
    }

    // Fetch all categories
    const categories = await prismadb.category.findMany({
      where: {
        OR: [{ id: categoryId }, { parentId: categoryId }],
      },
      select: {
        id: true,
        name: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            parentId: true, // Include the parent category ID
          },
        },
      },
    });

    // Filter out categories with the provided parent category ID
    const filteredCategories = categories.filter(
      (category) => category?.id != parentCategory?.id
    );
    // console.log("Filtered Categories:", filteredCategories);

    const uniqueCategories = Array.from(
      new Set(filteredCategories.map((category) => category.name.toLowerCase()))
    );

    // console.log("Unique Categories:", uniqueCategories);

    let selectedCategory: string[] = [];

    // console.log("Fetched Categories:", categories);

    // if (categoryName == "null") {
    //   console.log("Selected Category:", selectedCategory);

    // } else {
    //   // Find the category matching the provided name
    //   selectedCategory = categories.find(
    //     (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    //   );
    //   console.log("Selected Category:", selectedCategory);
    // }

    if (!categoryName || categoryName.length === 0) {
      // console.log("Selected Categories:", selectedCategory);
    } else {
      // Initialize selectedCategories with the existing selected category names
      // selectedCategories = [...selectedCategory];

      categoryName.forEach((categoryName) => {
        // const category
        // = categories.find(
        //   (cat) =>cat.name.toLowerCase() === categoryName.toLowerCase()|| cat.subcategories.map((subcategory) => subcategory.name.toLowerCase()).includes(categoryName.toLowerCase())
        // );

        // Find the category matching the provided name
        const category = categories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (category && !selectedCategory.includes(category.name)) {
          selectedCategory.push(category.id);
        }
      });
    }
    // console.log("Selected Categories:", selectedCategory);
    // if (!selectedCategory) {
    //   return {
    //     products: [],
    //     totalProducts: 0,
    //     currentPage: page,
    //     totalPages: 0,
    //     uniqueCategories: [],
    //     uniqueBrands: [],
    //     priceRanges: [],
    //   };
    // }

    let categoryIds = [];

    if (selectedCategory !== null && selectedCategory.length > 0) {
      //   Extract all category IDs inside the selected categories  (including subcategories)
      // categoryIds = [
      //   selectedCategory.id,
      //   ...selectedCategory.subcategories.map((subcategory) => subcategory.id),
      // ];
      // Map over selectedCategory and add each individual category ID to categoryIds
      selectedCategory.forEach((category) => {
        categoryIds.push(category);

        categories.forEach((cat) => {
          if (cat.id === category) {
            cat.subcategories.forEach((subcategory) => {
              if (subcategory) {
                categoryIds.push(subcategory.id);
              }
            });
          }
        });
        // Map over subcategories and add their IDs to categoryIds
        // if (categories.subcategories && category.subcategories.length > 0) {
        //   categories.subcategories.forEach(subcategoryId => {
        //     if (subcategoryId) { // Check if subcategoryId is not empty
        //       categoryIds.push(subcategoryId);
        //     }
        //   });
        // }
      });
      // console.log("Category Ids inside the selected categories:", categoryIds);
    } else {
      // Extract all category IDs (including subcategories)
      // categoryIds = categories.flatMap((category) => [
      //   category.id,
      //   ...category.subcategories.map((subcategory) => subcategory.id),
      // ]);
      categoryIds = categories.flatMap((category) => {
        const ids = [category.id];
        if (category.subcategories) {
          ids.push(
            ...category.subcategories
              .filter((subcategory) => subcategory && subcategory.id)
              .map((subcategory) => subcategory.id)
          );
        }
        return ids;
      });
      // console.log("Category Ids without the selected categories:", categoryIds);
    }

    // Calculate the overall minimum and maximum prices from the selected price ranges
    //  let minDiscountedPrice = Math.min(...selectedPriceRanges.map(range => range.min)); // Added
    //  let maxDiscountedPrice = Math.max(...selectedPriceRanges.map(range => range.max)); // Added

    // Extract all category names (including subcategories)
    // const categoryNames = [selectedCategory.name, ...selectedCategory.subcategories.map(subcategory => subcategory.name)];
    // console.log("Category Names:", categoryNames);

    // Sorting function
    const sortProducts = (products, sortBy) => {
      products.sort((a, b) => {
        let valueA, valueB;
        let order = "asc";

        // Determine sorting criteria and order
        switch (sortBy) {
          case "priceAsc":
            valueA = a.discountedPrice;
            valueB = b.discountedPrice;
            order = "asc";
            break;
          case "priceDesc":
            valueA = a.discountedPrice;
            valueB = b.discountedPrice;
            order = "desc";
            break;
          case "discountAsc":
            valueA = a.discount;
            valueB = b.discount;
            order = "asc";
            break;
          case "discountDesc":
            valueA = a.discount;
            valueB = b.discount;
            order = "desc";
            break;
          case "ratingsAsc":
            valueA = a.ratings.averageRating;
            valueB = b.ratings.averageRating;
            order = "asc";
            break;
          case "ratingsDesc":
            valueA = a.ratings.averageRating;
            valueB = b.ratings.averageRating;
            order = "desc";
            break;
          default:
            return 0;
        }

        if (order === "asc") {
          return valueA - valueB;
        } else if (order === "desc") {
          return valueB - valueA;
        }
        return 0;
      });
    };

    // Calculate the skip value
    const skip = (page - 1) * pageSize;

    // console.log("Brand Name:", brandName);

    // Fetch products under the extracted category IDs and apply filters
    const products = await prismadb.product.findMany({
      where: {
        categoryId: {
          in: categoryIds,
        },
        // Only include the brand filter if brandName is not empty
        ...(brandName.length > 0 && {
          brand: {
            name: {
              in: brandName,
              mode: "insensitive",
            },
          },
        }),
        discountedPrice: {
          gte: minDiscountedPrice,
          lte: maxDiscountedPrice,
        },
        discount: {
          gte: minDiscountPercentage,
          lte: maxDiscountPercentage,
        },
      },
      include: {
        brand: true, // Include brand details
        images: {
          // Fetch only the first image
          take: 1,
        }, // Include product images
        ratings: {
          include: {
            images: true, // Include review images
          },
        },
        category: true, // Include the category relation
        // cartItems: true, // Include cart items to get the quantity
        ...(userId && {
          wishlists: {
            where: {
              userId: userId,
            },
          },
        }),
        productVariants: {
          take: 1, // Fetch only the first product variant
          include: {
            color: true,
            size: true,
          },
        },
        // Include any other relations you need
      },
      // skip: skip,
      // take: pageSize,
    });

    // Sort all products

    if (sortBy) {
      sortProducts(products, sortBy);
    }

    // Calculate pagination
    const totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalProducts);

    // Apply pagination
    const allProducts = products.slice(startIndex, endIndex);
    // console.log('Fetched Products:', products);
    // Count the number of fetched products
    const productCount = allProducts.length;
    // console.log("Total Products:", productCount);

    // console.log("Fetched Products:", products);

    // Fetch the total count of products for pagination
    const totalProductsCount = await prismadb.product.count({
      where: {
        categoryId: {
          in: categoryIds,
        },
        // Only include the brand filter if brandName is not empty
        ...(brandName.length > 0 && {
          brand: {
            name: {
              in: brandName,
              mode: "insensitive",
            },
          },
        }),
        discountedPrice: {
          gte: minDiscountedPrice,
          lte: maxDiscountedPrice,
        },
        discount: {
          gte: minDiscountPercentage,
          lte: maxDiscountPercentage,
        },
      },
    });

    // console.log("Total Products Count:", totalProductsCount);

    const uniqueBrands = Array.from(
      new Set(allProducts.map((product) => product.brand.name))
    );
    // console.log("Unique Brands:", uniqueBrands);

    const prices = allProducts
      .map((product) => product.discountedPrice)
      .filter((price) => price !== null);

    const priceRanges = [
      { label: "₹500 - ₹1500", value: "500to1500", min: 500, max: 1500 },
      { label: "₹1500 - ₹2500", value: "1500to2500", min: 1500, max: 2500 },
      { label: "₹2500 - ₹3500", value: "2500to3500", min: 2500, max: 3500 },
      { label: "₹3500 - ₹4500", value: "3500to4500", min: 3500, max: 4500 },
      { label: "₹4500 - ₹5500", value: "4500to5500", min: 4500, max: 5500 },
      { label: "₹5500 - ₹6500", value: "5500to6500", min: 5500, max: 6500 },
      { label: "₹6500 - ₹7500", value: "6500to7500", min: 6500, max: 7500 },
      { label: "₹7500 - ₹8000", value: "7500to8000", min: 7500, max: 8000 },
      {
        label: "Above ₹8000",
        value: "above8000",
        min: 8000,
        max: Math.max(...prices),
      },
    ];

    const discounts = allProducts
      .map((product) => product.discount)
      .filter((price) => price !== null);

    const discountRanges = [
      { label: "Below 10%", value: "below10", min: 0, max: 10 },
      { label: "10% - 20%", value: "10to20", min: 10, max: 20 },
      { label: "20% - 30%", value: "20to30", min: 20, max: 30 },
      { label: "30% - 50%", value: "30to50", min: 30, max: 50 },
      {
        label: "Above 50%",
        value: "above50",
        min: 50,
        max: Math.max(...discounts),
      },
    ];

    let formattedProducts = allProducts.map((product) => {
      const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const reviews = [];
      let totalRatings = 0;
      let totalRatingValue = 0;

      product.ratings.forEach((rating) => {
        const reviewWithImages = {
          rating: rating.rating,
          review: rating.review,
          images: rating.images.map((image) => ({
            id: image.id,
            url: image.url,
          })),
        };
        if (rating.review) {
          reviews.push(reviewWithImages);
        }
        ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
        totalRatingValue += rating.rating; // Sum the star counts weighted by their star value
        totalRatings += 1;
      });

      const totalReviews = reviews.length;
      const averageRating =
        totalRatings > 0 ? totalRatingValue / totalRatings : 0;

      // Calculate cartQuantity
      // const cartQuantity = product.cartItems.reduce((acc, item) => acc + item.quantity, 0);

      const isWishlisted = userId && product.wishlists.length > 0;

      return {
        ...product,
        color:product.productVariants && product.productVariants[0]?.color?.name,
        size: product.productVariants && product.productVariants[0]?.size?.name,
        stock: product.productVariants && product.productVariants[0]?.stock,
        productVarientID:product.productVariants &&  product.productVariants[0]?.id,
        isWishlisted: isWishlisted,
        ratings: {
          count: ratingsCount,
          reviews: reviews,
          totalReviews: totalReviews,
          totalRatings: totalRatings,
          averageRating: averageRating,
        },
        // cartQuantity: cartQuantity,
      };
    });

    const fetchedCategories = categories;

    return {
      products: formattedProducts,
      totalProducts: totalProductsCount,
      currentPage: page,
      totalPages: totalPages,
      uniqueCategories,
      uniqueBrands,
      priceRanges,
      discountRanges,
      fetchedCategories,
    };
  }
);

export async function fetchAllReviews() {
  try {
    // Fetch reviews for the product
    const reviews = await prismadb.rating.findMany({
      where: {
        productId: "665ac95e5788e185779d7ce0",
        review: {
          not: null, // Filter out reviews that are null
        },
      },
    });

    // Initialize an object to store counts for each rating
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    // Loop through reviews and increment counts for each rating
    reviews.forEach((review) => {
      ratingCounts[review.rating]++;
    });

    // Log the rating counts
    // console.log("Rating Counts:", ratingCounts);

    // Log the reviews
    // console.log("Reviews:");
    reviews.forEach((review) => {
      // console.log(`Rating: ${review.rating}, Review: ${review.review}`);
    });
  } catch (error) {
    console.error("Error fetching product reviews:", error);
  }
}

export const fetchProductAllData = cache(async (productdata: string) => {
  const session = await auth();
  const userId = session?.user?.id;
  const productId = productdata; // Replace with the actual product ID
  // Fetch the product with its category, brand, images, and product variants
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      category: {
        include: {
          parent: true, // Include the parent category
        },
      }, // Include the category
      brand: true, // Include the brand
      images: true, // Include the images
      productVariants: {
        include: {
          color: true,
          size: true,
        },
      },
      ratings: {
        include: {
          images: true, // Assuming `reviewImages` is the relation name for review images
        },
      },
      ...(userId && {
        wishlists: {
          where: {
            userId: userId,
          },
        },
      }),
    },
  });

  if (!product) {
    // console.log("Product not found");
    return;
  }
  const parentCategory = product.category.parent; // Access the parent category

  // Fetch related products based on the parent category
  // const relatedProducts = await prismadb.product.findMany({
  //   where: {
  //     categoryId: parentCategory.id,
  //     NOT: {
  //       id: productId,
  //     },
  //   },
  //   include: {
  //     brand: true, // Include brand details
  //     images: true, // Include product images
  //     // Include any other relations you need
  //   },
  // });


  // Format the productVariants to include color and size names directly
  const formattedProductVariants = product.productVariants.map((variant) => ({
    id: variant.id,
    color: variant.color.name, // Assuming 'name' is the property containing the color name
    size: variant.size.name, // Assuming 'name' is the property containing the size name
    stock: variant.stock,
    createdAt: variant.createdAt,
    updatedAt: variant.updatedAt,
  }));


      const isWishlisted = userId && product.wishlists.length > 0;

  // Format the ratings
  const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const reviews = [];
  let totalRatings = 0;
  let totalRatingValue = 0;

  product.ratings.forEach((rating) => {
    const reviewWithImages = {
      rating: rating.rating,
      review: rating.review,
      images: rating.images.map((image) => ({
        id: image.id,
        url: image.url,
      })),
    };
    if (rating.review) {
      reviews.push(reviewWithImages);
    }
    ratingsCount[rating.rating] = (ratingsCount[rating.rating] || 0) + 1;
    totalRatingValue += rating.rating; // Sum the star counts weighted by their star value

    totalRatings += 1;
  });
  const totalReviews = reviews.length;
  const averageRating = totalRatings > 0 ? totalRatingValue / totalRatings : 0;

  // Organize the final product data
  const organizedProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    discount: product.discount,
    discountedPrice: product.discountedPrice,
    description: product.description,
    category: {
      id: product.category.id,
      name: product.category.name,
      parentId: parentCategory.id, // Include parent category ID
      parentName: parentCategory.name, // Include parent category name
    },
    brand: {
      id: product.brand.id,
      name: product.brand.name,
    },
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
    })),
    productVariants: formattedProductVariants,
    ratings: {
      count: ratingsCount,
      reviews: reviews,
      totalReviews: totalReviews, // Add totalReviews to the ratings object
      totalRatings: totalRatings, // Add totalRatings to the ratings object
      averageRating: averageRating, // Add averageRating to the ratings object
    },
    isWishlisted: isWishlisted,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    // parentCategoryId: parentCategory.id, // Add parent category ID to the organizedProduct
    // parentCategoryName: parentCategory.name, // Add parent category name to the organizedProduct
    // relatedProducts: relatedProducts, // Add related products to the organizedProduct
  };
  
  // console.dir(organizedProduct, { depth: null });
  return organizedProduct;
});
