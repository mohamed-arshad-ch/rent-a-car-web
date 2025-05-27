"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Car,
  Users,
  Calendar,
  DollarSign,
  BarChart2,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react"
import AdminHeader from "@/components/admin/header"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { format } from "date-fns"

// Types for the dashboard data
interface DashboardStats {
  totalCars: number
  totalUsers: number
  totalBookings: number
  activeBookings: number
  totalRevenue: string
}

interface BookingUser {
  id: string
  name: string
  email: string
}

interface BookingCar {
  id: string
  name: string
  image: string | null
}

interface RecentBooking {
  id: string
  user: BookingUser
  car: BookingCar
  startDate: string
  endDate: string
  status: string
  totalPrice: number
}

interface TopPerformingCar {
  id: string
  name: string
  brand: string
  model: string
  image: string | null
  bookings: number
  revenue: string
}

interface DashboardData {
  stats: DashboardStats
  recentBookings: RecentBooking[]
  topPerformingCars: TopPerformingCar[]
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string, color: string, icon: any }> = {
    "PENDING": {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock,
      label: "Pending"
    },
    "CONFIRMED": {
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
      label: "Active"
    },
    "COMPLETED": {
      color: "bg-blue-100 text-blue-800",
      icon: CheckCircle,
      label: "Completed"
    },
    "CANCELLED": {
      color: "bg-red-100 text-red-800",
      icon: XCircle,
      label: "Cancelled"
    }
  }

  const config = statusMap[status] || statusMap.PENDING
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  )
}

export default function AdminDashboard() {
  const { token } = useAdminAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return
      
      setIsLoading(true)
      setError("")
      
      try {
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }
        
        const data = await response.json()
        setDashboardData(data)
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [token])

  // Format date string
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy')
  }
  
  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`
  }

  // Calculate percent change (placeholder - would be real in production)
  const getPercentChange = (metricName: string) => {
    // In a real app, this would calculate actual changes from previous period
    const placeholderChanges = {
      totalCars: 3.2,
      totalUsers: 5.7,
      totalBookings: 4.1,
      activeBookings: 8.3,
      totalRevenue: -2.1
    }
    
    return placeholderChanges[metricName as keyof typeof placeholderChanges] || 0
  }

  // Quick stats data based on real data
  const getQuickStats = () => {
    if (!dashboardData) return []
    
    return [
      {
        title: "Total Cars",
        value: dashboardData.stats.totalCars,
        change: getPercentChange("totalCars"),
        increasing: getPercentChange("totalCars") > 0,
        icon: Car,
        color: "bg-blue-500",
        metricName: "totalCars"
      },
      {
        title: "Active Bookings",
        value: dashboardData.stats.activeBookings,
        change: getPercentChange("activeBookings"),
        increasing: getPercentChange("activeBookings") > 0,
        icon: Calendar,
        color: "bg-green-500",
        metricName: "activeBookings"
      },
      {
        title: "Registered Users",
        value: dashboardData.stats.totalUsers,
        change: getPercentChange("totalUsers"),
        increasing: getPercentChange("totalUsers") > 0,
        icon: Users,
        color: "bg-purple-500",
        metricName: "totalUsers"
      },
      {
        title: "Total Revenue",
        value: `$${Number(dashboardData.stats.totalRevenue).toLocaleString()}`,
        change: getPercentChange("totalRevenue"),
        increasing: getPercentChange("totalRevenue") > 0,
        icon: DollarSign,
        color: "bg-orange-500",
        metricName: "totalRevenue"
      },
    ]
  }

  // Action button for the header
  const actionButton = (
    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
      Generate Report
    </button>
  )

  // Loading state
  if (isLoading) {
    return (
      <>
        <AdminHeader title="Dashboard" actionButton={actionButton} />
        <main className="flex-1 overflow-auto pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-500">Loading dashboard data...</p>
            </div>
          </div>
        </main>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <AdminHeader title="Dashboard" actionButton={actionButton} />
        <main className="flex-1 overflow-auto pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
          </div>
        </main>
      </>
    )
  }

  // No data state
  if (!dashboardData) {
    return (
      <>
        <AdminHeader title="Dashboard" actionButton={actionButton} />
        <main className="flex-1 overflow-auto pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-500 mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No dashboard data available</h3>
              <p className="text-gray-600 mb-6">We couldn't find any data to display on your dashboard.</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Refresh Dashboard
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  const quickStats = getQuickStats()

  return (
    <>
      <AdminHeader title="Dashboard" actionButton={actionButton} />
      <main className="flex-1 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard Header */}
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <p className="mt-1 text-sm text-gray-500">Overview of your car rental business</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${stat.color} rounded-md p-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{stat.title}</dt>
                        <dd>
                          <div className="text-lg font-semibold text-gray-900">{stat.value}</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        stat.increasing ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {stat.increasing ? (
                        <ArrowUp className="inline h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3 mr-1" />
                      )}
                      {Math.abs(stat.change).toFixed(1)}%
                    </span>
                    <span className="ml-2 text-gray-500">from last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Recent Bookings */}
            <div className="lg:col-span-2 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Bookings
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest booking activity across the platform</p>
              </div>
              <div className="overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {dashboardData.recentBookings.map((booking) => (
                    <li key={booking.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {/* Use initials if no image */}
                            <div className="absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              <span>{booking.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                            <div className="text-sm text-gray-500">{booking.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <StatusBadge status={booking.status} />
                        </div>
                      </div>
                      <div className="mt-4 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <div className="mr-2 flex-shrink-0 h-12 w-20 relative rounded overflow-hidden">
                              <Image
                                src={booking.car.image || "/placeholder.svg"}
                                alt={booking.car.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <p>{booking.car.name}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>{formatDateRange(booking.startDate, booking.endDate)}</p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex"></div>
                        <div className="mt-2 flex items-center text-sm font-medium text-gray-900 sm:mt-0">
                          ${Number(booking.totalPrice).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all bookings
                  </button>
                </div>
              </div>
            </div>

            {/* Top Performing Cars */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-blue-500" />
                  Top Performing Cars
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Vehicles with highest booking rates</p>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {dashboardData.topPerformingCars.map((car) => (
                    <li key={car.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="relative h-14 w-20 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={car.image || "/placeholder.svg"}
                            alt={car.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900">
                              {car.brand} {car.model}
                            </div>
                            <div className="text-sm font-semibold text-blue-600">${car.revenue}</div>
                          </div>
                          <div className="mt-1 flex items-center justify-between text-sm">
                            <span className="text-gray-500">
                              {car.bookings} {car.bookings === 1 ? "booking" : "bookings"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-500">View all cars</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
