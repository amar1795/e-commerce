"use server";


import { prismadb } from "@/lib/db";
import { auth } from "@/auth";

export async function updateTwoStepVerificationStatus({
  isTwoFactorEnabled,
}: { isTwoFactorEnabled: boolean }) {
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

    // Update the user's two-factor verification status
    const updatedUser = await prismadb.user.update({
      where: {
        id: userId,
      },
      data: {
        isTwoFactorEnabled: isTwoFactorEnabled,
      },
    });

    // console.log('Two-step verification status updated successfully', updatedUser);

    return { data: updatedUser.isTwoFactorEnabled, success: true, message: `Two-step verification status updated successfully to ${updatedUser.isTwoFactorEnabled}` };
  } catch (error) {
    console.error("Error updating two-step verification status:", error);
    throw new Error("Failed to update two-step verification status");
  } finally {
    await prismadb.$disconnect(); // Disconnect Prisma client
  }
}
