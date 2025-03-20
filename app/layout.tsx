import type React from "react";
import "@/styles/globals.css";
import { Playfair_Display } from "next/font/google";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Playfair_Display({ subsets: ["latin"] });

export const metadata = {
  title: "UgPicx - Discover Ugandan Beauty",
  description:
    "Explore the beauty of Uganda with UgPicx – your ultimate destination for stunning photos showcasing Uganda’s landscapes, culture, wildlife, and people. Discover and share breathtaking Ugandan photography.",
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
          <GoogleAnalytics />
          <div className="flex-grow">{children}</div>
          <Toaster />
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
