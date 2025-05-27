"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
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
  Home,
  Star,
  Check,
  X,
  Plus,
  Minus,
  Car,
  Fuel,
  Shield,
} from "lucide-react"

// Sample car data
const carsData = [
  {
    id: 1,
    name: "Tesla Model 3",
    type: "Electric",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop",
    price: 89,
    discountedPrice: 75,
    passengers: 5,
    luggage: 2,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Autopilot", "Heated Seats", "Parking Sensors", "WiFi"],
    rating: 4.9,
    reviewCount: 124,
    brand: "Tesla",
    isPopular: true,
    isNew: true,
    year: 2023,
    fuelType: "Electric",
    mileage: "Unlimited",
    description:
      "Experience the future of driving with the Tesla Model 3. This all-electric sedan combines cutting-edge technology with sleek design and impressive performance. With a range of over 350 miles on a single charge, you'll enjoy effortless travel without the need for gas stations. The minimalist interior features a 15-inch touchscreen that controls nearly all of the car's functions, while the panoramic glass roof provides an open, airy feel. Autopilot capabilities make highway driving a breeze, and the instant torque delivers exhilarating acceleration whenever you need it.",
    specifications: {
      engine: "Dual Motor All-Wheel Drive",
      power: "346 hp",
      acceleration: "0-60 mph in 4.2 seconds",
      range: "358 miles",
      topSpeed: "145 mph",
      charging: "Supercharging available",
    },
    gallery: [
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1561729955-89a6a6d8a397?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617704548623-340376564e68?q=80&w=1770&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1619767886558-efdc7e9e5fa4?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620891549027-942faa8b8b1a?q=80&w=1974&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: 1,
        name: "Michael Johnson",
        rating: 5,
        date: "October 15, 2023",
        comment:
          "Amazing car! The autopilot feature made highway driving so much easier during our road trip. Charging was convenient with the Tesla network.",
      },
      {
        id: 2,
        name: "Sarah Williams",
        rating: 5,
        date: "September 3, 2023",
        comment:
          "Rented the Model 3 for a weekend getaway and was blown away by the performance. The acceleration is incredible and the tech features are intuitive.",
      },
      {
        id: 3,
        name: "David Chen",
        rating: 4,
        date: "August 22, 2023",
        comment:
          "Great car overall. The only minor issue was that the range was slightly less than advertised when driving at highway speeds, but still more than enough for our trip.",
      },
    ],
  },
  {
    id: 2,
    name: "BMW X5",
    type: "SUV",
    image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=2070&auto=format&fit=crop",
    price: 129,
    passengers: 7,
    luggage: 3,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Sunroof", "Child Seat", "Leather Seats", "Parking Sensors"],
    rating: 4.7,
    reviewCount: 98,
    brand: "BMW",
    isPopular: true,
    isNew: false,
    year: 2022,
    fuelType: "Gasoline",
    mileage: "150 miles/day",
    description:
      "The BMW X5 combines luxury, performance, and versatility in a premium SUV package. With its powerful engine and refined handling, it delivers a driving experience that's both engaging and comfortable. The spacious interior features high-quality materials throughout, with seating for up to seven passengers and ample cargo space. Advanced technology includes a user-friendly infotainment system, digital instrument cluster, and a comprehensive suite of driver assistance features. Whether you're navigating city streets or venturing off the beaten path, the X5 offers the perfect blend of capability and sophistication.",
    specifications: {
      engine: "3.0L TwinPower Turbo inline 6-cylinder",
      power: "335 hp",
      acceleration: "0-60 mph in 5.3 seconds",
      fuelEconomy: "21 mpg city / 26 mpg highway",
      driveType: "All-Wheel Drive",
      towing: "Up to 7,200 lbs",
    },
    gallery: [
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549925862-990918131467?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1974&auto=format&fit=crop",
    ],
    reviews: [
      {
        id: 1,
        name: "Jennifer Lopez",
        rating: 5,
        date: "November 10, 2023",
        comment:
          "Luxurious SUV with plenty of space for our family vacation. The kids loved the panoramic sunroof and the entertainment system kept them occupied during long drives.",
      },
      {
        id: 2,
        name: "Robert Smith",
        rating: 4,
        date: "October 5, 2023",
        comment:
          "Smooth ride and powerful engine. The only drawback was the fuel consumption, but that's expected with a vehicle of this size and performance level.",
      },
    ],
  },
]

// Similar cars
const similarCars = [
  {
    id: 3,
    name: "Mercedes C-Class",
    type: "Sedan",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2070&auto=format&fit=crop",
    price: 99,
    passengers: 5,
    luggage: 2,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Sunroof"],
    rating: 4.5,
    reviewCount: 87,
    brand: "Mercedes",
    year: 2022,
  },
  {
    id: 5,
    name: "Porsche 911",
    type: "Sports",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
    price: 199,
    passengers: 2,
    luggage: 1,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Sunroof"],
    rating: 4.9,
    reviewCount: 76,
    brand: "Porsche",
    year: 2023,
  },
  {
    id: 7,
    name: "Audi A4",
    type: "Sedan",
    image: "https://images.unsplash.com/photo-1606664608504-48fddb9e190b?q=80&w=2070&auto=format&fit=crop",
    price: 89,
    passengers: 5,
    luggage: 2,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Sunroof"],
    rating: 4.6,
    reviewCount: 84,
    brand: "Audi",
    year: 2022,
  },
]

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

export default function CarDetailPage() {
  const params = useParams()
  const router = useRouter()
  const carId = Number(params.id)

  // Find the car by ID
  const car = carsData.find((c) => c.id === carId)

  // State for UI
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [days, setDays] = useState(3)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [pickupLocation, setPickupLocation] = useState("New York City")
  const [returnLocation, setReturnLocation] = useState("Same as pick-up")

  // Handle days change
  const incrementDays = () => setDays(days + 1)
  const decrementDays = () => setDays(Math.max(1, days - 1))

  // Calculate prices
  const basePrice = car ? car.discountedPrice || car.price : 0
  const subtotal = basePrice * days
  const taxesAndFees = Math.round(subtotal * 0.1)
  const total = subtotal + taxesAndFees

  // If car not found
  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/cars"
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/cars" className="hover:text-blue-600 transition-colors">
              Cars
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">{car.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="relative h-[300px] sm:h-[400px] md:h-[500px]">
                <Image
                  src={car.gallery[selectedImage] || "/placeholder.svg"}
                  alt={car.name}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Navigation arrows */}
                <button
                  onClick={() => setSelectedImage((selectedImage - 1 + car.gallery.length) % car.gallery.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-sm hover:bg-opacity-100 transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((selectedImage + 1) % car.gallery.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-2 shadow-sm hover:bg-opacity-100 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Availability badge */}
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-medium px-3 py-1 rounded-lg">
                  Available Now
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex p-4 space-x-2 overflow-x-auto">
                {car.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${car.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Car Title and Specs */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
                  <div className="flex items-center mt-2">
                    <span className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full mr-2">{car.type}</span>
                    <span className="text-sm text-gray-500">{car.year} Model</span>
                    <div className="flex items-center ml-4">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{car.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({car.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  {car.discountedPrice ? (
                    <div className="text-right">
                      <span className="text-gray-500 line-through text-sm">${car.price}</span>
                      <div className="text-3xl font-bold text-gray-900">
                        ${car.discountedPrice}
                        <span className="text-sm font-normal text-gray-600">/day</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-gray-900">
                      ${car.price}
                      <span className="text-sm font-normal text-gray-600">/day</span>
                    </div>
                  )}
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
                  <span className="block text-sm font-medium text-gray-900">{car.passengers}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Briefcase className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <span className="block text-xs text-gray-500">Luggage</span>
                  <span className="block text-sm font-medium text-gray-900">{car.luggage}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                  <span className="block text-xs text-gray-500">Mileage</span>
                  <span className="block text-sm font-medium text-gray-900">{car.mileage}</span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Features</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {car.features.map((feature) => {
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
                >
                  Book This Car
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
                  Reviews ({car.reviews.length})
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
                    <p className="text-gray-900 leading-relaxed">{car.description}</p>
                  </div>
                )}

                {activeTab === "specifications" && (
                  <div className="space-y-4">
                    {Object.entries(car.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                        <span className="font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {car.reviews.map((review) => (
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
                    ))}
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
                        {car.mileage}. Additional miles will be charged at $0.25 per mile.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Fuel Policy</h3>
                      <p className="text-sm text-gray-900">
                        The vehicle will be provided with a full tank of fuel and should be returned with a full tank.
                        If not returned with a full tank, a refueling fee will apply.
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

            {/* Similar Cars */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Cars You Might Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {similarCars.map((similarCar) => (
                  <div
                    key={similarCar.id}
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="relative h-36">
                      <Image
                        src={similarCar.image || "/placeholder.svg"}
                        alt={similarCar.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900">{similarCar.name}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-500">
                          {similarCar.type} • {similarCar.year}
                        </span>
                        <span className="font-bold text-gray-900">${similarCar.price}/day</span>
                      </div>
                      <button
                        onClick={() => router.push(`/cars/${similarCar.id}`)}
                        className="w-full mt-3 text-center py-2 border border-gray-200 rounded-lg text-gray-900 text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book This Car</h2>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                    />
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={decrementDays}
                      className="h-10 w-10 rounded-l-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, Number.parseInt(e.target.value) || 1))}
                      className="h-10 w-full border-t border-b border-gray-200 text-center focus:outline-none focus:ring-0 focus:border-gray-200 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={incrementDays}
                      className="h-10 w-10 rounded-r-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white text-gray-900"
                  >
                    <option>New York City</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Location</label>
                  <select
                    value={returnLocation}
                    onChange={(e) => setReturnLocation(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white text-gray-900"
                  >
                    <option>Same as pick-up</option>
                    <option>New York City</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2 mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily rate:</span>
                    <span className="font-medium text-gray-900">${basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number of days:</span>
                    <span className="font-medium text-gray-900">{days}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees:</span>
                    <span className="font-medium text-gray-900">${taxesAndFees}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">${total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity ${
          bookingModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setBookingModalOpen(false)}
      >
        <div
          className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-gray-900">Complete Your Booking</h2>
              <button onClick={() => setBookingModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-6">
              <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                <Image src={car.image || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
              </div>
              <div className="ml-4">
                <h3 className="font-bold text-gray-900">{car.name}</h3>
                <p className="text-sm text-gray-600">
                  {car.type} • {car.year}
                </p>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  ${basePrice}
                  <span className="text-sm font-normal text-gray-600">/day</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-gray-900 mb-3">Booking Summary</h3>
              <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pick-up:</span>
                  <span className="font-medium text-gray-900">
                    {startDate || "Not selected"} • {pickupLocation}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Return:</span>
                  <span className="font-medium text-gray-900">
                    {endDate || "Not selected"} •{" "}
                    {returnLocation === "Same as pick-up" ? pickupLocation : returnLocation}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{days} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium text-gray-900">${total}</span>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <h3 className="font-bold text-gray-900 mb-3">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                  />
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-3">Additional Options</h3>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border mr-3 transition-colors border-gray-300 bg-white`}
                    >
                      <Check className="h-3 w-3 text-white opacity-0" />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-900">Insurance Coverage</span>
                      <span className="block text-sm text-gray-500">Full coverage with $0 deductible</span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">$15/day</span>
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border mr-3 transition-colors border-gray-300 bg-white`}
                    >
                      <Check className="h-3 w-3 text-white opacity-0" />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-900">GPS Navigation</span>
                      <span className="block text-sm text-gray-500">Built-in GPS system</span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">$5/day</span>
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border mr-3 transition-colors border-gray-300 bg-white`}
                    >
                      <Check className="h-3 w-3 text-white opacity-0" />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-900">Child Seat</span>
                      <span className="block text-sm text-gray-500">Safety-approved child seat</span>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">$8/day</span>
                </label>
              </div>

              <h3 className="font-bold text-gray-900 mb-3">Payment Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center mt-4">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border mr-3 transition-colors border-gray-300 bg-white`}
                >
                  <Check className="h-3 w-3 text-white opacity-0" />
                </div>
                <span className="text-sm text-gray-900">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </div>

              <button
                type="button"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm mt-6"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
