"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteCartItem(userId: string, productId: string) {
    try {
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
                // Remove the cart item from the database
                await prismadb.cartItem.delete({
                    where: { id: cartItem.id }
                });
                revalidatePath('/cart');
                console.log("Product removed from cart");
                return { success: true, message: "Product removed from cart" };
            }
        }
        console.log("Product not found in cart");
        return { success: false, message: "Product not found in cart" };
    } catch (error) {
        console.error("Error deleting the product:", error);
        throw new Error("Failed to delete the product");
    }
}
