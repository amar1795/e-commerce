"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { prismadb } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/lib/tokens";
import { ForgotPasswordEmail, PasswordChangeSuccessfull } from "./Email";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prismadb.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

//   deleting the token after password reset to make sure that there is no token reuse and only one token
  await prismadb.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  await PasswordChangeSuccessfull(
    {
      first_name: existingUser.name,
      senders_email: existingUser.email,
    }
  );


  return { success: "Password updated!" };
};
