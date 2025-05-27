"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Search,
  Calendar,
  ChevronDown,
  Sliders,
  Grid,
  List,
  X,
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
  Filter,
  Check,
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
    features: ["AC", "GPS", "Bluetooth", "Autopilot"],
    rating: 4.9,
    reviewCount: 124,
    brand: "Tesla",
    isPopular: true,
    isNew: true,
    year: 2023,
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
    features: ["AC", "GPS", "Bluetooth", "Sunroof", "Child Seat"],
    rating: 4.7,
    reviewCount: 98,
    brand: "BMW",
    isPopular: true,
    isNew: false,
    year: 2022,
  },
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
    isPopular: false,
    isNew: false,
    year: 2022,
  },
  {
    id: 4,
    name: "Toyota Camry",
    type: "Sedan",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2069&auto=format&fit=crop",
    price: 65,
    passengers: 5,
    luggage: 2,
    transmission: "Automatic",
    features: ["AC", "Bluetooth"],
    rating: 4.3,
    reviewCount: 112,
    brand: "Toyota",
    isPopular: true,
    isNew: false,
    year: 2021,
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
    isPopular: true,
    isNew: false,
    year: 2023,
  },
  {
    id: 6,
    name: "Honda CR-V",
    type: "SUV",
    image: "https://images.unsplash.com/photo-1568844293986-ca9e7bd13a3c?q=80&w=2070&auto=format&fit=crop",
    price: 79,
    passengers: 5,
    luggage: 3,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Child Seat"],
    rating: 4.4,
    reviewCount: 92,
    brand: "Honda",
    isPopular: false,
    isNew: true,
    year: 2022,
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
    isPopular: false,
    isNew: false,
    year: 2022,
  },
  {
    id: 8,
    name: "Toyota Sienna",
    type: "Van",
    image: "https://images.unsplash.com/photo-1609520778163-d16a28af3495?q=80&w=1934&auto=format&fit=crop",
    price: 109,
    passengers: 8,
    luggage: 4,
    transmission: "Automatic",
    features: ["AC", "GPS", "Bluetooth", "Child Seat"],
    rating: 4.5,
    reviewCount: 67,
    brand: "Toyota",
    isPopular: false,
    isNew: false,
    year: 2021,
  },
  {
    id: 9,
    name: "Ford Mustang",
    type: "Sports",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?q=80&w=2070&auto=format&fit=crop",
    price: 129,
    passengers: 4,
    luggage: 1,
    transmission: "Manual",
    features: ["AC", "Bluetooth", "Sunroof"],
    rating: 4.8,
    reviewCount: 103,
    brand: "Ford",
    isPopular: true,
    isNew: false,
    year: 2023,
  },
]

// Filter options data
const carTypes = ["Sedan", "SUV", "Luxury", "Economy", "Sports", "Van", "Electric"]
const carBrands = ["Toyota", "Honda", "BMW", "Mercedes", "Audi", "Ford", "Tesla", "Porsche"]
const passengerOptions = [2, 4, 5, 7, 8]
const features = ["AC", "GPS", "Bluetooth", "Child Seat", "Sunroof", "Autopilot"]
const transmissionTypes = ["Automatic", "Manual"]

// Feature icon mapping
const featureIcons: Record<string, any> = {
  AC: AirVent,
  GPS: MapPin,
  Bluetooth: Bluetooth,
  "Child Seat": Users,
  Sunroof: Sunrise,
  Autopilot: Gauge,
  WiFi: Wifi,
}

export default function CarsPage() {
  const router = useRouter()

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>([])
  const [selectedPassengers, setSelectedPassengers] = useState<number | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  // State for UI
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("recommended")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [filteredCars, setFilteredCars] = useState(carsData)

  // State for booking modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedCar, setSelectedCar] = useState<(typeof carsData)[0] | null>(null)

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = [...carsData]

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(query) ||
          car.type.toLowerCase().includes(query) ||
          car.brand.toLowerCase().includes(query),
      )
    }

    // Car type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((car) => selectedTypes.includes(car.type))
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((car) => selectedBrands.includes(car.brand))
    }

    // Transmission filter
    if (selectedTransmission.length > 0) {
      filtered = filtered.filter((car) => selectedTransmission.includes(car.transmission))
    }

    // Passenger filter
    if (selectedPassengers) {
      filtered = filtered.filter((car) => car.passengers >= selectedPassengers)
    }

    // Features filter
    if (selectedFeatures.length > 0) {
      filtered = filtered.filter((car) => selectedFeatures.every((feature) => car.features.includes(feature)))
    }

    // Price range filter
    filtered = filtered.filter((car) => {
      const price = car.discountedPrice || car.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price))
        break
      case "price-high":
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price))
        break
      case "newest":
        filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1))
        break
      case "popular":
        filtered.sort((a, b) => (a.isPopular === b.isPopular ? 0 : a.isPopular ? -1 : 1))
        break
      default:
        // Default sorting (recommended)
        filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredCars(filtered)
    setCurrentPage(1)
  }, [
    searchQuery,
    selectedTypes,
    selectedBrands,
    selectedTransmission,
    selectedPassengers,
    selectedFeatures,
    priceRange,
    sortOption,
  ])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setStartDate("")
    setEndDate("")
    setPriceRange([0, 300])
    setSelectedTypes([])
    setSelectedBrands([])
    setSelectedTransmission([])
    setSelectedPassengers(null)
    setSelectedFeatures([])
    setSortOption("recommended")
  }

  // Toggle filter for checkboxes
  const toggleFilter = (
    value: string,
    currentFilters: string[],
    setFilters: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter((item) => item !== value))
    } else {
      setFilters([...currentFilters, value])
    }
  }

  // Handle booking button click
  const handleBookNow = (car: (typeof carsData)[0]) => {
    setSelectedCar(car)
    setBookingModalOpen(true)
  }

  // Handle view details click
  const handleViewDetails = (carId: number) => {
    router.push(`/cars/${carId}`)
  }

  // Pagination
  const carsPerPage = 6
  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const currentCars = filteredCars.slice((currentPage - 1) * carsPerPage, currentPage * carsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Cars</h1>
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
                  <ChevronDown className="h-4 w-4" />
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
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <aside className={`md:w-1/4 lg:w-1/5 bg-white rounded-xl shadow-sm p-5 h-fit sticky top-24 hidden md:block`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center text-gray-900">
                <Sliders className="h-5 w-5 mr-2" />
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cars..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rental Period</label>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                  />
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
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
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Price Range</label>
                <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
              <div className="px-2">
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                />
              </div>
            </div>

            {/* Car Type */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Car Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {carTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        selectedTypes.includes(type) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                      } mr-2 transition-colors`}
                    >
                      {selectedTypes.includes(type) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Brand</h3>
              <div className="grid grid-cols-2 gap-2">
                {carBrands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        selectedBrands.includes(brand) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                      } mr-2 transition-colors`}
                    >
                      {selectedBrands.includes(brand) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Transmission</h3>
              <div className="flex space-x-4">
                {transmissionTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        selectedTransmission.includes(type) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                      } mr-2 transition-colors`}
                    >
                      {selectedTransmission.includes(type) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Passenger Capacity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Passenger Capacity</h3>
              <div className="grid grid-cols-3 gap-2">
                {passengerOptions.map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedPassengers(selectedPassengers === num ? null : num)}
                    className={`py-2 px-2 text-sm rounded-xl transition-colors ${
                      selectedPassengers === num
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {num}+ Seats
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <label key={feature} className="flex items-center">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border ${
                        selectedFeatures.includes(feature) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                      } mr-2 transition-colors`}
                    >
                      {selectedFeatures.includes(feature) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm text-gray-900">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => setFilterOpen(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-sm"
            >
              Apply Filters
            </button>
          </aside>

          {/* Mobile Filter Sidebar */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
              filterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setFilterOpen(false)}
          >
            <div
              className={`absolute right-0 top-0 h-full w-[85%] max-w-md bg-white transform transition-transform ${
                filterOpen ? "translate-x-0" : "translate-x-full"
              } overflow-y-auto rounded-l-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center text-gray-900">
                    <Sliders className="h-5 w-5 mr-2" />
                    Filters
                  </h2>
                  <div className="flex space-x-4">
                    <button onClick={resetFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                      Reset All
                    </button>
                    <button onClick={() => setFilterOpen(false)} className="text-gray-500">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Mobile filters - same as desktop but optimized for mobile */}
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cars..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                    />
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Date Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Period</label>
                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
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
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Price Range</label>
                    <span className="text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded-lg">
                      ${priceRange[0]} - ${priceRange[1]}
                    </span>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-2"
                    />
                  </div>
                </div>

                {/* Car Type */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Car Type</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {carTypes.map((type) => (
                      <label key={type} className="flex items-center">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selectedTypes.includes(type) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                          } mr-2 transition-colors`}
                        >
                          {selectedTypes.includes(type) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-900">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Brand</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {carBrands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded border ${
                            selectedBrands.includes(brand) ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                          } mr-2 transition-colors`}
                        >
                          {selectedBrands.includes(brand) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-sm text-gray-900">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors shadow-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 lg:w-4/5">
            {isLoading ? (
              /* Loading State */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCars.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any cars matching your search criteria. Try adjusting your filters or search query.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              /* Results Grid */
              <>
                <div
                  className={`grid ${
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                  } gap-6`}
                >
                  {currentCars.map((car) => (
                    <div
                      key={car.id}
                      className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md ${
                        viewMode === "list" ? "flex flex-col md:flex-row" : ""
                      }`}
                    >
                      <div className={`relative ${viewMode === "list" ? "md:w-2/5" : "h-48"}`}>
                        <Image src={car.image || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
                        {car.isNew && (
                          <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            NEW
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                          <div className="flex items-center">
                            <svg className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{car.rating}</span>
                          </div>
                          <span className="mx-1 text-gray-400">•</span>
                          <span className="text-gray-600">{car.reviewCount} reviews</span>
                        </div>
                      </div>
                      <div className={`p-5 ${viewMode === "list" ? "md:w-3/5" : ""}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{car.name}</h3>
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                              {car.type}
                            </span>
                          </div>
                          {car.discountedPrice ? (
                            <div className="text-right">
                              <span className="text-gray-500 line-through text-sm">${car.price}</span>
                              <div className="text-xl font-bold text-gray-900">
                                ${car.discountedPrice}
                                <span className="text-sm font-normal text-gray-600">/day</span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-xl font-bold text-gray-900">
                              ${car.price}
                              <span className="text-sm font-normal text-gray-600">/day</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 mb-4">
                          <div className="flex items-center text-gray-700 text-sm">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            {car.passengers} Passengers
                          </div>
                          <div className="flex items-center text-gray-700 text-sm">
                            <Briefcase className="h-4 w-4 mr-1 text-gray-500" />
                            {car.luggage} Luggage
                          </div>
                          <div className="flex items-center text-gray-700 text-sm">
                            <Gauge className="h-4 w-4 mr-1 text-gray-500" />
                            {car.transmission}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {car.features.slice(0, 4).map((feature) => {
                            const Icon = featureIcons[feature] || Sliders
                            return (
                              <div
                                key={feature}
                                className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
                              >
                                <Icon className="h-3 w-3 mr-1" />
                                {feature}
                              </div>
                            )
                          })}
                          {car.features.length > 4 && (
                            <div className="flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                              +{car.features.length - 4} more
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleViewDetails(car.id)}
                            className="flex-1 text-center py-2.5 px-4 border border-gray-200 rounded-xl text-gray-900 font-medium hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleBookNow(car)}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 rounded-xl font-medium transition-colors shadow-sm"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1
                        // Show first page, last page, current page, and pages around current
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setCurrentPage(pageNumber)}
                              className={`px-4 py-2 rounded-lg ${
                                currentPage === pageNumber
                                  ? "bg-blue-600 text-white shadow-sm"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          )
                        }

                        // Show ellipsis for skipped pages
                        if (
                          (pageNumber === 2 && currentPage > 3) ||
                          (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={pageNumber} className="px-4 py-2">
                              ...
                            </span>
                          )
                        }

                        return null
                      })}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                          currentPage === totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity ${
            bookingModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setBookingModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Book Your Car</h2>
                <button onClick={() => setBookingModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                  <Image
                    src={selectedCar.image || "/placeholder.svg"}
                    alt={selectedCar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900">{selectedCar.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCar.type} • {selectedCar.year}
                  </p>
                  <div className="text-lg font-bold text-gray-900 mt-1">
                    ${selectedCar.discountedPrice || selectedCar.price}
                    <span className="text-sm font-normal text-gray-600">/day</span>
                  </div>
                </div>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                    <div className="relative">
                      <input
                        type="date"
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900"
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Location</label>
                  <select className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white text-gray-900">
                    <option>New York City</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Location</label>
                  <select className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm appearance-none bg-white text-gray-900">
                    <option>Same as pick-up</option>
                    <option>New York City</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Daily rate:</span>
                    <span className="font-medium text-gray-900">
                      ${selectedCar.discountedPrice || selectedCar.price}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Number of days:</span>
                    <span className="font-medium text-gray-900">3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      ${(selectedCar.discountedPrice || selectedCar.price) * 3}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & fees:</span>
                    <span className="font-medium text-gray-900">
                      ${Math.round((selectedCar.discountedPrice || selectedCar.price) * 3 * 0.1)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total:</span>
                    <span className="font-bold text-gray-900">
                      ${Math.round((selectedCar.discountedPrice || selectedCar.price) * 3 * 1.1)}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium transition-colors shadow-sm"
                  >
                    Continue to Checkout
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
