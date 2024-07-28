"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";


export async function fetchUserCards()  {

    const userSession = await auth();
    const user = userSession?.user?.id;

    if(!user) {
        return { error: "User not signed " };
    }

    try {
        const userCards = await prismadb.card.findMany({
            where: {
                userId: user
            },
            select: {
                id: true,
                cardHolderName: true,
                cardExpiry: true,
                lastFourDigits: true
            }
        });
        
        return userCards;
    } catch (error) {
        console.error('Error fetching user cards:', error);
        throw new Error('Failed to fetch user cards');
    } finally {
        await prismadb.$disconnect(); // Disconnect Prisma client
    }
}
