"use client"

import { useState } from "react"
import { Calendar, Loader2, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { format, differenceInDays, isAfter, isBefore, isValid } from "date-fns"

interface BookingModifyModalProps {
  bookingId: string
  carName: string
  currentStartDate: Date
  currentEndDate: Date
  pricePerDay: number
  currentTotalPrice: number
  onClose: () => void
  onSuccess: () => void
}

export function BookingModifyModal({
  bookingId,
  carName,
  currentStartDate,
  currentEndDate,
  pricePerDay,
  currentTotalPrice,
  onClose,
  onSuccess
}: BookingModifyModalProps) {
  const { token } = useAuth()
  const [startDate, setStartDate] = useState(format(new Date(currentStartDate), "yyyy-MM-dd"))
  const [endDate, setEndDate] = useState(format(new Date(currentEndDate), "yyyy-MM-dd"))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Calculate new total price
  const calculatePrice = () => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (!isValid(start) || !isValid(end)) {
        return currentTotalPrice
      }
      
      const days = differenceInDays(end, start) + 1
      
      if (days <= 0) {
        return currentTotalPrice
      }
      
      return Number(pricePerDay) * days
    } catch (error) {
      return currentTotalPrice
    }
  }

  const totalPrice = calculatePrice()

  // Validate dates
  const validateDates = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    
    // Set time to 00:00:00 for comparison
    today.setHours(0, 0, 0, 0)

    if (!isValid(start) || !isValid(end)) {
      setError("Please enter valid dates")
      return false
    }

    if (isBefore(start, today)) {
      setError("Start date cannot be in the past")
      return false
    }

    if (isBefore(end, start)) {
      setError("End date cannot be before start date")
      return false
    }

    setError("")
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError("You must be logged in to modify a booking")
      return
    }

    if (!validateDates()) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/bookings/modify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          bookingId,
          startDate,
          endDate,
          totalPrice
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to modify booking")
      }

      onSuccess()
    } catch (err: any) {
      console.error("Error modifying booking:", err)
      setError(err.message || "Failed to modify booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-xl font-bold text-gray-900 mb-4">Modify Booking</h2>
        <p className="text-gray-600 mb-6">
          You're modifying your booking for <span className="font-medium">{carName}</span>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Pick-up Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  min={format(new Date(), "yyyy-MM-dd")}
                  required
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                  min={startDate}
                  required
                />
                <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Price per day:</span>
                <span className="font-medium">${Number(pricePerDay).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total price:</span>
                <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 