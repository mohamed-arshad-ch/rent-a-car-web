"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Car, Users, Calendar, UserCog } from "lucide-react"

export default function AdminBottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname.includes(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-20">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex justify-around">
          <Link
            href="/admin/dashboard"
            className={`flex flex-col items-center py-3 px-5 ${
              isActive("/admin/dashboard") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/admin/cars"
            className={`flex flex-col items-center py-3 px-5 ${
              isActive("/admin/cars") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Car className="h-6 w-6" />
            <span className="text-xs mt-1">Cars</span>
          </Link>
          <Link
            href="/admin/drivers"
            className={`flex flex-col items-center py-3 px-5 ${
              isActive("/admin/drivers") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <UserCog className="h-6 w-6" />
            <span className="text-xs mt-1">Drivers</span>
          </Link>
          <Link
            href="/admin/users"
            className={`flex flex-col items-center py-3 px-5 ${
              isActive("/admin/users") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Users className="h-6 w-6" />
            <span className="text-xs mt-1">Users</span>
          </Link>
          <Link
            href="/admin/bookings"
            className={`flex flex-col items-center py-3 px-5 ${
              isActive("/admin/bookings") ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Bookings</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
