"use server";
import { prismadb } from "@/lib/db";
import { generateCombinations, generatePantCombinations } from "./generateCombination";

// { id: productID },


const ProductSizeData = [
  {
    id: "665aca6d5788e185779d7ce5",
    name: "Extra Small",
    value: "XS",
  },
  {
    id: "665aca6e5788e185779d7ce6",
    name: "Small",
    value: "S",
  },
  {
    id: "665aca6e5788e185779d7ce7",
    name: "Medium",
    value: "M",
  },
  {
    id: "665aca6e5788e185779d7ce8",
    name: "Large",
    value: "L",
  },
  {
    id: "665aca6e5788e185779d7ce9",
    name: "Extra Large",
    value: "XL",
  },
  {
    id: "665aca6e5788e185779d7cea",
    name: "Extra Extra Large",
    value: "XXL",
  },
];

const ProductColourData = [
  {
    id: "665af3c03220eba7c7eab93e",
    name: "White",
    value: "FFFFFF",
  },
  {
    id: "66570726617228492bfcb586",
    name: "Blue",
    value: "3a86ff",
  },
  {
    id: "66570726617228492bfcb587",
    name: "Purple",
    value: "8338ec",
  },
  {
    id: "66570726617228492bfcb588",
    name: "Red",
    value: "ff006e",
  },
  {
    id: "66570726617228492bfcb589",
    name: "Orange",
    value: "fb5607",
  },
  {
    id: "66570726617228492bfcb58a",
    name: "Yellow",
    value: "ffbe0b",
  },
  {
    id: "66570726617228492bfcb58b",
    name: "Black",
    value: "000000",
  },
];

export async function createProductVarient(productid) {
  try {
    //   const productID = "665af50e3220eba7c7eab944"; // Replace with the actual product ID
    // const productID = productid; // Replace with the actual product ID
    // Generate combinations using the previous function

    // const combinations = generateCombinations(productid);
    
    const combinations = generatePantCombinations(productid);
    const productVariants = await prismadb.productVariant.createMany({
      data: combinations,
    });

    console.log("Product variants created:", productVariants);
  } catch (error) {
    console.error("Error creating product variant:", error);
  }
}

export async function deleteProductVarients(productid) {
  try {
    const deletedProductVariants = await prismadb.productVariant.deleteMany({
      where: { productId: productid },
    });

    console.log("Product variants deleted:", deletedProductVariants);
  } catch (error) {
    console.error("Error deleting product variants:", error);
  }
}



export async function GenerateCombinationProductVarients(data) {
  for (const product of data) {
    try {
      await createProductVarient(product.id);
      console.log("Product variants created successfully");
    } catch (error) {
      return { error: "Failed to process product ID:"};
    }
  }
  return  { success: "Product variants created successfully"}

}
