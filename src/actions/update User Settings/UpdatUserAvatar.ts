"use server";

import { prismadb } from "@/lib/db";
import { Prisma } from '@prisma/client'; // Import Prisma namespace

import { auth } from "@/auth";


export async function UpdateAvatar(image:string) {
  const userSession = await auth();
  const userId = userSession?.user?.id;
  
  try {
    // Validate userId
    if (!userId) {
      return { error: "User ID is required" };
    }
    
    // Find the user to ensure they exist
    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Update the user's avatar
    const updatedUser = await prismadb.user.update({
      where: { id: userId },
      data: {
        image:image
      },
    });

    console.log('Avatar updated successfully', updatedUser);
    return { success: "Avatar updated successfully" };
    
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      // Handle specific error for unique constraint violation
      return { error: 'Avatar URL already in use. Please choose a different URL.' };
    } else {
      // Handle other errors
      console.error('Error updating avatar:', error);
      return { error: 'An error occurred while updating the avatar' };
    }
  }
}
