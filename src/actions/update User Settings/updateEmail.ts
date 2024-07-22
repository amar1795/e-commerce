"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Prisma } from '@prisma/client'; // Import Prisma namespace

import * as z from "zod";

import { EmailUpdateSchema } from "@/schemas";
import { auth } from "@/auth";

export async function UpdateEmail( email:z.infer<typeof EmailUpdateSchema>) {

    const userSession = await auth();
    const userId = userSession?.user?.id;
    
    try {
      // Validate userId
      if (!userId) {
        return { error: "User ID is required" };
      }
  
      // Validate email
      const validatedEmail = EmailUpdateSchema.safeParse({ email });
      if (!validatedEmail.success) {
        return { error: validatedEmail.error.errors[0].message };
      }
  
      // Find the user to ensure they exist
      const user = await prismadb.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return { error: "User not found" };
      }
  
      // Update the user's email
      const updatedUser = await prismadb.user.update({
        where: { id: userId },
        data: { email: validatedEmail.data.email },
      });
  
      console.log('Email updated successfully', updatedUser);
      return { success: "Email updated successfully" };
      
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Handle specific error for unique constraint violation
          return { error: 'Email already in use. Please choose a different email.' };
      } else {
          // Handle other errors
          console.error('Error updating email:', error);
          return { error: 'An error occurred while updating the email' };
      }
  }

  }

