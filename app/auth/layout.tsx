import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication | RentACar.in",
  description: "Login or create an account to start renting cars",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
