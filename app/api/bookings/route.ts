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
    
    // Verify token and extract user ID
    let userId: string
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      userId = decoded.id
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }
    
    // Query bookings for this user
    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId
      },
      include: {
        car: true // Include car details with each booking
      },
      orderBy: {
        startDate: 'desc' // Most recent bookings first
      }
    })
    
    // Determine booking status based on dates
    const currentDate = new Date()
    const processedBookings = bookings.map(booking => {
      const startDate = new Date(booking.startDate)
      const endDate = new Date(booking.endDate)
      
      let status = booking.status
      // Override database status with dynamic status based on current date
      if (status === 'CONFIRMED') {
        if (currentDate < startDate) {
          status = 'PENDING' // Using PENDING for upcoming bookings
        } else if (currentDate >= startDate && currentDate <= endDate) {
          status = 'CONFIRMED' // Keep as CONFIRMED for active bookings
        } else if (currentDate > endDate) {
          status = 'COMPLETED'
        }
      }
      
      // Create a display status for UI purposes
      const displayStatus = 
        status === 'PENDING' ? 'upcoming' :
        status === 'CONFIRMED' ? 'active' :
        status === 'COMPLETED' ? 'completed' : 'cancelled';
      
      return {
        ...booking,
        status,
        displayStatus
      }
    })
    
    return NextResponse.json({ bookings: processedBookings })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching bookings' },
      { status: 500 }
    )
  }
} 