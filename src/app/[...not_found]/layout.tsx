
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";
import { MainNav } from "@/components/main-nav";

// import { useRouter } from "next/router";
import MainFooter from "@/components/footer";
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Not Found",
  description: "Page not found",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
     
      <body  className={cn(
          "min-h-screen bg-background font-mono antialiased  ",
          fontSans.variable
        )}>

           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
                        
          
              {children}
             
              
            </ThemeProvider>
            
         
            </body>
            
            
    </html>
  );
}

// Navigating across multiple root layouts will cause a full page load (as opposed to a client-side navigation). For example, navigating from /cart that uses app/(shop)/layout.js to /blog that uses app/(marketing)/layout.js will cause a full page load. This only applies to multiple root layouts.

// options would be to use react router to avoid page reloads or to use a single root layout for the entire app.
