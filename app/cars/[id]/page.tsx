"use client"

import { useState, useEffect } from "react"
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
  CheckCircle2,
  PaletteIcon,
  CarIcon,
  UsersIcon,
  CalendarIcon,
  GaugeIcon,
  StarIcon
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

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
  pricePerDay: number | any; // Using any to handle Prisma Decimal
  color: string;
  availability: boolean;
  image: string | null;
  description: string | null;
};

// Fetch car by ID
async function getCarById(id: string): Promise<Car | null> {
  try {
    const car = await prisma.car.findUnique({
      where: { id }
    });
    return car;
  } catch (error) {
    console.error("Error fetching car:", error);
    // Return null to handle error in component
    return null;
  }
}

// Mock features (would normally come from database)
const carFeatures = [
  "Air Conditioning",
  "Bluetooth",
  "Backup Camera",
  "GPS Navigation",
  "USB Port",
  "Sunroof",
  "Keyless Entry",
  "Cruise Control"
];

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
  const params = useParams();
  const router = useRouter();
  const carId = params.id as string;
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch car data
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cars/${carId}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Car not found');
          }
          throw new Error('Failed to fetch car details');
        }
        const data = await res.json();
        setCar(data.car);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details. Please try again later.');
        // Use mock data as fallback
        setCar(getMockCar(carId));
      } finally {
        setLoading(false);
      }
    };
    
    fetchCar();
  }, [carId]);
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  // Error state
  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/cars"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }
  
  // Car exists, render detail page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Car Hero Section */}
      <div className="relative h-[400px] sm:h-[500px]">
        {car.image ? (
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
            <CarIcon className="h-24 w-24 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {car.brand} {car.model}
                </h1>
                <div className="flex items-center text-white/90 mb-2">
                  <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm mr-2">
                    {car.type}
                  </span>
                  <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm mr-2">
                    {car.year}
                  </span>
                  <div className="flex items-center ml-2">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm ml-1">5.0</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-white text-lg sm:text-right">
                  <span className="text-white/70">Price</span>
                  <div className="text-2xl sm:text-3xl font-bold">${Number(car.pricePerDay).toFixed(0)}<span className="text-lg font-normal">/day</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 -mt-10 relative z-10 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
              <UsersIcon className="h-8 w-8 text-indigo-600 mr-4" />
              <div>
                <div className="text-gray-500 text-sm">Seats</div>
                <div className="text-gray-900 font-medium">{car.seats} People</div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
              <Fuel className="h-8 w-8 text-indigo-600 mr-4" />
              <div>
                <div className="text-gray-500 text-sm">Fuel Type</div>
                <div className="text-gray-900 font-medium">{car.fuelType}</div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-indigo-50 rounded-xl">
              <GaugeIcon className="h-8 w-8 text-indigo-600 mr-4" />
              <div>
                <div className="text-gray-500 text-sm">Transmission</div>
                <div className="text-gray-900 font-medium">{car.transmission}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {car.description || `Experience the luxury and performance of the ${car.brand} ${car.model}. This ${car.year} model comes with a responsive ${car.transmission} transmission and comfortable seating for ${car.seats} passengers. Perfect for both city driving and long road trips.`}
              </p>
              
              {/* Car Specifications */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                  <div className="flex items-center">
                    <CarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">Model: {car.model}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">Year: {car.year}</span>
                  </div>
                  <div className="flex items-center">
                    <PaletteIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">Color: {car.color}</span>
                  </div>
                  <div className="flex items-center">
                    <UsersIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">Seats: {car.seats}</span>
                  </div>
                  <div className="flex items-center">
                    <GaugeIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">Transmission: {car.transmission}</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-700">Fuel: {car.fuelType}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {carFeatures.map((feature) => (
                  <div key={feature} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Location */}
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pick-up Location</h2>
              <div className="flex items-start mb-4">
                <MapPin className="h-5 w-5 text-indigo-600 mr-2 mt-0.5" />
                <div>
                  <p className="text-gray-700">123 Main Street, New York, NY 10001</p>
                  <p className="text-gray-500 text-sm mt-1">Available for pick-up between 9:00 AM and 8:00 PM</p>
                </div>
              </div>
              <div className="bg-gray-200 h-48 rounded-xl overflow-hidden">
                {/* Placeholder for map */}
                <div className="h-full w-full flex items-center justify-center text-gray-500">
                  Interactive Map Placeholder
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Book this car</h2>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">${car.pricePerDay} x 3 days</span>
                    <span className="text-gray-900">${car.pricePerDay * 3}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span className="text-gray-900">$25</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900">${car.pricePerDay * 3 + 25}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-xl text-white font-medium text-center ${
                    car.availability
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!car.availability}
                >
                  {car.availability ? "Reserve Now" : "Not Available"}
                </button>
              </form>
              
              {car.availability && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  You won't be charged yet
                </p>
              )}
              
              <div className="mt-6">
                <div className="flex items-center justify-center mb-2">
                  <div className="flex">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                  </div>
                  <span className="text-sm ml-1 text-gray-700">5.0 · 24 reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back to cars link */}
        <div className="mt-8 mb-4">
          <Link 
            href="/cars" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all cars
          </Link>
        </div>
      </div>
    </div>
  );
}

// Mock car data for fallback
function getMockCar(id: string): Car {
  return {
    id,
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
  };
}
