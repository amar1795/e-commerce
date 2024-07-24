"use server"
import { prismadb } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id:userId } });
    // console.log("user", user);
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return { error: "An error occurred while fetching user" };
  }
};
