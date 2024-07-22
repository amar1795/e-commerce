"use server";

import { auth } from "@/auth";
import { prismadb } from "@/lib/db";

export async function getUserNameandEmailData() {

    const userSession = await auth();
    const userId = userSession?.user?.id;
  try {
    // Validate userId
    if (!userId) {
      return { error: "User ID is required" };
    }

    // Find the user
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        isTwoFactorEnabled: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

        // Split the name into firstName and lastName
        const [firstName, ...lastNameParts] = user.name?.split(' ') || [];
        const lastName = lastNameParts.join(' ');
    
        const userData = {
          firstName: firstName || '',
          lastName: lastName || '',
          email: user.email,
          isTwoFactorEnabled: user.isTwoFactorEnabled,
        };
    
        return { success: "User data retrieved successfully", data: userData };
    

  } catch (error) {
    console.error("Error fetching user data:", error);
    return { error: "An error occurred while fetching user data" };
  }
}
