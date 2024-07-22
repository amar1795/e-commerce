"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ForgotPasswordEmail } from "./Email";

export const twoFactorEmail = async (values) => {
  


  await ForgotPasswordEmail(
    {
      first_name: existingUser.name,
      senders_email: email,
      token: passwordResetToken.token,
    }
  );


  return { success: "Reset email sent!" };
}