"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { UpdatePasswordSchema } from "@/schemas";  // Assuming you have the new schema created
import { getUserByEmail } from "@/data/user";
import { prismadb } from "@/lib/db";
import { PasswordChangeSuccessfull } from "./Email";  // Import your email notification function

export const updatePassword = async (
  email: string,
  values: z.infer<typeof UpdatePasswordSchema>
) => {
  const validatedFields = UpdatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "User does not exist!" };
  }

  const passwordMatch = await bcrypt.compare(currentPassword, existingUser.password);

  if (!passwordMatch) {
    return { error: "Current password is incorrect!" };
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);

  await prismadb.user.update({
    where: { id: existingUser.id },
    data: { password: hashedNewPassword },
  });

  await PasswordChangeSuccessfull({
    first_name: existingUser.name,
    senders_email: existingUser.email,
  });
  console.log("Password updated!");

  return { success: "Password updated!" };
};
