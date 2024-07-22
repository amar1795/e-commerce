import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import { prismadb } from "@/lib/db";


export const generateTwoFactorToken = async (email: string) => {

  // this line generates a random 6 digit number
  const token = crypto.randomInt(100_000, 1_000_000).toString();

  // valid for 5 minutes only
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

   const getTwoFactorTokenByEmail = async (email: string) => {
    try {
      const twoFactorToken = await prismadb.twoFactorToken.findFirst({
        where: { email }
      });
  
      return twoFactorToken;
    } catch {
      return null;
    }
  };
  
  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prismadb.twoFactorToken.delete({
      where: {
        id: existingToken.id,
      }
    });
  }

  try {
    const twoFactorToken = await prismadb.twoFactorToken.create({
        data: {
          email,
          token,
          expires,
        }
      });
    
      return twoFactorToken;
    
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
 
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    
    // 10 minutes expiry time added to the current time
    const expires = new Date(new Date().getTime() + 600 * 1000);


     const getPasswordResetTokenByEmail = async (email: string) => {
        try {
          const passwordResetToken = await prismadb.passwordResetToken.findFirst({
            where: { email }
          });
      
          return passwordResetToken;
        } catch {
          return null;
        }
      };
  
    const existingToken = await getPasswordResetTokenByEmail(email);
  
    // deleting the existing token if it exists
    if (existingToken) {
      await prismadb.passwordResetToken.delete({
        where: { id: existingToken.id }
      });
    }
  
    // creating a new token
    const passwordResetToken = await prismadb.passwordResetToken.create({
      data: {
        email,
        token,
        expires
      }
    });
  
    return passwordResetToken;
  
    
  }


  // at the time of verification
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prismadb.passwordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};