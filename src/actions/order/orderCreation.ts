"use server";

import { PrismaClient, DeliveryStatus } from "@prisma/client";

import { prismadb } from "@/lib/db";

interface Product {
  productId: string;
  quantity: number;
  price: number;
}

interface CreateOrderProps {
  userId: string;
  products: Product[];
  addressID: string;
  paymentMode?: string;
  cardId?: string;
  walletId?: string;
  totalAmount?: number;
}

export async function createOrder(props: CreateOrderProps) {
  // console.log("create order function is being called");
  try {
    const {
      userId,
      products,
      addressID,
      paymentMode ,
      cardId ,
      walletId,
      totalAmount,
    } = props;

    // Step 1: Prepare formatted order details
    const formattedOrder = {
      user: {
        connect: {
          id: userId,
        },
      },
      address: {
        connect: {
          id: addressID, // Connects to an existing address
        },
      },
      paymentMode: paymentMode as any,
      deliveryStatus: DeliveryStatus.ORDER_PLACED,
      orderTotal: totalAmount,

      orderItems: {
        create: products.map((product) => ({
          productId: product.productId,
          quantity: product.quantity,
          price: product.price,
          productVariantID: product.productVarientID,
          size: product.size,
          color: product.color,
        })),
      },
    };

    // Add nested objects based on paymentMode
    if (paymentMode === "CARD" && cardId) {
      formattedOrder.card = {
        connect: {
          id: cardId,
        },
      };
    } else if (paymentMode === "WALLET" && walletId) {
      formattedOrder.wallet = {
        connect: {
          id: walletId,
        },
      };
    }
    // console.log("Order data prepared successfully", formattedOrder);
    // Step 2: Create the order using the formatted order details
    const createdOrder = await prismadb.order.create({
      data: formattedOrder,
      include: {
        orderItems: true,
      },
    });
    // console.log("Order created successfully", createdOrder);
    // Step 3: Delete cart items (assuming this function is elsewhere)
    // await prismadb.cartItem.deleteMany({
    //     where: {
    //         cart: {
    //             userId: userId
    //         }
    //     }
    // });

    return {
      createdOrder: createdOrder,
      success: true,
      message: "Order created successfully",
    };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  } finally {
    await prismadb.$disconnect(); // Disconnect Prisma client
  }
}
