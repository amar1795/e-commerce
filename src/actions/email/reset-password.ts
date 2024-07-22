"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ForgotPasswordEmail } from "./Email";

export const Reset = async (values: z.infer<typeof ResetSchema>) => {
  
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid emaiL!" };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);

// send email to user with reset link now commented out for testing

  await ForgotPasswordEmail(
    {
      first_name: existingUser.name,
      senders_email: email,
      token: passwordResetToken.token,
    }
  );


  return { success: "Reset email sent!" };
}