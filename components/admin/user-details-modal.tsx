"use client"

import { useState } from "react"
import { Calendar, Mail, Phone, MapPin, CreditCard, Edit, Save } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type User = {
  id: string
  name: string
  email: string
  registrationDate: Date
  status: string
  bookingCount: number
  avatar: string
  phone: string
  address: string
  licenseNumber: string
  notes: string
}

type Booking = {
  id: string
  carName: string
  startDate: Date
  endDate: Date
  status: string
  amount: number
}

interface UserDetailsModalProps {
  user: User
  bookings: Booking[]
  onClose: () => void
  onStatusChange: (userId: string) => void
}

export default function UserDetailsModal({ user, bookings, onClose, onStatusChange }: UserDetailsModalProps) {
  const [notes, setNotes] = useState(user.notes)
  const [isEditing, setIsEditing] = useState(false)

  const handleSaveNotes = () => {
    // In a real app, you would save the notes to the backend here
    setIsEditing(false)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">User Details</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-start">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-16 w-16 rounded-full mr-4" />
            <div>
              <h3 className="text-lg font-medium">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.id}</p>
              <div className="mt-2 flex items-center">
                <Badge variant={user.status === "active" ? "success" : "destructive"}>
                  {user.status === "active" ? "Active" : "Blocked"}
                </Badge>
                <span className="ml-2 text-sm text-gray-500">{user.bookingCount} bookings</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="mt-6">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-sm">{user.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-sm">{user.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">License Number</p>
                      <p className="text-sm">{user.licenseNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registration Date</p>
                      <p className="text-sm">{format(user.registrationDate, "MMMM dd, yyyy")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                    {!isEditing ? (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-8 px-2">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={handleSaveNotes} className="h-8 px-2">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about this user..."
                      className="min-h-[100px]"
                    />
                  ) : (
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md min-h-[100px]">
                      {notes || "No notes available for this user."}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings" className="mt-4">
              {bookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Booking ID
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Car
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Dates
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.id}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{booking.carName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {format(booking.startDate, "MMM dd")} - {format(booking.endDate, "MMM dd, yyyy")}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <Badge variant={booking.status === "completed" ? "success" : "destructive"}>
                              {booking.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${booking.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No booking history available for this user.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <div className="flex items-center gap-2">
            <Switch checked={user.status === "active"} onCheckedChange={() => onStatusChange(user.id)} />
            <span className="text-sm">{user.status === "active" ? "User is active" : "User is blocked"}</span>
          </div>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
