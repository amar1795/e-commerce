"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const toggleWishlist = async (userId: string, productId: string) => {
  try {
    if (!userId) {
      throw new Error("User not authenticated");
    }
    // Check if the product is already in the wishlist
    const existingEntry = await prismadb.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

    if (existingEntry) {
      // Remove product from wishlist
      await prismadb.wishlist.delete({
        where: {
          id: existingEntry.id,
        },
      });

      revalidatePath("/");
      // it does not matter which path i use in revalidate path as soon as the revalidate path is there the data is being revalidated where it is being called
      return { message: "removed" };
    } else {
      // Add product to wishlist
      const wishlistItem = await prismadb.wishlist.create({
        data: {
          userId,
          productId,
        },
      });

      revalidatePath("/");
      return { message: "added" };
      // return wishlistItem;
    }
  } catch (error) {
    console.error("Error toggling product in wishlist:", error);
    throw new Error("Failed to toggle product in wishlist");
  }
};

export const getUserWishlist = async (userId: string) => {
  try {
    const wishlistedItems = await prismadb.wishlist.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            brand: true, // Include brand details
            images: {
              take: 1,
            }, // Include images
          },
        },
      },
    });

    // Format the data to only return the first image and brand name
    const formattedWishlist = wishlistedItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        firstImage:
          item.product.images.length > 0 ? item.product.images[0] : null,
        brandName: item.product.brand.name,
      },
    }));
    revalidatePath("/")

    console.log("this is the wishlist", formattedWishlist);
    return formattedWishlist;
  } catch (error) {
    console.error("Error retrieving wishlist:", error);
    throw new Error("Failed to retrieve wishlist");
  }
};

export const removeFromWishlist = async (userId: string, productId: string) => {
  try {
    // Remove product from wishlist
    await prismadb.wishlist.deleteMany({
      where: {
        userId,
        productId,
      },
    });
    // it doesn't matter which path i am selecting as soon as the revalidate path is there the data is being revalidated where it is being called
    revalidatePath("/wishlist")
    return { message: "Product removed from wishlist" };
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    throw new Error("Failed to remove product from wishlist");
  }
};
