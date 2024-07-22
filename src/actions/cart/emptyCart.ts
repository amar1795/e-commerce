"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { clearCartCookies } from "./addCartDatatoCookies";
import { getProductsInCartSummary } from "./cartSummary";

export default async function emptyCart() {
  const session = await auth();
  const user = session?.user?.id;

  // also need to  deduct the quantity of the product variets here as well

  const data = await getProductsInCartSummary(user);
  const productData = data?.products;
  // Deduct the stock quantity for each product variant in the cart
  if (productData) {
    for (const product of productData) {
      const { cartQuantity, productVarientID, stock } = product;
      const newStock = stock - cartQuantity;

      // Update the stock in the ProductVariant schema
      await prismadb.productVariant.update({
        where: { id: productVarientID },
        data: { stock: newStock },
      });

      console.log("Stock updated successfully for the product variant");
    }
  }

  let cart = await prismadb.cart.findFirst({
    where: { userId: user },
    orderBy: { createdAt: "desc" },
    include: { cartItems: true },
  });

  if (cart) {
    await prismadb.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
    // clearing the cart cookies as well
    await clearCartCookies();
    console.log("Cookie Cart items deleted successfully");
  }

  // Check if there are items in the cart before deleting
  // const cartItems = await prismadb.cartItem.findMany({
  //     where: {
  //         cart: {
  //             userId: user
  //         }
  //     }
  // });

  // if (cartItems && cartItems.length > 0) {
  //     await prismadb.cartItem.deleteMany({
  //         where: {
  //             cart: {
  //                 userId: user
  //             }
  //         }
  //     });

  //     console.log('Cart items deleted successfully');
  // } else {
  //     console.log('No items found in the cart');
  // }
  console.log("Cart items deleted successfully");
}
