import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "UgandaUnsplash - Discover Ugandan Beauty",
  description: "A collection of beautiful Ugandan images",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  )
}

