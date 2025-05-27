import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Get JWT secret from environment or use fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-jwt-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string }
      
      // Verify that the user is an admin
      if (!decoded.role || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    // Get query parameters
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || 'all'
    const carType = url.searchParams.get('carType') || 'all'
    const startDate = url.searchParams.get('startDate') || ''
    const endDate = url.searchParams.get('endDate') || ''
    const sortBy = url.searchParams.get('sortBy') || 'newest'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Build the where clause for filtering
    const whereClause: any = {
      car: {},
      user: {}
    }
    
    // Search filter
    if (search) {
      whereClause.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { car: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }
    
    // Status filter
    if (status && status !== 'all' && status !== 'All') {
      whereClause.status = status.toUpperCase()
    }
    
    // Car type filter
    if (carType && carType !== 'all' && carType !== 'All') {
      whereClause.car.type = carType
    }
    
    // Date range filter
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      // Find bookings that overlap with the selected date range
      whereClause.OR = [
        // Booking starts within the range
        {
          startDate: {
            gte: start,
            lte: end
          }
        },
        // Booking ends within the range
        {
          endDate: {
            gte: start,
            lte: end
          }
        },
        // Booking spans the entire range
        {
          AND: [
            { startDate: { lte: start } },
            { endDate: { gte: end } }
          ]
        }
      ]
    }
    
    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'newest':
      case 'Newest First':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
      case 'Oldest First':
        orderBy = { createdAt: 'asc' }
        break
      case 'total-high':
      case 'Price: High to Low':
        orderBy = { totalPrice: 'desc' }
        break
      case 'total-low':
      case 'Price: Low to High':
        orderBy = { totalPrice: 'asc' }
        break
    }
    
    // Query bookings from database with pagination
    const [bookings, totalCount] = await Promise.all([
      prisma.booking.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          car: {
            select: {
              id: true,
              name: true,
              brand: true,
              model: true,
              type: true,
              image: true
            }
          }
        }
      }),
      prisma.booking.count({
        where: whereClause
      })
    ])
    
    // Get statistics for all bookings
    const [
      pendingCount,
      confirmedCount,
      completedCount,
      cancelledCount
    ] = await Promise.all([
      prisma.booking.count({ where: { status: 'PENDING' } }),
      prisma.booking.count({ where: { status: 'CONFIRMED' } }),
      prisma.booking.count({ where: { status: 'COMPLETED' } }),
      prisma.booking.count({ where: { status: 'CANCELLED' } })
    ])
    
    // Format the booking data
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      customerId: booking.userId,
      customerName: booking.user.name,
      customerEmail: booking.user.email,
      carId: booking.carId,
      carName: booking.car.name,
      carType: booking.car.type,
      carImage: booking.car.image || '/placeholder.svg',
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      totalDays: Math.ceil(
        (booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24)
      ),
      totalValue: parseFloat(booking.totalPrice.toString()),
      status: booking.status.charAt(0) + booking.status.slice(1).toLowerCase(),
      createdAt: booking.createdAt.toISOString()
    }))
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      bookings: formattedBookings,
      stats: {
        total: pendingCount + confirmedCount + completedCount + cancelledCount,
        pending: pendingCount,
        active: confirmedCount,
        completed: completedCount,
        cancelled: cancelledCount
      },
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching bookings' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get('Authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string }
      
      // Verify that the user is an admin
      if (!decoded.role || !['ADMIN', 'SUPER_ADMIN'].includes(decoded.role)) {
        return NextResponse.json(
          { error: 'Unauthorized - Admin privileges required' },
          { status: 403 }
        )
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    // Get booking data from request body
    const data = await request.json()
    const { id, status } = data
    
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    if (!status || !['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(status.toUpperCase())) {
      return NextResponse.json(
        { error: 'Valid status is required (PENDING, CONFIRMED, COMPLETED, CANCELLED)' },
        { status: 400 }
      )
    }
    
    // Update booking status
    const booking = await prisma.booking.update({
      where: { id },
      data: { status: status.toUpperCase() as any },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        car: {
          select: {
            id: true,
            name: true,
            brand: true,
            model: true
          }
        }
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking
    })
  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating booking status' },
      { status: 500 }
    )
  }
} 