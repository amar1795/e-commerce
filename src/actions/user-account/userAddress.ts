"use server";

import { prismadb } from "@/lib/db";
import { revalidatePath } from "next/cache";

import * as z from "zod";
import { AddressSchema } from "@/schemas";

export async function addAddressToUser(userId: string, address: z.infer<typeof AddressSchema>) {
  try {
    // Validate userId and address
    if (!userId) {
      return { error: "User ID is required" };
    }
    const validatedAddress = AddressSchema.safeParse(address);
    if (!validatedAddress.success) {
      return { error: "Invalid address fields" };
    }

    // Find the user to ensure they exist
    const user = await prismadb.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Add the address to the user
    const newAddress = await prismadb.address.create({
      data: {
        ...validatedAddress.data,
        userId: userId,
      },
    });

    console.log('Address added successfully', newAddress);
    return { success: "Address added successfully" };
  } catch (error) {
    console.error(error);
    return { error: "An error occurred while adding the address" };
  }
}

export async function getAllAddressesForUser(userId) {
  try {
    // Validate userId
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Find all addresses associated with the user
    const addresses = await prismadb.address.findMany({
      where: { userId: userId },
    });
    // console.log('Addresses fetched successfully', addresses);
    return addresses;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while fetching the addresses');
  }
}