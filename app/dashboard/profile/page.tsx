"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, FileText, HelpCircle, Settings, LogOut, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

// Define profile data type
interface ProfileData {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  memberSince: string
}

export default function ProfilePage() {
  const { token, logout } = useAuth()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      if (!token) {
        router.push('/auth/login')
        return
      }

      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }

        const data = await response.json()
        setProfileData(data.profile)
      } catch (err) {
        console.error('Error fetching profile:', err)
        setError('Failed to load your profile. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [token, router])

  const handleLogout = () => {
    logout()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load profile</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => setIsLoading(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>

      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start">
          <div className="relative h-24 w-24 rounded-full overflow-hidden mb-4 sm:mb-0 sm:mr-6">
            <Image
              src="/placeholder.svg" // Default placeholder since we don't have profile images
              alt={profileData?.name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{profileData?.name}</h2>
            <p className="text-gray-500">Member since {profileData?.memberSince}</p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{profileData?.email}</p>
            </div>
            <button className="text-blue-600 text-sm">Edit</button>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{profileData?.phoneNumber || "Not provided"}</p>
            </div>
            <button className="text-blue-600 text-sm">Edit</button>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-sm text-gray-500">Password</p>
              <p className="font-medium text-gray-900">••••••••</p>
            </div>
            <button className="text-blue-600 text-sm">Change</button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Quick Links</h2>
        </div>
        <div className="p-4">
          <ul className="divide-y divide-gray-100">
            <li>
              <Link href="#" className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-900">Driving License Information</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-900">Help & Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </li>
            <li>
              <Link href="#" className="flex items-center justify-between py-3 hover:bg-gray-50 px-2 rounded-lg">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-900">Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Logout Button */}
      <button 
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 rounded-xl flex items-center justify-center"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </button>
    </div>
  )
}
