"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  ChevronDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Car,
  AlertCircle
} from "lucide-react"
import AdminHeader from "@/components/admin/header"
import { useAdminAuth } from "@/lib/admin-auth-context"

// Available car categories based on database types
const carCategories = ["Sedan", "SUV", "Sports", "Electric", "Luxury", "Economy", "Convertible", "Van"]

// Available car features
const carFeatures = [
  "AC",
  "GPS",
  "Bluetooth",
  "Leather Seats",
  "Sunroof",
  "Backup Camera",
  "Heated Seats",
  "Cruise Control",
  "Autopilot",
  "Sport Mode",
  "Child Seat",
  "WiFi",
]

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    available: {
      color: "bg-green-100 text-green-800",
      label: "Available",
    },
    booked: {
      color: "bg-blue-100 text-blue-800",
      label: "Booked",
    },
    maintenance: {
      color: "bg-yellow-100 text-yellow-800",
      label: "Maintenance",
    },
    unavailable: {
      color: "bg-red-100 text-red-800",
      label: "Unavailable",
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.available

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}

// Category badge component
const CategoryBadge = ({ category }: { category: string }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      {category}
    </span>
  )
}

// Interface for Car
interface Car {
  id: string
  make: string
  model: string
  name: string
  year: number
  category: string
  dailyRate: number
  status: string
  image: string
  description: string
  features: string[]
  addedDate: string
  bookingCount?: number
}

// Interface for Pagination
interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function CarManagement() {
  const { token } = useAdminAuth()
  
  // State for cars data
  const [cars, setCars] = useState<Car[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  
  // State for UI
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddEditModal, setShowAddEditModal] = useState(false)
  const [editingCar, setEditingCar] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [carToDelete, setCarToDelete] = useState<any>(null)
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortOption, setSortOption] = useState("newest")

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    category: "Sedan",
    dailyRate: 0,
    status: "available",
    description: "",
    color: "",
    transmission: "Automatic",
    fuelType: "Gasoline",
    seats: 5,
    features: [] as string[],
    image: "",
  })

  // Fetch cars from API
  const fetchCars = async () => {
    if (!token) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const url = new URL('/api/admin/cars', window.location.origin)
      
      // Add query parameters
      if (searchQuery) url.searchParams.append('search', searchQuery)
      if (statusFilter !== 'all') url.searchParams.append('status', statusFilter)
      if (categoryFilter !== 'all') url.searchParams.append('type', categoryFilter)
      url.searchParams.append('sortBy', sortOption)
      url.searchParams.append('page', currentPage.toString())
      url.searchParams.append('limit', itemsPerPage.toString())
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch cars')
      }
      
      const data = await response.json()
      setCars(data.cars)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching cars:', err)
      setError('Failed to load cars. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch cars when filters or pagination changes
  useEffect(() => {
    fetchCars()
  }, [token, searchQuery, statusFilter, categoryFilter, sortOption, currentPage, itemsPerPage])
  
  // Filter handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when filter changes
  }
  
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value)
    setCurrentPage(1)
  }
  
  const handleCategoryFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value)
    setCurrentPage(1)
  }
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value)
    setCurrentPage(1)
  }
  
  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  // Other handlers
  const handleAddNewCar = () => {
    setEditingCar(null)
    setShowAddEditModal(true)
  }

  const handleEditCar = (car: any) => {
    setEditingCar(car)
    setShowAddEditModal(true)
  }

  const handleDeleteCar = (car: any) => {
    setCarToDelete(car)
    setShowDeleteConfirm(true)
  }

  const handleViewDetails = (car: any) => {
    // Implement view details logic
    console.log("Viewing details for:", car.id)
  }

  // Update form data when editing car changes
  useEffect(() => {
    if (editingCar) {
      setFormData({
        id: editingCar.id,
        name: editingCar.name || `${editingCar.make} ${editingCar.model}`,
        make: editingCar.make,
        model: editingCar.model,
        year: editingCar.year,
        category: editingCar.category,
        dailyRate: editingCar.dailyRate,
        status: editingCar.status,
        description: editingCar.description || "",
        color: editingCar.features?.find((f: string) => !f.includes("Seats") && !["Automatic", "Manual", "Gasoline", "Diesel", "Electric", "Hybrid"].includes(f)) || "",
        transmission: editingCar.features?.find((f: string) => ["Automatic", "Manual"].includes(f)) || "Automatic",
        fuelType: editingCar.features?.find((f: string) => ["Gasoline", "Diesel", "Electric", "Hybrid"].includes(f)) || "Gasoline",
        seats: parseInt(editingCar.features?.find((f: string) => f.includes("Seats"))?.split(" ")[0] || "5"),
        features: editingCar.features || [],
        image: editingCar.image,
      })
    } else {
      // Reset form for new car
      setFormData({
        id: "",
        name: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        category: "Sedan",
        dailyRate: 0,
        status: "available",
        description: "",
        color: "",
        transmission: "Automatic",
        fuelType: "Gasoline",
        seats: 5,
        features: [],
        image: "",
      })
    }
  }, [editingCar])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle feature checkbox changes
  const handleFeatureChange = (feature: string) => {
    if (formData.features.includes(feature)) {
      setFormData({
        ...formData,
        features: formData.features.filter((f) => f !== feature),
      })
    } else {
      setFormData({
        ...formData,
        features: [...formData.features, feature],
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError("You must be logged in to add cars")
      return
    }
    
    // Validate form
    const errors: {[key: string]: string} = {}
    
    if (!formData.name.trim()) {
      errors.name = "Car name is required"
    }
    
    if (!formData.make.trim()) {
      errors.make = "Make/Brand is required"
    }
    
    if (!formData.model.trim()) {
      errors.model = "Model is required"
    }
    
    if (!formData.dailyRate || formData.dailyRate <= 0) {
      errors.dailyRate = "Daily rate must be greater than 0"
    }
    
    if (!formData.color.trim()) {
      errors.color = "Color is required"
    }
    
    // If we have errors, show them and stop submission
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    // Clear any previous errors
    setFormErrors({})
    setIsLoading(true)
    
    try {
      // Prepare data for API
      const carData = {
        name: formData.name.trim() || `${formData.make} ${formData.model}`,
        brand: formData.make.trim(),
        model: formData.model.trim(),
        year: formData.year,
        type: formData.category,
        pricePerDay: formData.dailyRate,
        color: formData.color.trim(),
        transmission: formData.transmission,
        fuelType: formData.fuelType,
        seats: formData.seats,
        status: formData.status,
        image: formData.image,
        description: formData.description.trim(),
      }
      
      // Submit to API
      const response = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(carData)
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save car')
      }
      
      // Close modal and refresh cars list
      setShowAddEditModal(false)
      fetchCars()
      
      // Show success message
      alert("Car added successfully!")
    } catch (err) {
      console.error('Error saving car:', err)
      alert(err instanceof Error ? err.message : "Failed to save car. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle image upload
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, this would upload the image to a server
      // For now, we'll just create a local URL
      const imageUrl = URL.createObjectURL(file)
      setFormData({
        ...formData,
        image: imageUrl,
      })
    }
  }
  
  // Handle direct image URL input
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      image: e.target.value
    })
  }

  // Display the error state
  if (error && !isLoading) {
    return (
      <>
        <AdminHeader title="Car Management" />
        <main className="flex-1 overflow-auto pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load cars</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => fetchCars()}
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

  // Continue with the rest of the component (UI for displaying cars and filters)
  // ... existing code ...

  return (
    <>
      <AdminHeader title="Car Management" />
      <main className="flex-1 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Search Box */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search cars..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={handleCategoryFilterChange}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    {carCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                {/* Sort Options */}
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="price-low">Price: Low to High</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Add New Car Button (Mobile: below filters) */}
              <div className="mt-4 md:hidden">
                <button
                  onClick={handleAddNewCar}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Car
                </button>
              </div>

              {/* View Mode Toggle and Add New Car (Desktop) */}
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {cars.length} {cars.length === 1 ? "car" : "cars"} found
                </div>
                <div className="flex items-center space-x-3">
                  {/* Add New Car Button (Desktop: next to view toggle) */}
                  <button
                    onClick={handleAddNewCar}
                    className="hidden md:inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Car
                  </button>
                  <div className="hidden md:flex items-center space-x-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md ${
                        viewMode === "list" ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <List className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md ${
                        viewMode === "grid" ? "bg-gray-200 text-gray-800" : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Loading cars...</h3>
              <p className="text-gray-500">Please wait while we fetch the car data.</p>
            </div>
          ) : cars.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 text-gray-500 mb-4">
                <Car className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                We couldn't find any cars matching your search criteria. Try adjusting your filters or add a new car.
              </p>
              <button
                onClick={handleAddNewCar}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Car
              </button>
            </div>
          ) : (
            // Car Listing
            <>
              {/* Grid View (Desktop) */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <div key={car.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={car.image || "/placeholder.svg"}
                          alt={`${car.make} ${car.model}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <StatusBadge status={car.status} />
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {car.make} {car.model}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {car.year} • {car.id}
                            </p>
                          </div>
                          <div className="text-lg font-bold text-gray-900">${car.dailyRate}/day</div>
                        </div>
                        <div className="mt-2 flex items-center">
                          <CategoryBadge category={car.category} />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-1">
                          {car.features.slice(0, 3).map((feature) => (
                            <span
                              key={feature}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {feature}
                            </span>
                          ))}
                          {car.features.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{car.features.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetails(car)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleEditCar(car)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car)}
                            className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-gray-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View (Mobile and Desktop) */}
              {viewMode === "list" && (
                <div className="space-y-4">
                  {cars.map((car) => (
                    <div key={car.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-48 sm:h-auto sm:w-48">
                          <Image
                            src={car.image || "/placeholder.svg"}
                            alt={`${car.make} ${car.model}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {car.make} {car.model}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {car.year} • {car.id}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <StatusBadge status={car.status} />
                              <div className="relative ml-2">
                                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                                  <MoreVertical className="h-5 w-5" />
                                </button>
                                {/* Dropdown menu would go here in a real implementation */}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center">
                            <CategoryBadge category={car.category} />
                            <div className="ml-4 text-lg font-bold text-gray-900">${car.dailyRate}/day</div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500 line-clamp-2">{car.description}</div>
                          <div className="mt-4 flex flex-wrap gap-1">
                            {car.features.slice(0, 4).map((feature) => (
                              <span
                                key={feature}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {feature}
                              </span>
                            ))}
                            {car.features.length > 4 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                +{car.features.length - 4} more
                              </span>
                            )}
                          </div>
                          <div className="mt-4 flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewDetails(car)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => handleEditCar(car)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-gray-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={handlePreviousPage}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{pagination.totalItems}</span> cars
                      </p>
                    </div>
                    <div>
                      <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                      >
                        <button
                          onClick={handlePreviousPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        {[...Array(pagination.totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
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
                          onClick={handleNextPage}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add/Edit Car Modal */}
      {showAddEditModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingCar ? "Edit Car" : "Add New Car"}
                    </h3>
                    <div className="mt-4">
                      <div className="text-sm text-gray-500 mb-3">Fields marked with <span className="text-red-500">*</span> are required</div>
                      <form id="carForm" onSubmit={handleSubmit}>
                        {/* Image Upload */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Car Image</label>
                          <div
                            onClick={handleImageClick}
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
                          >
                            {formData.image ? (
                              <div className="relative h-40 w-full">
                                <Image
                                  src={formData.image || "/placeholder.svg"}
                                  alt="Car preview"
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            ) : (
                              <div className="space-y-1 text-center">
                                <svg
                                  className="mx-auto h-12 w-12 text-gray-400"
                                  stroke="currentColor"
                                  fill="none"
                                  viewBox="0 0 48 48"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                                <div className="flex text-sm text-gray-600">
                                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      className="sr-only"
                                      accept="image/*"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                  <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Image URL input */}
                          <div className="mt-2">
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                              Or enter image URL
                            </label>
                            <input
                              type="text"
                              name="imageUrl"
                              id="imageUrl"
                              value={formData.image}
                              onChange={handleImageUrlChange}
                              placeholder="https://example.com/car-image.jpg"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Name */}
                          <div className="sm:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Car Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="e.g. Tesla Model 3 Premium"
                              className={`mt-1 block w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {formErrors.name && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                            )}
                          </div>
                        
                          {/* Make */}
                          <div>
                            <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                              Make/Brand <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="make"
                              id="make"
                              value={formData.make}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border ${formErrors.make ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {formErrors.make && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.make}</p>
                            )}
                          </div>

                          {/* Model */}
                          <div>
                            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                              Model <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="model"
                              id="model"
                              value={formData.model}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border ${formErrors.model ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {formErrors.model && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.model}</p>
                            )}
                          </div>

                          {/* Year */}
                          <div>
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                              Year
                            </label>
                            <select
                              id="year"
                              name="year"
                              value={formData.year}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              {[...Array(10)].map((_, i) => {
                                const year = new Date().getFullYear() - i
                                return (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                )
                              })}
                            </select>
                          </div>

                          {/* Category/Type */}
                          <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                              Category/Type
                            </label>
                            <select
                              id="category"
                              name="category"
                              value={formData.category}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              {carCategories.map((category) => (
                                <option key={category} value={category}>
                                  {category}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Color */}
                          <div>
                            <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                              Color <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="color"
                              id="color"
                              value={formData.color}
                              onChange={handleInputChange}
                              className={`mt-1 block w-full border ${formErrors.color ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {formErrors.color && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.color}</p>
                            )}
                          </div>

                          {/* Transmission */}
                          <div>
                            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
                              Transmission
                            </label>
                            <select
                              id="transmission"
                              name="transmission"
                              value={formData.transmission}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="Automatic">Automatic</option>
                              <option value="Manual">Manual</option>
                              <option value="Semi-Automatic">Semi-Automatic</option>
                            </select>
                          </div>

                          {/* Fuel Type */}
                          <div>
                            <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
                              Fuel Type
                            </label>
                            <select
                              id="fuelType"
                              name="fuelType"
                              value={formData.fuelType}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="Gasoline">Gasoline</option>
                              <option value="Diesel">Diesel</option>
                              <option value="Electric">Electric</option>
                              <option value="Hybrid">Hybrid</option>
                            </select>
                          </div>

                          {/* Seats */}
                          <div>
                            <label htmlFor="seats" className="block text-sm font-medium text-gray-700">
                              Seats
                            </label>
                            <select
                              id="seats"
                              name="seats"
                              value={formData.seats}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              {[2, 4, 5, 6, 7, 8, 9].map((seats) => (
                                <option key={seats} value={seats}>
                                  {seats}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Daily Rate */}
                          <div>
                            <label htmlFor="dailyRate" className="block text-sm font-medium text-gray-700">
                              Daily Rate ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="dailyRate"
                              id="dailyRate"
                              value={formData.dailyRate}
                              onChange={handleInputChange}
                              min="0"
                              className={`mt-1 block w-full border ${formErrors.dailyRate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                            />
                            {formErrors.dailyRate && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.dailyRate}</p>
                            )}
                          </div>

                          {/* Status */}
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              id="status"
                              name="status"
                              value={formData.status}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                              <option value="available">Available</option>
                              <option value="unavailable">Unavailable</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        {/* Additional Features */}
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Additional Features</label>
                          <div className="grid grid-cols-2 gap-2">
                            {carFeatures.map((feature) => (
                              <div key={feature} className="flex items-center">
                                <input
                                  id={`feature-${feature}`}
                                  name={`feature-${feature}`}
                                  type="checkbox"
                                  checked={formData.features.includes(feature)}
                                  onChange={() => handleFeatureChange(feature)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`feature-${feature}`} className="ml-2 block text-sm text-gray-700">
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  form="carForm"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" /> 
                      {editingCar ? "Saving..." : "Adding..."}
                    </>
                  ) : (
                    editingCar ? "Save Changes" : "Add Car"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  disabled={isLoading}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Car</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this car? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // In a real app, this would delete the car
                    console.log("Deleting car:", carToDelete.id)
                    setShowDeleteConfirm(false)
                  }}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
