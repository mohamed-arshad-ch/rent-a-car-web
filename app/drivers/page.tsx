"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import {
  Flag,
  Languages,
  Search,
  UserCog,
  Calendar,
  Filter,
  CreditCard,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Import our custom CSS for the drivers page
import "./drivers-page.css"

// Driver interface
interface Driver {
  id: string;
  name: string;
  nationality: string;
  age: number;
  languages: string[];
  pricePerDay: number | string;
  pricePerWeek?: number | string | null;
  pricePerMonth?: number | string | null;
  photo?: string | null;
  availability: boolean;
}

export default function DriversPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [filters, setFilters] = useState({
    nationality: "",
    priceRange: [0, 1000], // min, max
    sortBy: "price-asc", // price-asc, price-desc, name-asc, name-desc
  });

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/drivers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch drivers');
        }
        
        const data = await response.json();
        // Only get available drivers
        const availableDrivers = (data.drivers || []).filter(
          (driver: Driver) => driver.availability
        );
        setDrivers(availableDrivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        toast({
          title: "Error",
          description: "Failed to load drivers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Filter and sort drivers
  const filteredDrivers = drivers
    .filter(driver => 
      // Search query
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(driver.languages) && driver.languages.some(lang => 
        lang.toLowerCase().includes(searchQuery.toLowerCase())
      )) &&
      // Nationality filter
      (filters.nationality === "" || driver.nationality === filters.nationality) &&
      // Price range filter
      Number(driver.pricePerDay) >= filters.priceRange[0] && 
      Number(driver.pricePerDay) <= filters.priceRange[1]
    )
    .sort((a, b) => {
      // Sort by
      switch (filters.sortBy) {
        case "price-asc":
          return Number(a.pricePerDay) - Number(b.pricePerDay);
        case "price-desc":
          return Number(b.pricePerDay) - Number(a.pricePerDay);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Handle booking button click
  const handleBookingClick = (driver: Driver) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?redirect=/drivers`);
    } else {
      // Show booking dialog if authenticated
      setSelectedDriver(driver);
      setShowBookingDialog(true);
    }
  };

  // Unique nationalities for filter
  const nationalities = [...new Set(drivers.map(driver => driver.nationality))];

  return (
    <div className="min-h-screen bg-gray-50 pb-16 drivers-page">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Professional Drivers</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Hire experienced and professional drivers to enhance your travel experience. 
            All our drivers are vetted and multilingual.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search drivers by name, nationality, or language..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {/* Nationality filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Flag className="mr-2 h-4 w-4" />
                    Nationality
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56">
                  <div className="space-y-2">
                    <div className="font-medium">Filter by nationality</div>
                    <div className="flex flex-col gap-1.5">
                      <div 
                        className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${filters.nationality === "" ? "bg-blue-50 text-blue-600" : ""}`}
                        onClick={() => setFilters({...filters, nationality: ""})}
                      >
                        All
                      </div>
                      {nationalities.map(nationality => (
                        <div 
                          key={nationality}
                          className={`cursor-pointer hover:bg-gray-100 px-2 py-1 rounded ${filters.nationality === nationality ? "bg-blue-50 text-blue-600" : ""}`}
                          onClick={() => setFilters({...filters, nationality})}
                        >
                          {nationality}
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Sort by dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Sort By
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className={filters.sortBy === "price-asc" ? "bg-blue-50 text-blue-600" : ""}
                    onClick={() => setFilters({...filters, sortBy: "price-asc"})}
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={filters.sortBy === "price-desc" ? "bg-blue-50 text-blue-600" : ""}
                    onClick={() => setFilters({...filters, sortBy: "price-desc"})}
                  >
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={filters.sortBy === "name-asc" ? "bg-blue-50 text-blue-600" : ""}
                    onClick={() => setFilters({...filters, sortBy: "name-asc"})}
                  >
                    Name: A to Z
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={filters.sortBy === "name-desc" ? "bg-blue-50 text-blue-600" : ""}
                    onClick={() => setFilters({...filters, sortBy: "name-desc"})}
                  >
                    Name: Z to A
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-gray-600">Loading drivers...</p>
          </div>
        ) : filteredDrivers.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <UserCog className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-3 text-gray-600">
                {searchQuery || filters.nationality ? 
                  "No drivers found matching your search criteria." : 
                  "No drivers available at the moment."}
              </p>
              {(searchQuery || filters.nationality) && (
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setSearchQuery("");
                    setFilters({...filters, nationality: ""});
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  {driver.photo ? (
                    <Image 
                      src={driver.photo} 
                      alt={driver.name} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <UserCog className="h-20 w-20 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{driver.name}</h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Flag className="h-4 w-4 mr-1" />
                        <span>{driver.nationality}, {driver.age} years</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      ${Number(driver.pricePerDay).toFixed(0)}/day
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Languages className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Languages</div>
                        <div className="text-gray-600">
                          {Array.isArray(driver.languages) ? driver.languages.join(', ') : ''}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Pricing Options</div>
                        <div className="text-gray-600">
                          <div>${Number(driver.pricePerDay).toFixed(0)}/day</div>
                          {driver.pricePerWeek && <div>${Number(driver.pricePerWeek).toFixed(0)}/week</div>}
                          {driver.pricePerMonth && <div>${Number(driver.pricePerMonth).toFixed(0)}/month</div>}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleBookingClick(driver)}
                    >
                      {isAuthenticated ? "Book This Driver" : "Login to Book"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="sm:max-w-[425px] light-theme-dialog">
          <DialogHeader>
            <DialogTitle>Book a Driver</DialogTitle>
            <DialogDescription>
              Please complete the booking details for your driver.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="py-4">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mr-4 flex-shrink-0">
                  {selectedDriver.photo ? (
                    <Image 
                      src={selectedDriver.photo} 
                      alt={selectedDriver.name} 
                      width={64}
                      height={64}
                      className="object-cover w-full h-full" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <UserCog className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedDriver.name}</h3>
                  <p className="text-gray-600">{selectedDriver.nationality}, {selectedDriver.age} years</p>
                  <div className="flex items-center mt-1">
                    <CreditCard className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">
                      ${Number(selectedDriver.pricePerDay).toFixed(0)}/day
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Form would go here in a real implementation */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start Date</label>
                  <Input type="date" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End Date</label>
                  <Input type="date" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Rental Period</label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="daily">Daily (${Number(selectedDriver.pricePerDay).toFixed(0)}/day)</option>
                    {selectedDriver.pricePerWeek && (
                      <option value="weekly">Weekly (${Number(selectedDriver.pricePerWeek).toFixed(0)}/week)</option>
                    )}
                    {selectedDriver.pricePerMonth && (
                      <option value="monthly">Monthly (${Number(selectedDriver.pricePerMonth).toFixed(0)}/month)</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // In a real app, would submit the booking
              setShowBookingDialog(false);
              router.push('/dashboard/bookings');
            }}>
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 