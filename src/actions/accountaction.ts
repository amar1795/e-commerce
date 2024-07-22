import { prismadb } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await prismadb.account.findFirst({
      where: { userId }
    });

    return account;
  } catch {
    return null;
  }
};
