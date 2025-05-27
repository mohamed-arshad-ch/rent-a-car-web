"use client"

import { useState } from "react"
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  User,
  Car,
  CreditCard,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Helper functions for formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

const formatDateTime = (dateTimeString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }
  return new Date(dateTimeString).toLocaleString("en-US", options)
}

// Get status badge variant
const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "confirmed":
      return "success"
    case "pending":
      return "warning"
    case "completed":
      return "default" 
    case "cancelled":
      return "destructive"
    default:
      return "secondary"
  }
}

// Get status icon
const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
    case "completed":
    case "confirmed":
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case "pending":
      return <AlertCircle className="h-5 w-5 text-yellow-500" />
    case "cancelled":
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <FileText className="h-5 w-5 text-gray-500" />
  }
}

interface BookingDetailsModalProps {
  booking: {
    id: string;
    customerId: string;
    customerName: string;
    customerEmail?: string;
    carId: string;
    carName: string;
    carType: string;
    carImage: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalValue: number;
    status: string;
    createdAt: string;
    customerAvatar?: string;
    pickupLocation?: string;
    returnLocation?: string;
    paymentMethod?: string;
    paymentStatus?: string;
    notes?: string;
    statusHistory?: Array<{status: string; date: string; note: string}>;
  };
  onClose: () => void;
  onUpdateStatus?: (bookingId: string, newStatus: string) => Promise<boolean | undefined>;
}

export default function BookingDetailsModal({ booking, onClose, onUpdateStatus }: BookingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [adminNote, setAdminNote] = useState(booking.notes || "")
  const [statusOptions] = useState(["Pending", "Confirmed", "Completed", "Cancelled"])
  const [selectedStatus, setSelectedStatus] = useState(booking.status)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateError, setUpdateError] = useState("")

  const handleStatusUpdate = async () => {
    if (!onUpdateStatus || selectedStatus === booking.status) return
    
    setIsUpdating(true)
    setUpdateError("")
    
    try {
      const success = await onUpdateStatus(booking.id, selectedStatus)
      
      if (!success) {
        setUpdateError("Failed to update booking status. Please try again.")
      }
    } catch (error) {
      setUpdateError("An error occurred while updating the status.")
      console.error(error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Details</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.id} • Created on {formatDateTime(booking.createdAt)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`${
                    activeTab === "details"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Booking Details
                </button>
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`${
                    activeTab === "timeline"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Timeline
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "details" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Customer Information
                    </h4>
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full overflow-hidden bg-gray-200">
                        {booking.customerAvatar ? (
                          <img
                            src={booking.customerAvatar}
                            alt={booking.customerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-600 text-lg font-medium">
                            {booking.customerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerId}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="text-gray-900">{booking.customerEmail || "Not provided"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Car Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      Car Information
                    </h4>
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0 h-16 w-24 rounded overflow-hidden bg-gray-200">
                        <img
                          src={booking.carImage || "/placeholder.svg"}
                          alt={booking.carName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{booking.carName}</div>
                        <div className="text-sm text-gray-500">{booking.carType}</div>
                        <div className="text-sm text-gray-500">{booking.carId}</div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Booking Details
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500 mr-1">Dates:</span>
                        <span className="text-gray-900">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500 mr-1">Duration:</span>
                        <span className="text-gray-900">{booking.totalDays} days</span>
                      </div>
                      {booking.pickupLocation && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-500 mr-1">Pickup:</span>
                          <span className="text-gray-900">{booking.pickupLocation}</span>
                        </div>
                      )}
                      {booking.returnLocation && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-500 mr-1">Return:</span>
                          <span className="text-gray-900">{booking.returnLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <FileText className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500 mr-1">Status:</span>
                        <Badge variant={getStatusBadgeVariant(booking.status)} className="ml-1">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Payment Information
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-500 mr-1">Total:</span>
                        <span className="text-gray-900 font-semibold">{formatCurrency(booking.totalValue)}</span>
                      </div>
                      {booking.paymentMethod && (
                        <div className="flex items-center text-sm">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-500 mr-1">Payment Method:</span>
                          <span className="text-gray-900">{booking.paymentMethod}</span>
                        </div>
                      )}
                      {booking.paymentStatus && (
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-500 mr-1">Payment Status:</span>
                          <span className="text-gray-900">{booking.paymentStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {onUpdateStatus && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Update Booking Status
                      </h4>
                      
                      {updateError && (
                        <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md">
                          {updateError}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            disabled={isUpdating}
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={handleStatusUpdate}
                          disabled={isUpdating || selectedStatus === booking.status}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="animate-spin h-4 w-4 mr-2" />
                              Updating...
                            </>
                          ) : (
                            "Update Status"
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Notes
                    </h4>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Add notes about this booking..."
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500">Booking Timeline</h4>
                  </div>
                  <div className="p-4">
                    {booking.statusHistory && booking.statusHistory.length > 0 ? (
                      <ul className="space-y-4">
                        {booking.statusHistory.map((event, index) => (
                          <li key={index} className="relative pl-6 pb-4">
                            {index !== booking.statusHistory!.length - 1 && (
                              <div className="absolute top-5 left-2 -bottom-0 w-0.5 bg-gray-200"></div>
                            )}
                            <div className="absolute top-1 left-0 w-4 h-4 rounded-full flex items-center justify-center">
                              {getStatusIcon(event.status)}
                            </div>
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <Badge variant={getStatusBadgeVariant(event.status)} className="mr-2">
                                {event.status}
                              </Badge>
                              <span className="text-gray-500">{formatDateTime(event.date)}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-500">{event.note}</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No timeline data available</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
