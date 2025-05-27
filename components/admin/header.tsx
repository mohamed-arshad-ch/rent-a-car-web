"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Bell, ChevronDown, User, LogOut, Settings } from "lucide-react"
import { useAdminAuth } from "@/lib/admin-auth-context"

type HeaderProps = {
  title: string
  actionButton?: React.ReactNode
}

export default function AdminHeader({ title, actionButton }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { admin, logout } = useAdminAuth()

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <header className="bg-white border-b sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <div className="flex items-center space-x-4">
            {actionButton}
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
                <Bell className="h-6 w-6" />
              </button>
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <span className="text-sm font-medium">{admin?.name ? getInitials(admin.name) : "AD"}</span>
                  </div>
                  <div className="hidden md:block text-sm">
                    <span className="text-gray-700 font-medium">{admin?.name || "Admin User"}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>

                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <Link
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <User className="mr-3 h-4 w-4 text-gray-500" />
                        Your Profile
                      </Link>
                      <Link
                        href="#"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <Settings className="mr-3 h-4 w-4 text-gray-500" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
