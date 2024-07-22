"use server";

import { prismadb } from "@/lib/db";

export const getVerificationTokenByToken = async (
  token: string
) => {
  try {
    const verificationToken = await prismadb.verificationToken.findUnique({
      where: { token }
    });

    return verificationToken;
    
  } catch {
    return null;
  }
}

export const getVerificationTokenByEmail = async (
  email: string
) => {
  try {
    // we are doing find first here because we are looking for a single record as there could be many emails but only one verification token
    const verificationToken = await prismadb.verificationToken.findFirst({
      where: { email }
    });

    return verificationToken;
    
  } catch {
    return null;
  }
}