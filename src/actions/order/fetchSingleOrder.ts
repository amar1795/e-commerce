"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface FetchOrderProps {
    orderId: string;
}

export async function fetchOrderById( orderId: string) {
    const userSession = await auth();
    const userId = userSession?.user?.id;

    // to check if the user is logged in or not
    if(!userId) {
     return { success: false, message: "User not authenticated" };
    }

    try {
        // Fetch the specific order for the given orderId and userId
        const order = await prismadb.order.findUnique({
            where: {
                id: orderId,
                userId: userId, // Ensure the order belongs to the authenticated user
            },
            include: {
                orderItems: {
                    include: {
                        product: {
                            include: {
                                brand: true,
                                images: {
                                    take: 1, // Limit to only the first image
                                },
                                ratings: true, // Include the ratings to calculate the average

                            },
                        },
                    },
                },
                address: true,
                card: true,
                wallet: true,
            },
        });

        if (!order) {
            return { success: false, message: "Order not found" };
        }

        // Ensure orderTotal is not null
        const sanitizedOrder = {
            ...order,
            orderTotal: order.orderTotal ?? 0, // Defaulting to 0 if orderTotal is null
        };

        // console.log('Single Order fetched successfully', sanitizedOrder);

        return { order: sanitizedOrder, success: true, message: "Order fetched successfully" };
    } catch (error) {
        console.error("Error fetching order:", error);
        throw new Error("Failed to fetch order");
    } finally {
        await prismadb.$disconnect(); // Disconnect Prisma client
    }
}
