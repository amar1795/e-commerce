"use server";

import { prismadb } from "@/lib/db";

export default async function addProductToCart(userId: string, productId: string) {
  // Find the user's most recent cart or create a new one if it doesn't exist
  let cart = await prismadb.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { cartItems: true }
  });

//   if cart not found create a new cart
  if (!cart) {
    cart = await prismadb.cart.create({
      data: {
        userId,
        cartItems: {
          create: {
            productId,
            quantity: 1
          }
        }
      },
      include: { cartItems: true }
    });
  } else {
    // Check if the product is already in the cart
    const cartItem = cart?.cartItems.find(item => item.productId === productId);
    
    if (cartItem) {
      // Increase the quantity if the product is already in the cart
      await prismadb.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + 1 }
      });
    } else {
      // Add the product to the cart
      await prismadb.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1
        }
      });
    }
  }
}
