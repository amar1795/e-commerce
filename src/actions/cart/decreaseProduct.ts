"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function decreaseProductQuantity(userId: string, productId: string) {
    // Find the user's most recent cart
    let cart = await prismadb.cart.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { cartItems: true }
    });
  
    if (cart) {
      // Check if the product is already in the cart
      const cartItem = cart.cartItems.find(item => item.productId === productId);
  
      if (cartItem) {
        // Decrease the quantity if the product is already in the cart
        if (cartItem.quantity > 1) {
          await prismadb.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: cartItem.quantity - 1 }
          });
          revalidatePath('/')
        } else {
          // If quantity is 1, remove the product from the cart
          await prismadb.cartItem.delete({
            where: { id: cartItem.id }
          });
          revalidatePath('/')

        }
      }
    }
  }
  
  