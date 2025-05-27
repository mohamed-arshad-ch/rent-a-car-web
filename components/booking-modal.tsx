"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { format, addDays, differenceInDays, isToday, isBefore } from "date-fns"
import { Calendar as CalendarIcon, X, MapPin, Clock, Car as CarIcon, Loader2, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

// Car type based on Prisma schema
interface Car {
  id: string
  name: string
  brand: string
  type: string
  model: string
  year: number
  color: string
  transmission: string
  fuelType: string
  seats: number
  pricePerDay: number
  availability: boolean
  image?: string | null
  description?: string | null
}

type BookingModalProps = {
  isOpen: boolean
  onClose: () => void
  car: Car | null
}

export default function BookingModal({ isOpen, onClose, car }: BookingModalProps) {
  const router = useRouter()
  const { user, token } = useAuth()
  const today = new Date()
  
  // Form state
  const [startDate, setStartDate] = useState<Date>(today)
  const [endDate, setEndDate] = useState<Date>(addDays(today, 3))
  const [pickupLocation, setPickupLocation] = useState("New York City")
  const [pickupTime, setPickupTime] = useState("10:00")
  const [returnLocation, setReturnLocation] = useState("Same as pick-up")
  const [returnTime, setReturnTime] = useState("10:00")
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [pickupCalendarOpen, setPickupCalendarOpen] = useState(false)
  const [returnCalendarOpen, setReturnCalendarOpen] = useState(false)

  // Set default dates when car changes
  useEffect(() => {
    if (car) {
      setStartDate(today)
      setEndDate(addDays(today, 3))
    }
  }, [car])

  if (!isOpen || !car) return null

  // Calculate booking details
  const days = differenceInDays(endDate, startDate) + 1
  const basePrice = Number(car.pricePerDay) || 0
  const subtotal = basePrice * days
  const taxesAndFees = Math.round(subtotal * 0.1)
  const total = subtotal + taxesAndFees

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return format(date, "EEE, MMM d, yyyy")
  }

  // Validation
  const validateDates = () => {
    if (isBefore(endDate, startDate)) {
      setError("Return date cannot be before pickup date")
      return false
    }
    
    if (isBefore(startDate, today) && !isToday(startDate)) {
      setError("Pickup date cannot be in the past")
      return false
    }
    
    return true
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !token) {
      router.push("/auth/login")
      return
    }
    
    if (!validateDates()) return
    
    setIsSubmitting(true)
    setError("")
    
    try {
      const bookingData = {
        carId: car.id,
        startDate: new Date(`${format(startDate, "yyyy-MM-dd")}T${pickupTime}`),
        endDate: new Date(`${format(endDate, "yyyy-MM-dd")}T${returnTime}`),
        totalPrice: total,
        pickupLocation,
        returnLocation: returnLocation === "Same as pick-up" ? pickupLocation : returnLocation,
        pickupTime,
        returnTime
      }
      
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookingData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking")
      }
      
      // Show success message and redirect after delay
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard/bookings")
        onClose()
      }, 2000)
    } catch (err: any) {
      console.error("Error creating booking:", err)
      setError(err.message || "Failed to create booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 overflow-y-auto p-4">
      <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
          disabled={isSubmitting}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Success overlay */}
        {success && (
          <div className="absolute inset-0 z-20 bg-white bg-opacity-95 rounded-2xl flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-4">Your booking has been successfully created.</p>
            <p className="text-gray-500">Redirecting to your bookings...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Car details section */}
          <div className="bg-blue-600 text-white p-8 rounded-l-2xl">
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-blue-200 uppercase">You're booking</h3>
              <h2 className="text-2xl font-bold mt-1">{car.brand} {car.model}</h2>
              <div className="flex items-center mt-2">
                <span className="text-sm bg-blue-700 text-blue-100 px-3 py-1 rounded-full">{car.type}</span>
              </div>
            </div>

            <div className="relative h-48 rounded-xl overflow-hidden mb-6">
              {car.image ? (
                <Image
                  src={car.image}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-blue-700 flex items-center justify-center">
                  <CarIcon className="h-12 w-12 text-blue-300" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-blue-500">
                <span className="text-blue-200">Daily rate</span>
                <span className="font-semibold">${Number(car.pricePerDay).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Booking duration</span>
                <span className="font-semibold">{days} {days === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-200">Taxes & fees</span>
                <span className="font-semibold">${taxesAndFees.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-blue-500">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Booking form section */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Booking</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Pickup date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                <div className="flex">
                  <Popover open={pickupCalendarOpen} onOpenChange={setPickupCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={cn(
                          "flex-1 flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                          !startDate && "text-gray-400",
                          isSubmitting && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {startDate ? formatDisplayDate(startDate) : "Select date"}
                        </div>
                        <div className="text-xs text-gray-500">{isToday(startDate) ? "Today" : ""}</div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(date)
                            // If end date is before start date, update it
                            if (isBefore(endDate, date)) {
                              setEndDate(addDays(date, 1))
                            }
                          }
                          setPickupCalendarOpen(false)
                        }}
                        disabled={(date) => isBefore(date, today) && !isToday(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Pickup time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Time</label>
                <div className="relative">
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                        {hour.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Pickup location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label>
                <div className="relative">
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>New York City</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              {/* Return date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                <div className="flex">
                  <Popover open={returnCalendarOpen} onOpenChange={setReturnCalendarOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        className={cn(
                          "flex-1 flex items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500",
                          !endDate && "text-gray-400",
                          isSubmitting && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                          {endDate ? formatDisplayDate(endDate) : "Select date"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {days} {days === 1 ? 'day' : 'days'}
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date) setEndDate(date)
                          setReturnCalendarOpen(false)
                        }}
                        disabled={(date) => isBefore(date, startDate)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Return time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
                <div className="relative">
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                        {hour.toString().padStart(2, '0')}:00
                      </option>
                    ))}
                  </select>
                  <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Return location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Return Location</label>
                <div className="relative">
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Same as pick-up</option>
                    <option>New York City</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Submit button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </button>
              </div>

              {/* Terms note */}
              <p className="text-xs text-gray-500 text-center mt-2">
                By confirming this booking, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Cancellation Policy
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
