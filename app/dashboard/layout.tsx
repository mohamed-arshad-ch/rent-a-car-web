"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Calendar, User, Bell, Car, LogOut, Settings, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()

  // Set active tab based on pathname
  useEffect(() => {
    if (pathname === "/dashboard") setActiveTab("home")
    else if (pathname.includes("/dashboard/cars")) setActiveTab("cars")
    else if (pathname.includes("/dashboard/bookings")) setActiveTab("bookings")
    else if (pathname.includes("/dashboard/profile")) setActiveTab("profile")
  }, [pathname])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // User initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 ml-2">RentACar</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Hello, {user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </div>
            <div className="relative">
              <div 
                className="flex items-center cursor-pointer" 
                onClick={toggleDropdown}
              >
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium border border-blue-200">
                  {user?.name ? getInitials(user.name) : "U"}
                </div>
                <ChevronDown className="h-4 w-4 ml-1 text-gray-500" />
              </div>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                  <Link 
                    href="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Your Profile
                  </Link>
                  <Link 
                    href="/dashboard/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20">{children}</main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
        <div className="container mx-auto px-4">
          <div className="flex justify-around">
            <Link
              href="/dashboard"
              className={`flex flex-col items-center py-3 px-5 ${
                activeTab === "home" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <Link
              href="/dashboard/cars"
              className={`flex flex-col items-center py-3 px-5 ${
                activeTab === "cars" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Car className="h-6 w-6" />
              <span className="text-xs mt-1">Cars</span>
            </Link>
            <Link
              href="/dashboard/bookings"
              className={`flex flex-col items-center py-3 px-5 ${
                activeTab === "bookings" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <Calendar className="h-6 w-6" />
              <span className="text-xs mt-1">Bookings</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className={`flex flex-col items-center py-3 px-5 ${
                activeTab === "profile" ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
