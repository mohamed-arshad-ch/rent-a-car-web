import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Get JWT secret from environment or use fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-jwt-secret-key'

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const token = request.headers.get('Authorization')?.split('Bearer ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }
    
    // Verify token and extract admin ID
    let adminId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string, role: string }
      adminId = decoded.id
      
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
    
    // Fetch dashboard statistics
    const [
      totalCars,
      totalUsers,
      totalBookings,
      activeBookings,
      recentBookings,
      topPerformingCars
    ] = await Promise.all([
      // Count total cars
      prisma.car.count(),
      
      // Count total users
      prisma.user.count(),
      
      // Count total bookings
      prisma.booking.count(),
      
      // Count active bookings
      prisma.booking.count({
        where: {
          status: 'CONFIRMED',
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      }),
      
      // Get recent bookings with user and car details
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
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
              image: true
            }
          }
        }
      }),
      
      // Get top performing cars based on booking count
      prisma.car.findMany({
        take: 4,
        include: {
          _count: {
            select: { bookings: true }
          },
          bookings: {
            select: {
              totalPrice: true
            }
          }
        },
        orderBy: {
          bookings: {
            _count: 'desc'
          }
        }
      })
    ])
    
    // Calculate total revenue (sum of all booking totalPrice)
    const allBookings = await prisma.booking.findMany({
      select: {
        totalPrice: true
      }
    })
    
    const totalRevenue = allBookings.reduce((sum, booking) => 
      sum + Number(booking.totalPrice), 0
    )
    
    // Format top performing cars with booking count and revenue
    const formattedTopCars = topPerformingCars.map(car => {
      const bookingCount = car._count.bookings
      const revenue = car.bookings.reduce((sum, booking) => 
        sum + Number(booking.totalPrice), 0
      )
      
      return {
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        image: car.image,
        bookings: bookingCount,
        revenue: revenue.toFixed(2)
      }
    })
    
    // Return dashboard data
    return NextResponse.json({
      stats: {
        totalCars,
        totalUsers,
        totalBookings,
        activeBookings,
        totalRevenue: totalRevenue.toFixed(2)
      },
      recentBookings: recentBookings.map(booking => ({
        id: booking.id,
        user: {
          id: booking.user.id,
          name: booking.user.name,
          email: booking.user.email
        },
        car: {
          id: booking.car.id,
          name: booking.car.name,
          image: booking.car.image
        },
        startDate: booking.startDate,
        endDate: booking.endDate,
        status: booking.status,
        totalPrice: booking.totalPrice
      })),
      topPerformingCars: formattedTopCars
    })
    
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching dashboard data' },
      { status: 500 }
    )
  }
} 