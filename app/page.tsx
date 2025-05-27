import Image from "next/image"
import Link from "next/link"
import {
  CalendarIcon,
  CarIcon,
  HeadphonesIcon,
  MapPinIcon,
  ShieldCheckIcon,
  StarIcon,
  ThumbsUpIcon,
  UsersIcon,
} from "lucide-react"
import { prisma } from "@/lib/prisma"

// Mock data for cars when database connection fails
const mockCars = [
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
    description: "Luxury electric sedan with cutting-edge technology and impressive range.",
    createdAt: new Date(),
    updatedAt: new Date()
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
    description: "Premium SUV with spacious interior and advanced driver assistance features.",
    createdAt: new Date(),
    updatedAt: new Date()
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
    availability: true,
    image: "https://images.unsplash.com/photo-1611821064430-0d40291922d1?w=800&auto=format&fit=crop",
    description: "Iconic sports car with exhilarating performance and timeless design.",
    createdAt: new Date(),
    updatedAt: new Date()
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
    description: "Reliable sedan with excellent fuel economy and comfortable interior.",
    createdAt: new Date(),
    updatedAt: new Date()
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
    description: "Luxury SUV with off-road capability and premium interior finishes.",
    createdAt: new Date(),
    updatedAt: new Date()
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
    description: "Elegant luxury sedan with advanced technology and refined driving experience.",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Server component - can fetch data directly
export default async function Home() {
  // Fetch featured cars from database with error handling
  let featuredCars = [];
  try {
    featuredCars = await prisma.car.findMany({
      where: {
        availability: true,
      },
      take: 6,
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    // Use mock data as fallback
    featuredCars = mockCars;
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <CarIcon className="h-8 w-8 text-indigo-600" />
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">RentACar</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-indigo-600 font-medium">
                Home
              </Link>
              <Link href="/cars" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Cars
              </Link>
              <Link href="/how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">
                How it Works
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
              >
                Register
              </Link>
              <button className="md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[650px] sm:h-[750px]">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"
              alt="Luxury car on scenic road"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
          </div>
          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Find Your Perfect <span className="text-indigo-400">Drive</span> Today
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Experience freedom on the road with our premium selection of vehicles at competitive prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/cars"
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-all shadow-lg flex items-center justify-center">
                  <CarIcon className="h-5 w-5 mr-2" />
                  Browse Cars
                </Link>
                <Link href="/how-it-works"
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-full text-lg font-medium transition-all shadow-lg flex items-center justify-center">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Search Form */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 -mt-24 relative z-10 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Find Your Ideal Rental Car</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1 text-indigo-600" /> Pick-up Location
                    </label>
                    <div className="relative">
                      <select className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 appearance-none">
                        <option>New York</option>
                        <option>Los Angeles</option>
                        <option>Chicago</option>
                        <option>Miami</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-indigo-600" /> Pick-up Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1 text-indigo-600" /> Return Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center">
                      <CarIcon className="h-4 w-4 mr-1 text-indigo-600" /> Car Type
                    </label>
                    <div className="relative">
                      <select className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-900 appearance-none">
                        <option>All Types</option>
                        <option>Economy</option>
                        <option>SUV</option>
                        <option>Luxury</option>
                        <option>Sports</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button className="w-full h-12 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl transition-all shadow-lg flex items-center justify-center font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Featured Cars Section */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Vehicles</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explore our premium selection of rental cars for your next adventure
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.length > 0 ? (
                featuredCars.map((car) => (
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
                        <div className="flex items-center bg-indigo-50 rounded-full px-2 py-1">
                          <StarIcon className="h-4 w-4 text-amber-500" />
                          <span className="text-xs font-medium text-gray-700 ml-1">4.9</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 flex items-center">
                        <span className="inline-block bg-indigo-50 text-indigo-700 rounded-full px-2 py-1 text-xs font-medium mr-2">{car.year}</span>
                        <span className="inline-block bg-indigo-50 text-indigo-700 rounded-full px-2 py-1 text-xs font-medium mr-2">{car.transmission}</span>
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
                        className="block w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-center py-3 rounded-xl transition-all font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10">
                  <p className="text-gray-500">No cars available at the moment. Please check back later.</p>
                </div>
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link 
                href="/cars" 
                className="inline-block bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-full font-medium transition-colors shadow-sm"
              >
                View All Vehicles
              </Link>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why Choose Us</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Experience the best car rental service with premium vehicles and exceptional customer care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <CarIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Fleet</h3>
                <p className="text-gray-600">
                  Choose from our wide selection of well-maintained premium vehicles for any occasion.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <ThumbsUpIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Booking</h3>
                <p className="text-gray-600">
                  Simple and secure online booking process with instant confirmation.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Safe & Reliable</h3>
                <p className="text-gray-600">
                  All our vehicles undergo regular maintenance checks for your safety.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">24/7 Support</h3>
                <p className="text-gray-600">
                  Our customer service team is available around the clock to assist you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">What Our Customers Say</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-violet-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Hear from our satisfied customers about their experience with our services
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  "The booking process was incredibly smooth, and the car was in perfect condition. Will definitely use RentACar again for my next trip!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                    <p className="text-sm text-gray-600">New York, NY</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  "Exceptional service from start to finish. The staff was helpful, and the pricing was very competitive. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Michael Chen</h4>
                    <p className="text-sm text-gray-600">Chicago, IL</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-6">
                  "The luxury car I rented was immaculate and made my weekend getaway truly special. Great value for the quality provided."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Emily Rodriguez</h4>
                    <p className="text-sm text-gray-600">Miami, FL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <div className="flex items-center mb-6">
                <CarIcon className="h-8 w-8 text-indigo-400" />
                <span className="text-xl font-bold ml-2 bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">RentACar</span>
              </div>
              <p className="text-gray-400 mb-6">
                Premium car rental services with a wide range of vehicles to meet your needs. Experience the freedom of the open road with our well-maintained fleet.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-6 text-indigo-300">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>Home
                </Link></li>
                <li><Link href="/cars" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>Cars
                </Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>About Us
                </Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></span>Contact
                </Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="text-lg font-semibold mb-6 text-indigo-300">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-indigo-400 mr-3 mt-1" />
                  <span className="text-gray-400">123 Main Street<br />New York, NY 10001</span>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <Link href="tel:+1234567890" className="text-gray-400 hover:text-white transition-colors">+1 (234) 567-890</Link>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <Link href="mailto:info@rentacar.com" className="text-gray-400 hover:text-white transition-colors">info@rentacar.com</Link>
                </li>
              </ul>
            </div>
            
            <div className="md:col-span-3">
              <h3 className="text-lg font-semibold mb-6 text-indigo-300">Newsletter</h3>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for updates and exclusive offers.</p>
              <form className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-800 text-white px-4 py-3 rounded-xl flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-700"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all whitespace-nowrap">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 RentACar. All rights reserved.</p>
            <div className="mt-4 md:mt-0 text-gray-500 text-sm">
              <Link href="/privacy" className="hover:text-indigo-400 transition-colors mr-6">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
