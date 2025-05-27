"use client"

import Image from "next/image"
import { Star, Car as CarIcon } from "lucide-react"

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

interface CarCardProps {
  car: Car
  viewMode: "grid" | "list"
  onBookNow: (car: Car) => void
  onViewDetails?: () => void
}

export default function CarCard({ car, viewMode, onBookNow, onViewDetails }: CarCardProps) {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow ${
        viewMode === "list" ? "flex flex-col md:flex-row" : ""
      }`}
    >
      <div className={`relative ${viewMode === "list" ? "h-48 md:h-auto md:w-1/3" : "h-48"} overflow-hidden`}>
        {car.image ? (
          <Image src={car.image} alt={`${car.brand} ${car.model}`} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        {car.availability && (
          <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded">AVAILABLE</div>
        )}
      </div>
      <div className={`p-4 ${viewMode === "list" ? "md:w-2/3" : ""}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-gray-900">{car.brand} {car.model}</h3>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500">
                {car.type} • {car.year}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-gray-900">${Number(car.pricePerDay).toFixed(2)}/day</div>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{car.seats} Seats</div>
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{car.fuelType}</div>
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{car.transmission}</div>
          <div className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{car.color}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={onViewDetails}
            className="flex-1 border border-gray-200 text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onBookNow(car)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}
