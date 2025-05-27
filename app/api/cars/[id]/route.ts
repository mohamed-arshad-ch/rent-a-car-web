import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const carId = params.id
    
    if (!carId) {
      return NextResponse.json(
        { error: 'Car ID is required' }, 
        { status: 400 }
      )
    }
    
    // Fetch car details from database
    const car = await prisma.car.findUnique({
      where: { id: carId }
    })
    
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json({ car })
  } catch (error) {
    console.error('Error fetching car details:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching car details' }, 
      { status: 500 }
    )
  }
} 