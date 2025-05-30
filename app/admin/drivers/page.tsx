"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  UserCog,
  Flag,
  CreditCard,
  Calendar,
  Languages,
  UserCheck,
  UserX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

// Import our custom CSS for the drivers page
import "./drivers-page.css"

// Driver interface
interface Driver {
  id: string;
  name: string;
  nationality: string;
  licenseNumber: string;
  age: number;
  languages: string[];
  pricePerDay: number | string;
  pricePerWeek?: number | string | null;
  pricePerMonth?: number | string | null;
  photo?: string | null;
  availability: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default function DriversAdmin() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDriverDialog, setShowAddDriverDialog] = useState(false);
  const [showEditDriverDialog, setShowEditDriverDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nationality: "",
    licenseNumber: "",
    age: 25,
    languages: "",
    pricePerDay: 50,
    pricePerWeek: 300,
    pricePerMonth: 1200,
    photo: "",
    availability: true,
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
        setDrivers(data.drivers || []);
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

  // Filter drivers based on search
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle add driver
  const handleAddDriver = async () => {
    try {
      // Process languages into an array
      const languagesArray = formData.languages.split(',').map(lang => lang.trim());
      
      const newDriver = {
        ...formData,
        languages: languagesArray,
      };
      
      // Submit to API
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDriver),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add driver');
      }
      
      const data = await response.json();
      
      // Update local state
      setDrivers([data.driver, ...drivers]);
      setShowAddDriverDialog(false);
      
      toast({
        title: "Success",
        description: "Driver added successfully",
      });
      
      // Reset form
      setFormData({
        name: "",
        nationality: "",
        licenseNumber: "",
        age: 25,
        languages: "",
        pricePerDay: 50,
        pricePerWeek: 300,
        pricePerMonth: 1200,
        photo: "",
        availability: true,
      });
    } catch (error: any) {
      console.error('Error adding driver:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add driver",
        variant: "destructive",
      });
    }
  };

  // Handle edit driver setup
  const handleEditSetup = (driver: Driver) => {
    setSelectedDriver(driver);
    setFormData({
      name: driver.name,
      nationality: driver.nationality,
      licenseNumber: driver.licenseNumber,
      age: typeof driver.age === 'number' ? driver.age : Number(driver.age),
      languages: Array.isArray(driver.languages) ? driver.languages.join(', ') : '',
      pricePerDay: Number(driver.pricePerDay),
      pricePerWeek: driver.pricePerWeek ? Number(driver.pricePerWeek) : 0,
      pricePerMonth: driver.pricePerMonth ? Number(driver.pricePerMonth) : 0,
      photo: driver.photo || '',
      availability: driver.availability,
    });
    setShowEditDriverDialog(true);
  };

  // Handle edit driver submit
  const handleEditDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      // Process languages into an array
      const languagesArray = formData.languages.split(',').map(lang => lang.trim());
      
      const updatedDriver = {
        ...formData,
        languages: languagesArray,
      };
      
      // Submit to API
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDriver),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update driver');
      }
      
      const data = await response.json();
      
      // Update local state
      setDrivers(drivers.map(driver => 
        driver.id === selectedDriver.id ? data.driver : driver
      ));
      
      setShowEditDriverDialog(false);
      setSelectedDriver(null);
      
      toast({
        title: "Success",
        description: "Driver updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating driver:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update driver",
        variant: "destructive",
      });
    }
  };

  // Handle delete driver setup
  const handleDeleteSetup = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDeleteConfirm(true);
  };

  // Handle delete driver
  const handleDeleteDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      // Submit to API
      const response = await fetch(`/api/admin/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete driver');
      }
      
      // Update local state
      setDrivers(drivers.filter(driver => driver.id !== selectedDriver.id));
      setShowDeleteConfirm(false);
      setSelectedDriver(null);
      
      toast({
        title: "Success",
        description: "Driver deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting driver:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete driver",
        variant: "destructive",
      });
    }
  };

  // Handle toggle availability
  const handleToggleAvailability = async (driver: Driver) => {
    try {
      // Submit to API
      const response = await fetch(`/api/admin/drivers/${driver.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: !driver.availability }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update driver availability');
      }
      
      const data = await response.json();
      
      // Update local state
      setDrivers(drivers.map(d => 
        d.id === driver.id ? data.driver : d
      ));
      
      toast({
        title: "Success",
        description: `Driver marked as ${data.driver.availability ? 'available' : 'unavailable'}`,
      });
    } catch (error: any) {
      console.error('Error toggling driver availability:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update driver availability",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 admin-drivers-page">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
          <p className="mt-1 text-sm text-gray-500">Add, edit, and manage your drivers</p>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search and Add section */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search drivers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button onClick={() => setShowAddDriverDialog(true)}>
            <Plus size={18} className="mr-2" />
            Add New Driver
          </Button>
        </div>
        
        {/* Driver Cards */}
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
                {searchQuery ? "No drivers found matching your search." : "No drivers added yet."}
              </p>
              <Button className="mt-4" onClick={() => setShowAddDriverDialog(true)}>
                <Plus size={18} className="mr-2" />
                Add Your First Driver
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <Card key={driver.id} className="overflow-hidden">
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
                  <Badge 
                    className={`absolute top-3 right-3 ${
                      driver.availability 
                        ? "bg-green-500 hover:bg-green-600" 
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {driver.availability ? "Available" : "Unavailable"}
                  </Badge>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{driver.name}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditSetup(driver)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleAvailability(driver)}>
                          {driver.availability ? (
                            <>
                              <UserX className="mr-2 h-4 w-4" />
                              Mark Unavailable
                            </>
                          ) : (
                            <>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Mark Available
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteSetup(driver)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription className="flex items-center">
                    <Flag className="h-4 w-4 mr-1" />
                    {driver.nationality}, {driver.age} years
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Daily Rate
                      </span>
                      <span className="font-medium">${Number(driver.pricePerDay).toFixed(0)}/day</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Languages className="h-4 w-4 mr-1" />
                      {Array.isArray(driver.languages) ? driver.languages.join(', ') : ''}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      License: {driver.licenseNumber}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Add Driver Dialog */}
      <Dialog open={showAddDriverDialog} onOpenChange={setShowAddDriverDialog}>
        <DialogContent className="sm:max-w-[600px] light-theme-dialog">
          <DialogHeader>
            <DialogTitle>Add New Driver</DialogTitle>
            <DialogDescription>
              Enter the driver details below to add them to your system.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      min={18}
                      max={70}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                      placeholder="American"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="DL-12345678"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input
                    id="languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="English, Spanish, French"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="photo">Photo URL</Label>
                  <Input
                    id="photo"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                    placeholder="https://example.com/driver-photo.jpg"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Daily Rate ($)</Label>
                  <Input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    min={0}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pricePerWeek">Weekly Rate ($)</Label>
                  <Input
                    id="pricePerWeek"
                    name="pricePerWeek"
                    type="number"
                    value={formData.pricePerWeek}
                    onChange={handleInputChange}
                    min={0}
                    step={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pricePerMonth">Monthly Rate ($)</Label>
                  <Input
                    id="pricePerMonth"
                    name="pricePerMonth"
                    type="number"
                    value={formData.pricePerMonth}
                    onChange={handleInputChange}
                    min={0}
                    step={50}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="availability"
                    checked={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="availability">Available for booking</Label>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDriverDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddDriver}>Add Driver</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Driver Dialog */}
      <Dialog open={showEditDriverDialog} onOpenChange={setShowEditDriverDialog}>
        <DialogContent className="sm:max-w-[600px] light-theme-dialog">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update the driver details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <Tabs defaultValue="basic">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-age">Age</Label>
                    <Input
                      id="edit-age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      min={18}
                      max={70}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nationality">Nationality</Label>
                    <Input
                      id="edit-nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-licenseNumber">License Number</Label>
                    <Input
                      id="edit-licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-languages">Languages (comma separated)</Label>
                  <Input
                    id="edit-languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-photo">Photo URL</Label>
                  <Input
                    id="edit-photo"
                    name="photo"
                    value={formData.photo}
                    onChange={handleInputChange}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="pricing" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerDay">Daily Rate ($)</Label>
                  <Input
                    id="edit-pricePerDay"
                    name="pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={handleInputChange}
                    min={0}
                    step={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerWeek">Weekly Rate ($)</Label>
                  <Input
                    id="edit-pricePerWeek"
                    name="pricePerWeek"
                    type="number"
                    value={formData.pricePerWeek}
                    onChange={handleInputChange}
                    min={0}
                    step={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerMonth">Monthly Rate ($)</Label>
                  <Input
                    id="edit-pricePerMonth"
                    name="pricePerMonth"
                    type="number"
                    value={formData.pricePerMonth}
                    onChange={handleInputChange}
                    min={0}
                    step={50}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-availability"
                    checked={formData.availability}
                    onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="edit-availability">Available for booking</Label>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDriverDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDriver}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="light-theme-dialog">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDriver && (
            <div className="flex items-center py-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                {selectedDriver.photo ? (
                  <Image 
                    src={selectedDriver.photo} 
                    alt={selectedDriver.name} 
                    width={48}
                    height={48}
                    className="object-cover w-full h-full" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <UserCog className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium">{selectedDriver.name}</h4>
                <p className="text-sm text-gray-500">{selectedDriver.nationality}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDriver}>
              Delete Driver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 