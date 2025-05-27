"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Gauge,
  AirVent,
  MapPin,
  Bluetooth,
  Wifi,
  Sunrise,
  Star,
  Car,
  Fuel,
  Shield,
  Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import BookingModal from "@/components/booking-modal"

// Feature icon mapping
const featureIcons: Record<string, any> = {
  AC: AirVent,
  GPS: MapPin,
  Bluetooth: Bluetooth,
  "Child Seat": Users,
  Sunroof: Sunrise,
  Autopilot: Gauge,
  WiFi: Wifi,
  "Heated Seats": Sunrise,
  "Parking Sensors": Car,
  "Leather Seats": Briefcase,
}

// Define Car type
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
  image: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const carId = params.id as string
  const { user, token } = useAuth()

  // States
  const [car, setCar] = useState<Car | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const [bookingModalOpen, setBookingModalOpen] = useState(false)

  // Mock gallery for demo purposes - in production this would come from the database
  const carGallery = car?.image 
    ? [car.image, car.image, car.image] 
    : ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

  // Mock specifications data
  const specifications = {
    make: car?.brand || '',
    model: car?.model || '',
    year: car?.year || 0,
    color: car?.color || '',
    doors: "4",
    seats: car?.seats || 0,
    fuelType: car?.fuelType || '',
    transmission: car?.transmission || '',
    engine: "2.0L",
    horsepower: "180",
    torque: "280 Nm",
    driveType: "FWD"
  }

  // Mock features and reviews data
  const features = ["AC", "GPS", "Bluetooth", "Sunroof", "Heated Seats", "Parking Sensors"]
  const reviews = [
    {
      id: 1,
      name: "John Smith",
      date: "June 10, 2023",
      rating: 5,
      comment: "Amazing car! Very clean and drove perfectly. Would definitely rent again."
    },
    {
      id: 2,
      name: "Emma Wilson",
      date: "May 22, 2023",
      rating: 4,
      comment: "Great experience overall. Car was in good condition. Pickup process was a bit slow."
    }
  ]

  // Fetch car data when component mounts
  useEffect(() => {
    const fetchCarDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/cars/${carId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch car details')
        }
        const data = await response.json()
        setCar(data.car)
      } catch (err) {
        console.error('Error fetching car details:', err)
        setError('Failed to load car details. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    if (carId) {
      fetchCarDetails()
    }
  }, [carId])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading car details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Car</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/dashboard/cars"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </div>
      </div>
    )
  }

  // If car not found
  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/dashboard/cars"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="bg-white rounded-xl shadow-sm p-3">
        <div className="flex items-center text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors flex items-center">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/dashboard/cars" className="hover:text-blue-600 transition-colors">
            Cars
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">{car.brand} {car.model}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car Images and Details */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
              <Image
                src={carGallery[selectedImage]}
                alt={`${car.brand} ${car.model}`}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation arrows - only show if more than one image */}
              {carGallery.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((selectedImage - 1 + carGallery.length) % carGallery.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-sm hover:bg-opacity-100 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((selectedImage + 1) % carGallery.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-sm hover:bg-opacity-100 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Availability badge */}
              <div className={`absolute top-4 left-4 ${car.availability ? 'bg-green-500' : 'bg-red-500'} text-white text-sm font-medium px-3 py-1 rounded-lg`}>
                {car.availability ? 'Available Now' : 'Currently Unavailable'}
              </div>
            </div>

            {/* Thumbnails - only show if more than one image */}
            {carGallery.length > 1 && (
              <div className="flex p-4 space-x-2 overflow-x-auto">
                {carGallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${car.brand} ${car.model} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Car Title and Specs */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{car.brand} {car.model}</h1>
                <div className="flex items-center mt-2">
                  <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full mr-2">{car.type}</span>
                  <span className="text-sm text-gray-500">{car.year} Model</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="text-3xl font-bold text-gray-900">
                  ${Number(car.pricePerDay).toFixed(2)}
                  <span className="text-sm font-normal text-gray-600">/day</span>
                </div>
              </div>
            </div>

            {/* Key Specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Car className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs text-gray-500">Type</span>
                <span className="block text-sm font-medium text-gray-900">{car.type}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Gauge className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs text-gray-500">Transmission</span>
                <span className="block text-sm font-medium text-gray-900">{car.transmission}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Fuel className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs text-gray-500">Fuel Type</span>
                <span className="block text-sm font-medium text-gray-900">{car.fuelType}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Users className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs text-gray-500">Passengers</span>
                <span className="block text-sm font-medium text-gray-900">{car.seats}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Briefcase className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs text-gray-500">Color</span>
                <span className="block text-sm font-medium text-gray-900">{car.color}</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                <span className="block text-xs text-gray-500">Year</span>
                <span className="block text-sm font-medium text-gray-900">{car.year}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {features.map((feature) => {
                  const Icon = featureIcons[feature] || Car
                  return (
                    <div key={feature} className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm text-gray-900">{feature}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Book Now Button (Mobile Only) */}
            <div className="lg:hidden">
              <button
                onClick={() => setBookingModalOpen(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
                disabled={!car.availability}
              >
                {car.availability ? 'Book This Car' : 'Currently Unavailable'}
              </button>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "description"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "specifications"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({reviews.length})
              </button>
              <button
                onClick={() => setActiveTab("policies")}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === "policies"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Policies
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-900 leading-relaxed">
                    {car.description || `Experience the thrill of driving the ${car.brand} ${car.model}. This ${car.color} ${car.year} model offers a comfortable ride with its ${car.transmission} transmission and seats up to ${car.seats} passengers. Perfect for both city commutes and longer journeys.`}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="space-y-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                      <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                              fill={i < review.rating ? "currentColor" : "none"}
                            />
                          ))}
                        </div>
                        <p className="text-gray-900 text-sm">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No reviews yet for this car.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "policies" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Rental Requirements</h3>
                    <ul className="list-disc pl-5 text-sm text-gray-900 space-y-1">
                      <li>Valid driver's license</li>
                      <li>Minimum age of 25 years</li>
                      <li>Credit card in the driver's name</li>
                      <li>Proof of insurance</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Mileage Policy</h3>
                    <p className="text-sm text-gray-900">
                      Unlimited mileage included. Additional miles will be charged at $0.25 per mile.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Fuel Policy</h3>
                    <p className="text-sm text-gray-900">
                      The vehicle will be provided with a full tank of fuel and should be returned with a full tank. If
                      not returned with a full tank, a refueling fee will apply.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Cancellation Policy</h3>
                    <p className="text-sm text-gray-900">
                      Free cancellation up to 48 hours before pickup. Cancellations within 48 hours of pickup are
                      subject to a fee equal to one day's rental.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Book This Car</h2>
            
            <div className="bg-gray-50 p-4 rounded-xl space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Daily rate:</span>
                <span className="font-medium text-gray-900">${car ? Number(car.pricePerDay).toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Availability:</span>
                <span className={`${car?.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs px-2 py-1 rounded-full font-medium`}>
                  {car?.availability ? 'Available Now' : 'Currently Unavailable'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-medium text-blue-900 mb-2">Rental Includes:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                    Free cancellation up to 48 hours
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                    Unlimited mileage
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                    Insurance included
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></div>
                    24/7 roadside assistance
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingModalOpen(true)}
                className={`w-full ${
                  car?.availability 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-gray-400 cursor-not-allowed'
                } text-white py-3 rounded-xl font-medium transition-colors shadow-sm`}
                disabled={!car?.availability}
              >
                {car?.availability ? 'Book This Car' : 'Currently Unavailable'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {car && (
        <BookingModal 
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          car={car}
        />
      )}
    </div>
  )
}
