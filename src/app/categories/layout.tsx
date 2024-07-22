import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import { getProductsByCategory } from "@/actions/createProduct";
import { MainNav } from "@/components/main-nav";
import { getCartDataFromCookies } from "@/actions/cart/addCartDatatoCookies";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Category",
  description: "Men's clothing",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const user = session?.user?.id;
  const mensCollectionData = await getProductsByCategory(
    "665a0b9f14be77720636d443",user);
    const data=await getCartDataFromCookies()
    const count=data.length;
  // console.log("this is the session", session);
  return (
    <SessionProvider session={session}>

    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-mono antialiased mx-[2rem] ",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <div className="fixed top-0 left-0 right-0  z-10">
        <MainNav mensCollectionData={mensCollectionData} cartCountData={count}/>
      </div>
      <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
    </SessionProvider>

  );
}
