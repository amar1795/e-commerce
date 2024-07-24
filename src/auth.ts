import NextAuth from "next-auth";
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prismadb } from "@/lib/db";
import authConfig from "@/auth.config";
import { getTwoFactorConfirmationByUserId } from "./actions/two-factor and security related actions/twoFactorConfirmation";


export const getUserById = async (id: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });
    // console.log("this is the user data", user)
    return user;
  } catch {
    return null;
  }
};

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


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  events: {
    async linkAccount({ user }) {
      await prismadb.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      // if (account?.provider !== "credentials") return true;

      // we are passing username and password and here the id is being passed here , where it is being checked if the user exists or not and accoridngly user id is being passed
      const existingUser = await getUserById(user?.id);

      // Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;

        // prevent signin using two factor authentication

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in as it will be asked everytime the user signs in hence we are deleting it after the session is cancelled
        await prismadb.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      
      // sub is a unique identifier for the user ie the user id
      if (!token.sub) return token;
      
      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;

    },
    
  },
  adapter: PrismaAdapter(prismadb),
  session: { strategy: "jwt" },
  ...authConfig,
});
