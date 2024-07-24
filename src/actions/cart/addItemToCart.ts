"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function addItemToCart(userId, productId, productVariant, productColour, productSize, quantity,productVarientStock) {
  // console.log("User ID:", userId);

  try {
  // Find the user's most recent cart or create a new one if it doesn't exist
  let cart = await prismadb.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { cartItems: true }
  });

  // console.log("Cart data:", cart);

  if (!cart) {
    // Create a new cart and add the product with specified quantity
    cart = await prismadb.cart.create({
      data: {
        userId,
        cartItems: {
          create: {
            productId,
            quantity,
            productVariantID: productVariant || null,
            productColour: productColour || null,
            productSize: productSize || null
          }
        }
      },
      include: { cartItems: true }
    });
    revalidatePath('/');
  } else {
    // Check if the product is already in the cart
    let cartItem = cart.cartItems.find(item =>
      item.productId === productId
    );

    if (cartItem) {
      // Increase the quantity if the product is already in the cart
      await prismadb.cartItem.update({
        where: { id: cartItem.id },
        data: {
          quantity,
          productVariantID: productVariant || null,
          productColour: productColour || null,
          productSize: productSize || null,
          productVarientStock: productVarientStock || null
        }
      });
    } else {
      // Add the product to the cart with specified quantity
      await prismadb.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          productVariantID: productVariant || null,
          productColour: productColour || null,
          productSize: productSize || null,
          productVarientStock: productVarientStock || null
        }
      });
    }
    revalidatePath('/');
  }
  return { success: true, message: "Item added to cart successfully" };

}
catch (error) {
    console.error("Error adding item to cart:", error);
    return { success: false, message: "Failed to add item to cart", error: error?.message };
}
}
