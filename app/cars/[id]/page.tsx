"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  Calendar,
  ChevronLeft,
  MapPin,
  Users,
  Briefcase,
  Gauge,
  AirVent,
  Bluetooth,
  Wifi,
  Sunrise,
  CheckCircle2,
  Car as CarIcon,
  Fuel,
  Shield,
  CalendarIcon,
  Clock,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from 'date-fns'

// Define Car type based on Prisma schema
type Car = {
  id: string;
  name: string;
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

// Car features grouped by category
const carFeatures = {
  comfort: [
    "Air Conditioning",
    "Heated Seats",
    "Leather Interior",
    "Power Seats",
  ],
  technology: [
    "Bluetooth",
    "GPS Navigation",
    "USB Ports",
    "Premium Sound System",
  ],
  safety: [
    "Backup Camera",
    "Parking Sensors",
    "Lane Departure Warning",
    "Blind Spot Monitor",
  ],
  convenience: [
    "Keyless Entry",
    "Cruise Control",
    "Remote Start",
    "Sunroof",
  ]
};

export default function CarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const carId = params.id as string;
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDates, setBookingDates] = useState({
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(new Date().setDate(new Date().getDate() + 3)), 'yyyy-MM-dd')
  });
  const [totalDays, setTotalDays] = useState(3);
  const [totalPrice, setTotalPrice] = useState(0);
  
  // Calculate booking details when car data or dates change
  useEffect(() => {
    if (car) {
      const start = new Date(bookingDates.startDate);
      const end = new Date(bookingDates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      setTotalDays(diffDays);
      setTotalPrice(Number(car.pricePerDay) * diffDays + 25); // 25 is service fee
    }
  }, [car, bookingDates]);
  
  // Fetch car data from API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cars/${carId}`);
        if (!res.ok) {
          throw new Error(res.status === 404 ? 'Car not found' : 'Failed to fetch car details');
        }
        const data = await res.json();
        setCar(data.car);
      } catch (err) {
        console.error('Error fetching car:', err);
        setError('Failed to load car details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCar();
  }, [carId]);
  
  // Handle booking button click
  const handleBookingClick = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?redirect=/cars/${carId}`);
    } else {
      // Show booking modal if authenticated
      setShowBookingModal(true);
    }
  };
  
  // Handle booking submission
  const handleBookingSubmit = async () => {
    try {
      // API call would go here to create booking
      // const response = await fetch('/api/bookings/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     carId: car?.id,
      //     startDate: bookingDates.startDate,
      //     endDate: bookingDates.endDate,
      //     totalPrice
      //   })
      // });
      
      // if (response.ok) {
      //   router.push('/dashboard/bookings');
      // }
      
      // For now, just close modal and redirect
      setShowBookingModal(false);
      router.push('/dashboard/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  
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
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-6">
              <CarIcon className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
            <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
            <Button className="w-full" asChild>
              <Link href="/cars">Back to Cars</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Car exists, render detail page
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back to cars link */}
      <div className="container mx-auto pt-4 px-4">
        <Link 
          href="/cars" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all cars
        </Link>
      </div>
      
      {/* Car Hero Section */}
      <div className="relative h-[400px] sm:h-[500px] mt-4">
        {car.image ? (
          <Image
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover rounded-b-[2.5rem]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center rounded-b-[2.5rem]">
            <CarIcon className="h-24 w-24 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-[2.5rem]" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="container mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                    {car.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                    {car.year}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30">
                    {car.transmission}
                  </Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {car.brand} {car.model}
                </h1>
              </div>
              <div className="mt-2 sm:mt-0">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Car Specs */}
            <Card className="mb-8 bg-white border-none shadow-md rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 md:grid-cols-4">
                  <div className="flex flex-col items-center justify-center p-6 border-r border-b md:border-b-0">
                    <Users className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-sm text-gray-500">Seats</span>
                    <span className="font-medium">{car.seats} People</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 border-b md:border-r md:border-b-0">
                    <Fuel className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-sm text-gray-500">Fuel Type</span>
                    <span className="font-medium">{car.fuelType}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6 border-r">
                    <Gauge className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-sm text-gray-500">Transmission</span>
                    <span className="font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-6">
                    <Calendar className="h-6 w-6 text-indigo-600 mb-2" />
                    <span className="text-sm text-gray-500">Year</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Description */}
            <Card className="mb-8 border-none shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this car</h2>
                <p className="text-gray-700 leading-relaxed">
                  {car.description || `Experience the luxury and performance of the ${car.brand} ${car.model}. This ${car.year} model comes with a responsive ${car.transmission} transmission and comfortable seating for ${car.seats} passengers. Perfect for both city driving and long road trips.`}
                </p>
                
                {/* Car Specifications */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                    <div className="flex items-center">
                      <CarIcon className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-gray-700">Model: {car.model}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-gray-700">Year: {car.year}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full mr-2" style={{ backgroundColor: car.color }}></div>
                      <span className="text-gray-700">Color: {car.color}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-gray-700">Seats: {car.seats}</span>
                    </div>
                    <div className="flex items-center">
                      <Gauge className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-gray-700">Transmission: {car.transmission}</span>
                    </div>
                    <div className="flex items-center">
                      <Fuel className="h-5 w-5 text-indigo-600 mr-2" />
                      <span className="text-gray-700">Fuel: {car.fuelType}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Features */}
            <Card className="mb-8 border-none shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
                
                <div className="space-y-6">
                  {Object.entries(carFeatures).map(([category, features]) => (
                    <div key={category}>
                      <h3 className="text-md font-medium text-gray-900 capitalize mb-3">{category}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {features.map((feature) => (
                          <div key={feature} className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Location */}
            <Card className="border-none shadow-md rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pick-up Location</h2>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
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
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-none shadow-md rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Book this car</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pick-up Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={bookingDates.startDate}
                          onChange={(e) => setBookingDates({...bookingDates, startDate: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={bookingDates.endDate}
                          onChange={(e) => setBookingDates({...bookingDates, endDate: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          min={bookingDates.startDate}
                        />
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">${car.pricePerDay} x {totalDays} days</span>
                        <span className="text-gray-900">${Number(car.pricePerDay) * totalDays}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Service fee</span>
                        <span className="text-gray-900">$25</span>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-semibold text-gray-900">${totalPrice}</span>
                      </div>
                    </div>
                    
                    <Button
                      className={`w-full py-6 rounded-xl text-white font-medium text-center ${
                        car.availability
                          ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handleBookingClick}
                      disabled={!car.availability}
                    >
                      {car.availability ? (isAuthenticated ? "Reserve Now" : "Login to Book") : "Not Available"}
                    </Button>
                  </div>
                  
                  {car.availability && (
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      You won't be charged yet
                    </p>
                  )}
                  
                  {/* Availability status */}
                  <div className="mt-6 flex items-center justify-center">
                    <div className={`h-3 w-3 rounded-full ${car.availability ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                    <span className="text-sm text-gray-700">
                      {car.availability ? 'Available for booking' : 'Not available'}
                    </span>
                  </div>
                  
                  {/* Support note */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">24/7 Customer Support</p>
                        <p className="text-xs text-blue-600 mt-1">Our team is available round the clock to assist with your booking needs.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please review your booking details before confirming.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-900">{car.brand} {car.model}</h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{car.year} • {car.transmission} • {car.fuelType}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-700">Pickup Date</span>
                    </div>
                    <span className="text-sm font-medium">{bookingDates.startDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-700">Return Date</span>
                    </div>
                    <span className="text-sm font-medium">{bookingDates.endDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-indigo-600 mr-2" />
                      <span className="text-sm text-gray-700">Duration</span>
                    </div>
                    <span className="text-sm font-medium">{totalDays} days</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Price</span>
                    <span className="text-lg font-bold text-indigo-600">${totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookingSubmit}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
