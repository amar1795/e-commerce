// import { PrismaClient } from "@prisma/client";
import {PrismaClient} from "../prisma/generated/client"; // this works in production now works in development too after the folder was created but HOW???????

declare global {
  var prisma: PrismaClient | undefined;
}

export const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") 
  globalThis.prisma = prismadb;