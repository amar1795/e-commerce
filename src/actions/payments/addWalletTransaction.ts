"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function addTransaction( amount, type, description = '') {
    const userSession = await auth();
    
    const userId = userSession?.user?.id;

    if(!userId) {
        return { success: false, message: "User not found" };
    }

    // console.log("User ID:", userId, "Amount:", amount, "Type:", type);
  try {
    // Fetch the wallet for the user
    const wallet = await prismadb.wallet.findFirst({
      where: {
        userId: userId
      }
    });

    if (!wallet) {
      throw new Error("Wallet not found for user.");
    }

    // Update wallet balance
    const newBalance = type === 'CREDIT' ? wallet.balance + amount : wallet.balance - amount;

    // Create a new transaction
    const transaction = await prismadb.transaction.create({
      data: {
        walletId: wallet.id,
        amount: amount,
        type: type,
        description: description
      }
    });

    // Update the wallet balance
    await prismadb.wallet.update({
      where: {
        id: wallet.id
      },
      data: {
        balance: newBalance
      }
    });

    revalidatePath('/');
    return { success: true, transaction, balance: newBalance };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, message: "Failed to create transaction", error: error?.message };
  }
}
