"use server"
import { prismadb } from "@/lib/db";

interface Product {
  id: string;
  name: string;
  // Add other fields as per your product schema
}

export async function fetchSingleProduct(productId: string, cartQuantity: number = 1){
  // console.log("Fetching product:", productId);
  try {
    // Fetch product details for the given productId
    const product = await prismadb.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        brand: true,
        images: { take: 1 }, // Fetch only the first image
      },
    });

    if (product) {
      // Add the cartQuantity to the product object
      product.cartQuantity = cartQuantity;
    }

    return [product];

  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}
