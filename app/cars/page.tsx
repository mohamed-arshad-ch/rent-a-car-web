"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CarIcon,
  UsersIcon,
  FilterIcon,
  SlidersHorizontal,
  Loader2,
  ChevronDown,
  Check,
  MapPin,
  AirVent,
  Calendar,
  Search,
} from "lucide-react"

// Define Car type
type Car = {
  id: string;
  brand: string;
  model: string;
  type: string;
  year: number;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay: number;
  color: string;
  availability: boolean;
  image: string | null;
  description: string | null;
};

// Sample car data for fallback
const sampleCars: Car[] = [
  {
    id: "1",
    brand: "Tesla",
    model: "Model S",
    type: "Electric",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Electric",
    seats: 5,
    pricePerDay: 125,
    color: "White",
    availability: true,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
    description: "Luxury electric sedan with cutting-edge technology and impressive range."
  },
  {
    id: "2",
    brand: "BMW",
    model: "X5",
    type: "SUV",
    year: 2022,
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 7,
    pricePerDay: 180,
    color: "Black",
    availability: true,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&auto=format&fit=crop",
    description: "Premium SUV with spacious interior and advanced driver assistance features."
  },
  {
    id: "3",
    brand: "Porsche",
    model: "911",
    type: "Sports",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 2,
    pricePerDay: 250,
    color: "Red",
    availability: false,
    image: "https://images.unsplash.com/photo-1611821064430-0d40291922d1?w=800&auto=format&fit=crop",
    description: "Iconic sports car with exhilarating performance and timeless design."
  },
  {
    id: "4",
    brand: "Toyota",
    model: "Camry",
    type: "Sedan",
    year: 2022,
    transmission: "Automatic",
    fuelType: "Hybrid",
    seats: 5,
    pricePerDay: 80,
    color: "Silver",
    availability: true,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
    description: "Reliable sedan with excellent fuel economy and comfortable interior."
  },
  {
    id: "5",
    brand: "Range Rover",
    model: "Sport",
    type: "SUV",
    year: 2023,
    transmission: "Automatic",
    fuelType: "Diesel",
    seats: 5,
    pricePerDay: 200,
    color: "Green",
    availability: true,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop",
    description: "Luxury SUV with off-road capability and premium interior finishes."
  },
  {
    id: "6",
    brand: "Mercedes-Benz",
    model: "E-Class",
    type: "Sedan",
    year: 2022,
    transmission: "Automatic",
    fuelType: "Petrol",
    seats: 5,
    pricePerDay: 150,
    color: "Blue",
    availability: true,
    image: "https://images.unsplash.com/photo-1627454822466-0b05097c5210?w=800&auto=format&fit=crop",
    description: "Elegant luxury sedan with advanced technology and refined driving experience."
  }
];

// Car types and filter options
const carTypes = ["SUV", "Sedan", "Sports", "Electric", "Luxury"];
const transmissionTypes = ["Automatic", "Manual"];
const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
const seatOptions = [2, 4, 5, 7];
const priceRanges = [
  { label: "Under $50", value: "0-50" },
  { label: "$50 - $100", value: "50-100" },
  { label: "$100 - $200", value: "100-200" },
  { label: "Over $200", value: "200-1000" },
];

export default function CarsPage() {
  const router = useRouter()
  
  // State for data
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    transmission: "",
    fuelType: "",
    seats: "",
    priceRange: "",
  })
  
  // State for UI
  const [sortBy, setSortBy] = useState("featured")
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/cars')
        if (!res.ok) {
          throw new Error('Failed to fetch cars')
        }
        const data = await res.json()
        setCars(data.cars || sampleCars) // Use API data or fallback to sample data
      } catch (err) {
        console.error('Error fetching cars:', err)
        setError('Failed to load cars. Please try again later.')
        // Use sample data as fallback
        setCars(sampleCars)
      } finally {
        setLoading(false)
      }
    }
    
    fetchCars()
  }, [])
  
  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string) => {
    setFilters({
      ...filters,
      [filterName]: value,
    })
  }
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      transmission: "",
      fuelType: "",
      seats: "",
      priceRange: "",
    })
  }
  
  // Filter cars based on selected filters
  const filteredCars = cars.filter(car => {
    // Search filter
    if (filters.search && !car.brand.toLowerCase().includes(filters.search.toLowerCase()) &&
        !car.model.toLowerCase().includes(filters.search.toLowerCase()) &&
        !car.type.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    
    // Type filter
    if (filters.type && car.type !== filters.type) return false
    
    // Transmission filter
    if (filters.transmission && car.transmission !== filters.transmission) return false
    
    // Fuel type filter
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false
    
    // Seats filter
    if (filters.seats && car.seats !== parseInt(filters.seats)) return false
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      if (car.pricePerDay < min || car.pricePerDay > max) return false
    }
    
    return true
  })
  
  // Sort filtered cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.pricePerDay - b.pricePerDay
      case "price-high-low":
        return b.pricePerDay - a.pricePerDay
      case "newest":
        return b.year - a.year
      default:
        // Default "featured" sort - no specific sorting
        return 0
    }
  })
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-violet-600/90" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-white mb-4">Find Your Perfect Car</h1>
          <p className="text-white/90 max-w-lg">
            Browse our extensive collection of premium rental vehicles and find the perfect car for your journey.
          </p>
          
          {/* Search bar */}
          <div className="mt-6 max-w-2xl">
            <div className="relative flex rounded-full overflow-hidden shadow-lg">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search for brand, model, or type..."
                  className="w-full py-3 pl-4 pr-10 outline-none"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 flex items-center transition-colors">
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Panel */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <FilterIcon className="h-5 w-5 mr-2 text-indigo-600" />
                  Filters
                </h2>
                <button 
                  className="text-sm text-indigo-600 hover:text-indigo-800 md:hidden"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                >
                  {filtersOpen ? "Hide" : "Show"}
                </button>
              </div>
              
              <div className={`space-y-6 ${filtersOpen ? 'block' : 'hidden md:block'}`}>
                {/* Filter by Type */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Car Type</h3>
                  <div className="space-y-2">
                    {carTypes.map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="carType"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.type === type}
                          onChange={() => handleFilterChange("type", type)}
                        />
                        <span className="ml-2 text-gray-600">{type}</span>
                      </label>
                    ))}
                    {filters.type && (
                      <button 
                        className="text-sm text-indigo-600 mt-1 hover:underline"
                        onClick={() => handleFilterChange("type", "")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filter by Transmission */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Transmission</h3>
                  <div className="space-y-2">
                    {transmissionTypes.map((transmission) => (
                      <label key={transmission} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="transmission"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.transmission === transmission}
                          onChange={() => handleFilterChange("transmission", transmission)}
                        />
                        <span className="ml-2 text-gray-600">{transmission}</span>
                      </label>
                    ))}
                    {filters.transmission && (
                      <button 
                        className="text-sm text-indigo-600 mt-1 hover:underline"
                        onClick={() => handleFilterChange("transmission", "")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filter by Fuel Type */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Fuel Type</h3>
                  <div className="space-y-2">
                    {fuelTypes.map((fuel) => (
                      <label key={fuel} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="fuelType"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.fuelType === fuel}
                          onChange={() => handleFilterChange("fuelType", fuel)}
                        />
                        <span className="ml-2 text-gray-600">{fuel}</span>
                      </label>
                    ))}
                    {filters.fuelType && (
                      <button 
                        className="text-sm text-indigo-600 mt-1 hover:underline"
                        onClick={() => handleFilterChange("fuelType", "")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filter by Seats */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Seats</h3>
                  <div className="space-y-2">
                    {seatOptions.map((seats) => (
                      <label key={seats} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="seats"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.seats === seats.toString()}
                          onChange={() => handleFilterChange("seats", seats.toString())}
                        />
                        <span className="ml-2 text-gray-600">{seats} Seats</span>
                      </label>
                    ))}
                    {filters.seats && (
                      <button 
                        className="text-sm text-indigo-600 mt-1 hover:underline"
                        onClick={() => handleFilterChange("seats", "")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Filter by Price Range */}
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <label key={range.value} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="priceRange"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                          checked={filters.priceRange === range.value}
                          onChange={() => handleFilterChange("priceRange", range.value)}
                        />
                        <span className="ml-2 text-gray-600">{range.label}</span>
                      </label>
                    ))}
                    {filters.priceRange && (
                      <button 
                        className="text-sm text-indigo-600 mt-1 hover:underline"
                        onClick={() => handleFilterChange("priceRange", "")}
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Reset All Filters */}
                {(filters.type || filters.transmission || filters.fuelType || filters.seats || filters.priceRange || filters.search) && (
                  <button
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors mt-4"
                    onClick={resetFilters}
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Car Listings */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
              <div className="mb-3 sm:mb-0">
                <p className="text-gray-600">
                  Showing <span className="font-medium text-gray-900">{sortedCars.length}</span> cars
                </p>
              </div>
              
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                  <select
                    className="appearance-none bg-transparent pr-8 focus:outline-none text-gray-700"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest">Newest Models</option>
                  </select>
                  <ChevronDown className="h-4 w-4 text-gray-500 absolute right-0 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                <span className="ml-2 text-gray-600">Loading cars...</span>
              </div>
            )}
            
            {/* Error state */}
            {error && !loading && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
                <p>{error}</p>
              </div>
            )}
            
            {/* Empty state */}
            {!loading && !error && sortedCars.length === 0 && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <CarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                <p className="text-gray-600 mb-4">
                  No cars match your current filter criteria. Try adjusting your filters to see more results.
                </p>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  onClick={resetFilters}
                >
                  Reset All Filters
                </button>
              </div>
            )}
            
            {/* Car grid */}
            {!loading && sortedCars.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedCars.map((car) => (
                  <div key={car.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                    <div className="relative h-56 overflow-hidden">
                      {car.image ? (
                        <Image
                          src={car.image}
                          alt={`${car.brand} ${car.model}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <CarIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-1 m-3 rounded-full text-sm font-medium shadow-lg">
                        ${Number(car.pricePerDay).toFixed(0)}/day
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h3>
                        {car.availability ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 flex items-center flex-wrap gap-2">
                        <span className="inline-block bg-indigo-50 text-indigo-700 rounded-full px-2 py-1 text-xs font-medium">{car.year}</span>
                        <span className="inline-block bg-indigo-50 text-indigo-700 rounded-full px-2 py-1 text-xs font-medium">{car.transmission}</span>
                        <span className="inline-block bg-indigo-50 text-indigo-700 rounded-full px-2 py-1 text-xs font-medium">{car.fuelType}</span>
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">{car.seats} Seats</span>
                        </div>
                        <div className="flex items-center">
                          <CarIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">{car.type}</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/cars/${car.id}`} 
                        className={`block w-full text-center py-3 rounded-xl transition-all font-medium ${
                          car.availability 
                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white' 
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {car.availability ? 'View Details' : 'Not Available'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
