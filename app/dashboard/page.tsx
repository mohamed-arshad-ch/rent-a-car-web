"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Calendar,
  Search,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  Car,
  Gift,
  Heart,
  Grid,
  List,
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react"

// Import components
import CarCard from "@/components/car-card"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

// Define types
interface Car {
  id: string
  name: string
  brand: string
  model: string
  image: string | null
  pricePerDay: number
  type: string
  color: string
  year: number
}

interface Booking {
  id: string
  startDate: Date
  endDate: Date
  totalPrice: number
  status: string
  displayStatus: string
  userId: string
  carId: string
  car: Car
  createdAt: Date
}

interface User {
  id: string
  name: string
  email: string
  phoneNumber: string | null
  memberSince: string
}

export default function Dashboard() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")
  const [bookingFilter, setBookingFilter] = useState("active")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("recommended")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  
  // State for API data
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [popularCars, setPopularCars] = useState<Car[]>([])
  const [recentlyViewedCars, setRecentlyViewedCars] = useState<Car[]>([])
  const [profileData, setProfileData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch user data and bookings
  useEffect(() => {
    if (!token) {
      router.push('/auth/login')
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError("")
      try {
        // Fetch user profile
        const profileResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile data')
        }
        
        const profileData = await profileResponse.json()
        setProfileData(profileData.profile)
        
        // Fetch bookings
        const bookingsResponse = await fetch('/api/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings data')
        }
        
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings)
        
        // Fetch cars
        const carsResponse = await fetch('/api/cars')
        
        if (!carsResponse.ok) {
          throw new Error('Failed to fetch cars data')
        }
        
        const carsData = await carsResponse.json()
        setCars(carsData.cars)
        
        // Set popular cars (for now, we'll just use the first 3 cars)
        setPopularCars(carsData.cars.slice(0, 3))
        
        // Set recently viewed cars (for now, just use first 3 different cars)
        setRecentlyViewedCars(carsData.cars.slice(3, 6))
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [token, router])

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "active") return booking.displayStatus === "active"
    if (bookingFilter === "upcoming") return booking.displayStatus === "upcoming"
    if (bookingFilter === "past") return booking.displayStatus === "completed"
    return true
  })

  // Get active booking if exists
  const activeBooking = bookings.find((booking) => booking.displayStatus === "active")

  // Filter cars based on search query
  const filteredCars = cars.filter((car) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      car.name.toLowerCase().includes(query) ||
      car.type.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query)
    )
  })

  // Format date
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Home Tab Content */}
      {activeTab === "home" && (
        <div className="space-y-6">
          {/* Welcome Section */}
          <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <h1 className="text-2xl font-bold">Welcome back, {profileData?.name || user?.name || "User"}!</h1>
            <p className="mt-1 text-blue-100">
              Member since {profileData?.memberSince || "recently"}
            </p>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => setActiveTab("cars")}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                Find a Car
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className="bg-blue-500 bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center"
              >
                <Calendar className="h-4 w-4 mr-2" />
                My Bookings
              </button>
            </div>
          </section>

          {/* Current/Upcoming Booking */}
          {activeBooking && (
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-600" />
                  Current Booking
                </h2>
              </div>
              <div className="p-4">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 sm:h-auto sm:w-1/3 rounded-lg overflow-hidden">
                    <Image
                      src={activeBooking.car.image || "/placeholder.svg"}
                      alt={activeBooking.car.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Active
                    </div>
                  </div>
                  <div className="sm:w-2/3 p-4">
                    <h3 className="text-xl font-bold text-gray-900">{activeBooking.car.name}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {formatDate(activeBooking.startDate)} - {formatDate(activeBooking.endDate)}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        Booking ID: {activeBooking.id}
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        href={`/dashboard/bookings`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        Manage Booking
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Popular Cars Section */}
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Popular Cars</h2>
              <Link href="/dashboard/cars" className="text-blue-600 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {popularCars.map((car) => (
                  <div key={car.id} className="bg-gray-50 rounded-lg overflow-hidden">
                    <div className="relative h-40 w-full">
                      <Image
                        src={car.image || "/placeholder.svg"}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900">{car.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-gray-500">{car.type}</div>
                        <div className="font-bold text-blue-600">${car.pricePerDay}/day</div>
                      </div>
                      <Link
                        href={`/dashboard/cars/${car.id}`}
                        className="mt-3 block text-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recently Viewed Cars */}
          {recentlyViewedCars.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Recently Viewed</h2>
                <Link href="/dashboard/cars" className="text-blue-600 text-sm font-medium">
                  View All Cars
                </Link>
            </div>
            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentlyViewedCars.map((car) => (
                    <div key={car.id} className="flex bg-gray-50 rounded-lg overflow-hidden">
                      <div className="relative h-24 w-24 flex-shrink-0">
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={car.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3 flex-1">
                        <h3 className="font-bold text-gray-900">{car.name}</h3>
                        <div className="text-sm text-gray-500">{car.type}</div>
                        <div className="font-bold text-blue-600 mt-1">${car.pricePerDay}/day</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          )}

          {/* Quick Links */}
          <section className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-900">Quick Links</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <Link href="/dashboard/bookings" className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="bg-blue-100 rounded-full p-3 mb-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                  <span className="text-gray-900 font-medium">My Bookings</span>
                </Link>
                <Link href="/dashboard/cars" className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="bg-blue-100 rounded-full p-3 mb-2">
                    <Car className="h-6 w-6 text-blue-600" />
                    </div>
                  <span className="text-gray-900 font-medium">Find a Car</span>
                </Link>
                <Link href="/dashboard/profile" className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="bg-blue-100 rounded-full p-3 mb-2">
                    <Settings className="h-6 w-6 text-blue-600" />
                      </div>
                  <span className="text-gray-900 font-medium">My Profile</span>
                </Link>
                <Link href="#" className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="bg-blue-100 rounded-full p-3 mb-2">
                    <HelpCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-gray-900 font-medium">Help & Support</span>
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Remaining tab content components would be here */}
      {/* For brevity, we're focusing just on the home tab that shows dashboard data */}
    </div>
  )
}
