"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function deleteWallet() {
    const userSession = await auth();
    const userId = userSession?.user?.id;
    console.log("User ID:", userId);
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

    // Delete the wallet
    await prismadb.wallet.delete({
      where: {
        id: wallet.id
      }
    });

    console.log("Wallet Deleted:", wallet);
    revalidatePath('/');
    return { success: true, message: "Wallet and transactions deleted successfully." };
  } catch (error) {
    console.error("Error deleting wallet:", error);
    return { success: false, message: "Failed to delete wallet", error: error?.message };
  }
}
