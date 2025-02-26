import type React from "react";
import "@/styles/globals.css";
import { Playfair_Display } from "next/font/google";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "UgandaUnsplash - Discover Ugandan Beauty",
  description: "A collection of beautiful Ugandan images",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} flex flex-col min-h-screen`}>
          <div className="flex-grow">{children}</div>
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
