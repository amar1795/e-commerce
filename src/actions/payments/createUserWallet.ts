"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function CreateUserWallet() {
  const userSession = await auth();
  const userId = userSession?.user?.id;
  try {

     // Check if wallet already exists
     const existingWallet = await prismadb.wallet.findFirst({
        where: {
          userId: userId
        }
      });
  
      if (existingWallet) {
        return { success: false, message: "Wallet already exists for this user." };
      }
    // If wallet does not exist, create a new wallet with initial balance
    const newWallet = await prismadb.wallet.create({
      data: {
        userId: userId,
        balance: 100000, // Initial balance for new wallet
      },
    });

    // Create an initial credit transaction
    await prismadb.transaction.create({
        data: {
          walletId: newWallet.id,
          amount: 100000,
          type: 'CREDIT',
          description: 'Initial deposit'
        }
      });

    // console.log("New Wallet Created:", newWallet);
   

      return { success: true, wallet: newWallet };
     
  } catch (error) {
    console.error("Error creating wallet:", error);
    return {
      success: false,
      message: "Failed to fetch or create wallet",
      error: error?.message,
    };
  }
}
