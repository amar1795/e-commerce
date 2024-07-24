"use server"

import { prismadb } from "@/lib/db";

export async function searchProductsByNameOrBrand(searchTerm) {
  if (!searchTerm) {
    return { error: "Search term is required" };
  }

  const trimmedSearchTerm = searchTerm.trim(); // Trim spaces from both ends


  try {
    const products = await prismadb.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: trimmedSearchTerm, // Partial match on product name
              mode: 'insensitive', // Case insensitive
            },
          },
          {
            brand: {
              name: {
                contains: trimmedSearchTerm, // Partial match on brand name
                mode: 'insensitive', // Case insensitive
              },
            },
          },
        ],
      },
      include: {
        brand: true, // Include brand information in the result
      },
      
    });

    // console.log("Search results:", products);
    return products;
  } catch (error) {
    console.error("Error searching for products:", error);
    return { error: "An error occurred while searching for products." };
  }
}

// Sample usage
// const searchTerm = "Nike"; // Replace with the actual search term
// searchProductsByNameOrBrand(searchTerm).then((products) => {
//   console.log("Search results:", products);
// });
