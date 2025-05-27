import type React from "react"
import type { Metadata } from "next"
import AdminBottomNavigation from "@/components/admin/bottom-navigation"
import { AdminAuthProvider } from "@/lib/admin-auth-context"

export const metadata: Metadata = {
  title: "Admin Dashboard | RentACar Management System",
  description: "Comprehensive admin dashboard for RentACar fleet management",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {children}
        <AdminBottomNavigation />
      </div>
    </AdminAuthProvider>
  )
}
