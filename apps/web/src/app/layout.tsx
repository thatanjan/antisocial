import type { Metadata } from "next";
import { DM_Mono, DM_Sans, DM_Serif_Text } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";

const fontSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = DM_Serif_Text({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = DM_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Antisocial",
  description: "A modern social media foundation.",
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn("font-sans", fontSans.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem={false}
        >
          {children}
          <Toaster position="bottom-right" richColors />
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
