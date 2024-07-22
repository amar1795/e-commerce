"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

import * as z from "zod";
import { NameUpdateSchema } from "@/schemas";
import { auth } from "@/auth";

export async function UpdateName(name: z.infer<typeof NameUpdateSchema>) {
    
    const userSession = await auth();
    const userId = userSession?.user?.id;


  try {
    // Validate userId and address
    if (!userId) {
      return { error: "User ID is required" };
    }
    const validatedName = NameUpdateSchema.safeParse(name);
    if (!validatedName.success) {
      return { error: "Invalid Name fields" };
    }

    // Find the user to ensure they exist
    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }


    const { firstname, lastname } = validatedName.data;
  // Update the user's name
  const updatedUser = await prismadb.user.update({
    where: { id: userId },
    data: {
      name: `${firstname} ${lastname}`,
    },
  });

  console.log(`Name updated successfully to ${updatedUser.name} `, updatedUser);
  return { success:`Name updated successfully to ${updatedUser.name} ` };
  } catch (error) {
    console.error("Error updating name:", error);
    return { error: "An error occurred while updating the name" };
  }
}

