"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

interface UpdateOrderProps {
    orderId: string;
}

export async function updateOrderPaymentStatus({ orderId }: UpdateOrderProps) {
    const userSession = await auth();
    const userId = userSession?.user?.id;
    try {

        // Check if the user exists
        const user = await prismadb.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return { success: false, message: "User not authenticated" };
        }

        // Update the order's isPaid status to true
        const updatedOrder = await prismadb.order.update({
            where: {
                id: orderId,
            },
            data: {
                isPaid: true,
            },
            include: {
                orderItems: true,
                address: true,
                card: true,
                wallet: true,
            },
        });


        

        // console.log('Order payment status updated successfully', updatedOrder);

        return { updatedOrder: updatedOrder, success: true, message: "Order payment status updated successfully" };
    } catch (error) {
        console.error("Error updating order payment status:", error);
        throw new Error("Failed to update order payment status");
    } finally {
        await prismadb.$disconnect(); // Disconnect Prisma client
    }
}
