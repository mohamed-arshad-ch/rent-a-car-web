"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  Calendar,
  Loader2,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  FileText,
  Edit,
  XCircle,
  MoreHorizontal,
  AlertCircle
} from "lucide-react"
import AdminHeader from "@/components/admin/header"
import { Badge } from "@/components/ui/badge"
import BookingDetailsModal from "@/components/admin/booking-details-modal"
import { useAdminAuth } from "@/lib/admin-auth-context"

// Define interfaces
interface Booking {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  carId: string
  carName: string
  carType: string
  carImage: string
  startDate: string
  endDate: string
  totalDays: number
  totalValue: number
  status: string
  createdAt: string
}

interface Stats {
  total: number
  active: number
  pending: number
  completed: number
  cancelled: number
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

// Helper functions for formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

export default function BookingManagement() {
  const { token } = useAdminAuth()
  
  // State for UI
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  })
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [statusFilter, setStatusFilter] = useState("All")
  const [carTypeFilter, setCarTypeFilter] = useState("All")
  const [sortOption, setSortOption] = useState("Newest First")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  
  // Determine car types from available bookings
  const [carTypes, setCarTypes] = useState<string[]>([])

  // Fetch bookings from API
  const fetchBookings = async () => {
    if (!token) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const url = new URL('/api/admin/bookings', window.location.origin)
      
      // Add query parameters
      if (searchQuery) url.searchParams.append('search', searchQuery)
      if (statusFilter !== 'All') url.searchParams.append('status', statusFilter)
      if (carTypeFilter !== 'All') url.searchParams.append('carType', carTypeFilter)
      
      if (dateRange.start && dateRange.end) {
        url.searchParams.append('startDate', dateRange.start)
        url.searchParams.append('endDate', dateRange.end)
      }
      
      url.searchParams.append('sortBy', sortOption)
      url.searchParams.append('page', currentPage.toString())
      url.searchParams.append('limit', itemsPerPage.toString())
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      setBookings(data.bookings)
      setFilteredBookings(data.bookings)
      setStats(data.stats)
      setPagination(data.pagination)
      
      // Extract unique car types
      const types = [...new Set(data.bookings.map((booking: Booking) => booking.carType))]
      setCarTypes(types as string[])
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch bookings when filters or pagination changes
  useEffect(() => {
    fetchBookings()
  }, [token, searchQuery, statusFilter, carTypeFilter, dateRange, sortOption, currentPage])

  // Handle pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setDateRange({ start: "", end: "" })
    setStatusFilter("All")
    setCarTypeFilter("All")
    setSortOption("Newest First")
  }

  // View booking details
  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }
  
  // Update booking status
  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    if (!token) return
    
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: bookingId,
          status: newStatus
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update booking status')
      }
      
      // Refresh bookings after update
      fetchBookings()
      
      // Close the modal
      setShowBookingDetails(false)
      setSelectedBooking(null)
      
      return true
    } catch (err) {
      console.error('Error updating booking status:', err)
      return false
    }
  }

  // Get badge variant based on status
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "active":
        return "success"
      case "pending":
        return "warning"
      case "cancelled":
        return "destructive"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }
  
  // Error state
  if (error && !isLoading) {
    return (
      <>
        <AdminHeader title="Booking Management" />
        <main className="flex-1 overflow-auto pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load bookings</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => fetchBookings()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <AdminHeader title="Booking Management" />
      <main className="flex-1 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Booking Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-gray-500 mb-1">Total Bookings</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-gray-500 mb-1">Active</div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-gray-500 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold text-blue-600">{stats.completed}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow flex flex-col">
              <div className="text-sm text-gray-500 mb-1">Cancelled</div>
              <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by booking ID, customer name, or car..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="ml-4 flex items-center">
                  <button
                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Status Filter */}
                    <div>
                      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status-filter"
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Car Type Filter */}
                    <div>
                      <label htmlFor="car-type-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Car Type
                      </label>
                      <select
                        id="car-type-filter"
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={carTypeFilter}
                        onChange={(e) => setCarTypeFilter(e.target.value)}
                      >
                        <option value="All">All Types</option>
                        {carTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date Range */}
                    <div>
                      <label htmlFor="date-start" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        id="date-start"
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={dateRange.start}
                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="date-end" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        id="date-end"
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={dateRange.end}
                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                      />
                    </div>

                    {/* Sort Option */}
                    <div className="md:col-span-2 lg:col-span-4">
                      <label htmlFor="sort-option" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        id="sort-option"
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <option value="Newest First">Newest First</option>
                        <option value="Oldest First">Oldest First</option>
                        <option value="Price: High to Low">Price: High to Low</option>
                        <option value="Price: Low to High">Price: Low to High</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                    <button
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      onClick={() => setShowFilters(false)}
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No bookings found matching your criteria.</p>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Booking Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Car
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dates
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                                <div className="text-xs text-gray-500">
                                  Created: {formatDate(booking.createdAt)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                            <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-16 relative">
                                <img
                                  src={booking.carImage}
                                  alt={booking.carName}
                                  className="h-10 w-16 object-cover rounded"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{booking.carName}</div>
                                <div className="text-sm text-gray-500">{booking.carType}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </div>
                            <div className="text-sm text-gray-500">{booking.totalDays} days</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={getStatusBadgeVariant(booking.status)}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(booking.totalValue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => viewBookingDetails(booking)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                          </span>{" "}
                          of <span className="font-medium">{pagination.totalItems}</span> bookings
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronDown className="h-5 w-5 rotate-90" />
                          </button>
                          {Array.from({ length: pagination.totalPages }, (_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => paginate(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === i + 1
                                  ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                              } text-sm font-medium`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => paginate(Math.min(pagination.totalPages, currentPage + 1))}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Next</span>
                            <ChevronDown className="h-5 w-5 -rotate-90" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => setShowBookingDetails(false)}
          onUpdateStatus={updateBookingStatus}
        />
      )}
    </>
  )
}
