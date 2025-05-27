"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, Loader2, Car as CarIcon, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format } from "date-fns"
import { BookingModifyModal } from "@/components/ui/booking-modify-modal"

// Define the booking types
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

export default function BookingsPage() {
  const router = useRouter()
  const { token } = useAuth()
  const [bookingFilter, setBookingFilter] = useState("active")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null)
  const [selectedBookingForModify, setSelectedBookingForModify] = useState<Booking | null>(null)

  // Fetch bookings when component mounts
  useEffect(() => {
    fetchBookings()
  }, [token])

  const fetchBookings = async () => {
    if (!token) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      
      const data = await response.json()
      setBookings(data.bookings)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load your bookings. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel a booking
  const cancelBooking = async (bookingId: string) => {
    if (!token) return
    
    setCancellingBookingId(bookingId)
    setCancelError(null)
    setCancelSuccess(null)
    
    try {
      const response = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookingId })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking')
      }
      
      setCancelSuccess('Booking cancelled successfully')
      // Refresh the bookings list
      await fetchBookings()
    } catch (err: any) {
      console.error('Error cancelling booking:', err)
      setCancelError(err.message || 'Failed to cancel booking. Please try again.')
    } finally {
      setCancellingBookingId(null)
      // Clear success message after 3 seconds
      if (cancelSuccess) {
        setTimeout(() => setCancelSuccess(null), 3000)
      }
    }
  }

  // Handle opening the modify modal
  const openModifyModal = (booking: Booking) => {
    setSelectedBookingForModify(booking)
  }

  // Handle closing the modify modal
  const closeModifyModal = () => {
    setSelectedBookingForModify(null)
  }

  // Handle successful booking modification
  const handleModifySuccess = () => {
    // Show success message
    setCancelSuccess('Booking modified successfully')
    // Refresh bookings
    fetchBookings()
    // Close modal
    closeModifyModal()
    // Clear success message after 3 seconds
    setTimeout(() => setCancelSuccess(null), 3000)
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy')
  }

  // Filter bookings based on selected filter
  const filteredBookings = bookings.filter((booking) => {
    if (bookingFilter === "active") return booking.displayStatus === "active"
    if (bookingFilter === "upcoming") return booking.displayStatus === "upcoming"
    if (bookingFilter === "past") return booking.displayStatus === "completed"
    return true
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Your Bookings</h1>

      {/* Success and Error Messages */}
      {cancelSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center mb-4">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
          </svg>
          {cancelSuccess}
        </div>
      )}

      {cancelError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center mb-4">
          <AlertCircle className="h-5 w-5 mr-2" />
          {cancelError}
        </div>
      )}

      {/* Booking Filters */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setBookingFilter("active")}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              bookingFilter === "active"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setBookingFilter("upcoming")}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              bookingFilter === "upcoming"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setBookingFilter("past")}
            className={`flex-1 py-3 text-center text-sm font-medium ${
              bookingFilter === "past"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Past
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load bookings</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => fetchBookings()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Booking List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-4">You don't have any {bookingFilter} bookings at the moment.</p>
              <button
                onClick={() => router.push("/dashboard/cars")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Find a Car to Rent
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 sm:h-auto sm:w-1/3">
                    {booking.car.image ? (
                      <Image
                        src={booking.car.image}
                        alt={`${booking.car.brand} ${booking.car.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <CarIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div
                      className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded ${
                        booking.displayStatus === "active"
                          ? "bg-green-500 text-white"
                          : booking.displayStatus === "upcoming"
                            ? "bg-blue-500 text-white"
                            : booking.displayStatus === "completed"
                              ? "bg-gray-500 text-white"
                              : "bg-red-500 text-white"
                      }`}
                    >
                      {booking.displayStatus.charAt(0).toUpperCase() + booking.displayStatus.slice(1)}
                    </div>
                  </div>
                  <div className="p-4 sm:w-2/3">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900">{booking.car.brand} {booking.car.model}</h3>
                      <span className="text-sm text-gray-500">{booking.id.substring(0, 8)}</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        Pick-up location information not available
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="font-bold text-gray-900">${Number(booking.totalPrice).toFixed(2)}</span>
                      <div className="flex space-x-2">
                        {booking.displayStatus === "active" && (
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            disabled={cancellingBookingId === booking.id}
                            className={`${
                              cancellingBookingId === booking.id 
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-red-500 hover:bg-red-600"
                            } text-white px-3 py-1 rounded text-sm font-medium flex items-center transition-colors`}
                          >
                            {cancellingBookingId === booking.id ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                Cancelling...
                              </>
                            ) : (
                              "Cancel"
                            )}
                          </button>
                        )}
                        {booking.displayStatus === "upcoming" && (
                          <>
                            <button 
                              onClick={() => cancelBooking(booking.id)}
                              disabled={cancellingBookingId === booking.id}
                              className={`${
                                cancellingBookingId === booking.id 
                                  ? "bg-gray-400 cursor-not-allowed" 
                                  : "bg-red-500 hover:bg-red-600"
                              } text-white px-3 py-1 rounded text-sm font-medium flex items-center transition-colors`}
                            >
                              {cancellingBookingId === booking.id ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  Cancelling...
                                </>
                              ) : (
                                "Cancel"
                              )}
                            </button>
                            <button 
                              onClick={() => openModifyModal(booking)}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                            >
                              Modify
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => router.push(`/dashboard/cars/${booking.car.id}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modify Booking Modal */}
      {selectedBookingForModify && (
        <BookingModifyModal
          bookingId={selectedBookingForModify.id}
          carName={`${selectedBookingForModify.car.brand} ${selectedBookingForModify.car.model}`}
          currentStartDate={selectedBookingForModify.startDate}
          currentEndDate={selectedBookingForModify.endDate}
          pricePerDay={Number(selectedBookingForModify.car.pricePerDay)}
          currentTotalPrice={Number(selectedBookingForModify.totalPrice)}
          onClose={closeModifyModal}
          onSuccess={handleModifySuccess}
        />
      )}
    </div>
  )
}
