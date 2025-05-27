"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, Grid, List, Loader2 } from "lucide-react"
import CarCard from "@/components/car-card"
import BookingModal from "@/components/booking-modal"

// Define Car type based on your Prisma schema
type Car = {
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

export default function CarsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("recommended")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)
  const [cars, setCars] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/cars');
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }
        const data = await response.json();
        setCars(data.cars);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

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

  // Handle booking button click
  const handleBookNow = (car: Car) => {
    setSelectedCar(car)
    setBookingModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Available Cars</h1>
          <p className="text-gray-500 mt-1">{filteredCars.length} vehicles available for rent</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative inline-block w-full md:w-auto">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-900"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="md:hidden flex items-center space-x-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl shadow-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cars by name, type, or brand..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">Loading cars...</p>
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load cars</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Car Grid */}
      {!isLoading && !error && (
        <div
          className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
        >
          {filteredCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              viewMode={viewMode}
              onBookNow={() => handleBookNow(car)}
              onViewDetails={() => router.push(`/dashboard/cars/${car.id}`)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredCars.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any cars matching your search criteria. Try adjusting your search query.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal isOpen={bookingModalOpen} onClose={() => setBookingModalOpen(false)} car={selectedCar} />
    </div>
  )
}
