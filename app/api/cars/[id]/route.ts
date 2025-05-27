import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Fetch car by ID
    const car = await prisma.car.findUnique({
      where: {
        id
      }
    })
    
    // Return 404 if car not found
    if (!car) {
      return NextResponse.json(
        { error: 'Car not found' },
        { status: 404 }
      )
    }
    
    // Return car data
    return NextResponse.json({ car })
  } catch (error) {
    console.error('Error fetching car details:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching car details' },
      { status: 500 }
    )
  }
} 