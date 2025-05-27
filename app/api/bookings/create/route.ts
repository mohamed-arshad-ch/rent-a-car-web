import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

// Get JWT secret from environment or use fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-jwt-secret-key'

export async function POST(request: NextRequest) {
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
    
    // Parse request body to get booking details
    const body = await request.json()
    const { 
      carId, 
      startDate, 
      endDate, 
      totalPrice,
      pickupLocation,
      returnLocation,
      pickupTime,
      returnTime
    } = body
    
    // Validate required fields
    if (!carId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      )
    }
    
    // Check if car exists and is available
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })
    
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }
    
    if (!car.availability) {
      return NextResponse.json(
        { error: 'Car is not available for booking' },
        { status: 400 }
      )
    }
    
    // Check for overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        carId: carId,
        status: {
          in: ['CONFIRMED', 'PENDING']
        },
        OR: [
          {
            // New booking starts during an existing booking
            startDate: {
              lte: new Date(endDate)
            },
            endDate: {
              gte: new Date(startDate)
            }
          }
        ]
      }
    })
    
    if (overlappingBookings.length > 0) {
      return NextResponse.json(
        { error: 'Car is already booked for the selected dates' },
        { status: 409 }
      )
    }
    
    // Create the booking in the database
    const booking = await prisma.booking.create({
      data: {
        userId: userId,
        carId: carId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: parseFloat(totalPrice.toString()),
        status: 'CONFIRMED'
        // We can't store additional information since the schema doesn't have a metadata field
        // Consider updating the schema to include these fields if needed
      }
    })
    
    // Log additional booking information that isn't stored in the database
    console.log('Additional booking details:', {
      pickupLocation,
      returnLocation,
      pickupTime,
      returnTime
    })
    
    return NextResponse.json({ 
      message: 'Booking created successfully',
      booking: booking
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the booking' },
      { status: 500 }
    )
  }
} 