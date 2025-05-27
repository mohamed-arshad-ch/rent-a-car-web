import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthProviderWrapper from "@/components/auth-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RentACar - Premium Car Rental Service",
  description:
    "Experience the freedom of the road with our premium car rental service. We offer a wide range of vehicles to suit every need and budget.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProviderWrapper>
            {children}
          </AuthProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
