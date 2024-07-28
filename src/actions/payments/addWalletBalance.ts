"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

export async function addWalletBalance() {
  const userSession = await auth();
  const userId = userSession?.user?.id;

  if (!userId) {
    throw new Error('User not authenticated');
  }

  try {
    // Fetch existing wallet if available
    const existingWallet = await prismadb.wallet.findFirst({
      where: {
        userId: userId,
      },
      include: {
        transactions: true
      }
    });

    if (!existingWallet) {
      throw new Error('Wallet not found');
    }

    // Check the last transaction time for adding balance
    const lastTransaction = await prismadb.transaction.findFirst({
      where: {
        walletId: existingWallet.id,
        type: 'CREDIT', 
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    if (lastTransaction && lastTransaction.createdAt > oneHourAgo) {
      const remainingTime = new Date(lastTransaction.createdAt.getTime() + 60 * 60 * 1000) - new Date();
      const remainingMinutes = Math.ceil(remainingTime / (1000 * 60));
      throw new Error(`Please wait for ${remainingMinutes} minutes to add balance again`);
    }

    // Add balance to wallet
    const updatedWallet = await prismadb.wallet.update({
      where: {
        id: existingWallet.id,
      },
      data: {
        balance: {
          increment: 100000
        }
      }
    });

    // Record the transaction
    await prismadb.transaction.create({
      data: {
        walletId: existingWallet.id,
        type: 'CREDIT',
        amount: 100000,
        description:"Added balance to wallet by the user",
      }
    });

    return { success: true, wallet: updatedWallet };
  } catch (error) {
    // console.error("Error adding balance to wallet:", error);
    return {
      success: false,
      message: "Failed to add balance to wallet",
      error: error?.message,
    };
  }
}
