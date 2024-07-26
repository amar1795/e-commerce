import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { MainNav } from "@/components/main-nav";
// import { useRouter } from "next/router";
import MainFooter from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { getProductsByCategory } from "@/actions/createProduct";
import { getCartDataFromCookies } from "@/actions/cart/addCartDatatoCookies";

export const metadata: Metadata = {
  title: "PurchasesPal",
  description: "experience shopping like never before",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const cartCountData=0;
  const user = session?.user?.id;
  const mensCollectionData = await getProductsByCategory(
    "665a0b9f14be77720636d443",
    user
  );
  const data=await getCartDataFromCookies()
const count=data.length;
  // console.log("this is the menscollection wishlist count ", mensCollectionData);

  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-mono antialiased px-8 ",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className=" overflow-hidden">
              <div className="fixed top-0 left-0 right-0  z-10">
                <MainNav mensCollectionData={mensCollectionData} cartCountData={count}/>
              </div>
              <Toaster />
              <div className=" mt-[8rem] below-1319:mt-[11rem] below-600:mt-[15rem]">
                {children}

                <MainFooter />
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}

// Navigating across multiple root layouts will cause a full page load (as opposed to a client-side navigation). For example, navigating from /cart that uses app/(shop)/layout.js to /blog that uses app/(marketing)/layout.js will cause a full page load. This only applies to multiple root layouts.

// options would be to use react router to avoid page reloads or to use a single root layout for the entire app.
