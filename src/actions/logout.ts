"use server";
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { signOut } from "@/auth";

export const logout = async () => {
  await signOut();
  


};
