"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ChevronDown, X, Eye, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import AdminHeader from "@/components/admin/header"
import UserDetailsModal from "@/components/admin/user-details-modal"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { useAdminAuth } from "@/lib/admin-auth-context"

// Define user interface
interface User {
  id: string
  name: string
  email: string
  phoneNumber?: string
  registrationDate: string
  status: string
  bookingCount: number
}

// Define pagination interface
interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function UserManagement() {
  const { token } = useAdminAuth()
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortOption, setSortOption] = useState("newest")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [showFilters, setShowFilters] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Fetch users from API
  const fetchUsers = async () => {
    if (!token) return
    
    setIsLoading(true)
    setError("")
    
    try {
      const url = new URL('/api/admin/users', window.location.origin)
      
      // Add query parameters
      if (searchTerm) url.searchParams.append('search', searchTerm)
      if (statusFilter !== 'all') url.searchParams.append('status', statusFilter)
      if (dateFilter !== 'all') url.searchParams.append('dateFilter', dateFilter)
      
      if (dateFilter === 'custom' && dateRange?.from) {
        url.searchParams.append('fromDate', dateRange.from.toISOString())
        if (dateRange.to) url.searchParams.append('toDate', dateRange.to.toISOString())
      }
      
      url.searchParams.append('sortBy', sortOption)
      url.searchParams.append('page', currentPage.toString())
      url.searchParams.append('limit', itemsPerPage.toString())
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
      setUsers(data.users)
      setFilteredUsers(data.users)
      setPagination(data.pagination)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch users when filters or pagination changes
  useEffect(() => {
    fetchUsers()
  }, [token, searchTerm, statusFilter, dateFilter, dateRange, sortOption, currentPage])

  // Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Toggle user status (not implemented in database yet, just UI)
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === "active" ? "blocked" : "active",
        }
      }
      return user
    })
    setUsers(updatedUsers)
  }

  // View user details
  const viewUserDetails = (user: User) => {
    setSelectedUser(user)
  }

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateFilter("all")
    setDateRange(undefined)
    setSortOption("newest")
  }

  // Error state
  if (error && !isLoading) {
    return (
      <>
        <AdminHeader title="User Management" />
        <main className="flex-1 overflow-auto pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to load users</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => fetchUsers()}
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

  return (
    <>
      <AdminHeader title="User Management" />
      <main className="flex-1 overflow-auto pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="relative flex-1 max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users by name, email, or ID..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div className="ml-4 flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>

              {showFilters && (
                <div className="pt-2 pb-1 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                    {/* Status Filter */}
                    <div>
                      <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status-filter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>

                    {/* Registration Date Filter */}
                    <div>
                      <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Date
                      </label>
                      <select
                        id="date-filter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="all">All Time</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="custom">Custom Range</option>
                      </select>
                    </div>

                    {/* Custom Date Range */}
                    {dateFilter === "custom" && (
                      <div className="md:col-span-2">
                        <label htmlFor="custom-date-range" className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Date Range
                        </label>
                        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                      </div>
                    )}

                    {/* Sort Options */}
                    <div className={dateFilter === "custom" ? "md:col-span-1" : "md:col-span-2"}>
                      <label htmlFor="sort-options" className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        id="sort-options"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="a-z">Name (A-Z)</option>
                        <option value="z-a">Name (Z-A)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm" onClick={resetFilters} className="mr-2">
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={() => setShowFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 mb-4">No users found matching your criteria.</p>
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Registered
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Bookings
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.id.substring(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {format(new Date(user.registrationDate), "MMM d, yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.bookingCount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Switch
                                checked={user.status === "active"}
                                onCheckedChange={() => toggleUserStatus(user.id)}
                              />
                              <Badge
                                variant={user.status === "active" ? "success" : "destructive"}
                                className="ml-2"
                              >
                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => viewUserDetails(user)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to{" "}
                          <span className="font-medium">
                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
                          </span>{" "}
                          of <span className="font-medium">{pagination.totalItems}</span> users
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => paginate(Math.max(1, currentPage - 1))}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Previous</span>
                            <ChevronDown className="h-5 w-5 rotate-90" />
                          </button>
                          {Array.from({ length: pagination.totalPages }, (_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => paginate(i + 1)}
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
                            onClick={() => paginate(Math.min(pagination.totalPages, currentPage + 1))}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            <span className="sr-only">Next</span>
                            <ChevronDown className="h-5 w-5 -rotate-90" />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      {selectedUser && (
        <UserDetailsModal
          user={{
            ...selectedUser,
            // Add default values for missing properties expected by the modal
            avatar: '/placeholder.svg',
            phone: selectedUser.phoneNumber || 'Not provided',
            address: 'Not provided',
            licenseNumber: 'Not provided',
            notes: ''
          }}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  )
}
