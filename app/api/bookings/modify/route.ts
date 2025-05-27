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
    const { bookingId, startDate, endDate, totalPrice } = body
    
    if (!bookingId) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }
    
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start date and end date are required' },
        { status: 400 }
      )
    }
    
    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }
    
    // Verify that the booking belongs to the authenticated user
    if (booking.userId !== userId) {
      return NextResponse.json(
        { error: 'You are not authorized to modify this booking' },
        { status: 403 }
      )
    }
    
    // Ensure the booking can be modified (only upcoming bookings)
    const currentDate = new Date()
    const bookingStartDate = new Date(booking.startDate)
    
    if (bookingStartDate <= currentDate) {
      return NextResponse.json(
        { error: 'Only upcoming bookings can be modified' },
        { status: 400 }
      )
    }
    
    // Update the booking
    const updateData: any = {
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    }
    
    // Only update total price if provided
    if (totalPrice !== undefined) {
      updateData.totalPrice = totalPrice
    }
    
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: updateData
    })
    
    return NextResponse.json({ 
      message: 'Booking modified successfully',
      booking: updatedBooking 
    })
  } catch (error) {
    console.error('Error modifying booking:', error)
    return NextResponse.json(
      { error: 'An error occurred while modifying the booking' },
      { status: 500 }
    )
  }
} 