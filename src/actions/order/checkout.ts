"use server";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prismadb } from "@/lib/db";
import { createOrder } from "@/actions/order/orderCreation";
import { prepareOrderData } from "@/actions/order/prepareOrderData";
import { getProductsInCartSummary } from "@/actions/cart/cartSummary";
import { auth } from "@/auth";
import addTransaction from "../payments/addWalletTransaction";

// webhook not required as we are not using the advanced features like subscriptions ,disputes etc and confirming if the payent succeeded or not  which can be done  checking the success true or false in the url as well

// no need to use the loadstripe when using checout session

export async function processOrder({
  selectedAddressId,
  cardId,
  paymentMode,
  walletId,
}: {
  selectedAddressId: string;
  cardId: string;
  paymentMode: string;
  walletId: string;
  
}) {
  // need to pass the card ID/wallet ID as well from here and the payment mode as well
  console.log("Process order function is being called ");
  try {
    const userSession = await auth();
    const user = userSession?.user?.id;

    if (!user) {
      throw new Error("Unauthorized");
    }

    const data = await getProductsInCartSummary(user);

    const productData = data?.products;

    console.log("Product data is ", productData);
    if (!productData || productData.length === 0) {
      throw new Error("No products found in the cart");
    }

    const line_items = productData.map((product) => ({
      quantity: product?.cartQuantity,
      price_data: {
        currency: "INR",
        product_data: {
          name: product.name,
          images: [product.images[0].url],
          metadata: {
            color: product.color,
            size: product.size,
          },
        },
        unit_amount: product?.discountedPrice * 100,
      },
    }));

    const { userId, products, addressID, totalAmount } = prepareOrderData(
      user,
      productData,
      selectedAddressId
    );

    const orderData = {
      userId: userId,
      products: products,
      addressID: addressID,
      totalAmount: totalAmount,
      paymentMode: paymentMode,
      cardId: cardId,
      walletId: walletId,
    };

    // order creation and payment processing is being done in this function
    const orderResult = await createOrder(orderData);

    if(walletId){
       await addTransaction(totalAmount, "DEBIT", `Payment for order ${orderResult?.createdOrder.id}`);
      // if wallet is used for payment then we need to update the wallet balance
     const success_url = `${process.env.MAIN_DOMAIN}/order-success/?success=true/orderId=${orderResult?.createdOrder.id}`;

      return { url: success_url };

    }

    else {  
    // stipe session creation
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.MAIN_DOMAIN}/order-success/?success=true/orderId=${orderResult?.createdOrder.id}`,
      cancel_url: `${process.env.MAIN_DOMAIN}/cart/?canceled=true`,
      metadata: {
        orderId: orderResult?.createdOrder.id,
      },
    });
  
    return { url: session.url };
  }
  } catch (error) {
    console.error("Error processing order:", error);
    throw new Error("Internal Server Error");
  }
}
