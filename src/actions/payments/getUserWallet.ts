"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function getUserWallet() {

    const userSession = await auth();
    const userId = userSession?.user?.id;
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

    if (existingWallet) {
      console.log("Existing Wallet:", existingWallet);
    //   revalidatePath("/");

      return { success: true, wallet: existingWallet };
    } else {
        
        return { success: false, wallet: "no wallet for this user yet"  };
    }
      
    
  } catch (error) {
    console.error("Error fetching or creating wallet:", error);
    return {
      success: false,
      message: "Failed to fetch or create wallet",
      error: error?.message,
    };
  }
}
