"use server";


import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function increaseProductQuantity(userId: string, productId: string) {
  console.log("this is the user id", userId)
  // Find the user's most recent cart or create a new one if it doesn't exist
//   need to also modify this part later that when the user completes the order in that case do not use that cart anymore
console.log("this is the user ID from increase product server action", userId)
  let cart = await prismadb.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { cartItems: true }
  });
console.log("this is the cart data from increase product server action", cart)
  if (!cart) {
    // Create a new cart and add the product with quantity 1
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
    revalidatePath('/')
    // console.log("this is the newly generated cart ", cart)
  } else {
    // Check if the product is already in the cart
    let cartItem = cart.cartItems.find(item => item.productId === productId);

    if (cartItem) {
      // Increase the quantity if the product is already in the cart
      await prismadb.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + 1 }
      });
      // console.log("this is the cart item data", cartItem)
      revalidatePath('/')

    } else {
      // Add the product to the cart with quantity 1
      await prismadb.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1
        }
      });
      revalidatePath('/')

    }
  }
}
