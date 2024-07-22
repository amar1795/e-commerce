import { prismadb } from "@/lib/db";

export const getPosterData = async () => {
  const product = await prismadb.poster.findMany({  })

  return product;
};