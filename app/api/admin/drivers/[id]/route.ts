import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get a specific driver by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Fetch driver by ID
    const drivers = await prisma.$queryRaw`
      SELECT * FROM "Driver"
      WHERE id = ${id}
      LIMIT 1
    `;
    
    // If no driver was found
    if (!drivers || !drivers[0]) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }
    
    // Return driver data
    return NextResponse.json({ driver: drivers[0] })
  } catch (error) {
    console.error('Error fetching driver details:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching driver details' },
      { status: 500 }
    )
  }
}

// PUT - Update a driver
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Check if driver exists
    const drivers = await prisma.$queryRaw`
      SELECT * FROM "Driver"
      WHERE id = ${id}
      LIMIT 1
    `;
    
    // If no driver was found
    if (!drivers || !drivers[0]) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }
    
    const existingDriver = drivers[0];
    
    // Update the driver
    await prisma.$executeRaw`
      UPDATE "Driver"
      SET 
        name = ${body.name},
        nationality = ${body.nationality},
        "licenseNumber" = ${body.licenseNumber},
        age = ${body.age},
        languages = ${body.languages}::text[],
        "pricePerDay" = ${body.pricePerDay},
        "pricePerWeek" = ${body.pricePerWeek || null},
        "pricePerMonth" = ${body.pricePerMonth || null},
        photo = ${body.photo || null},
        availability = ${body.availability !== undefined ? body.availability : existingDriver.availability},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;
    
    // Get the updated driver
    const updatedDrivers = await prisma.$queryRaw`
      SELECT * FROM "Driver"
      WHERE id = ${id}
      LIMIT 1
    `;
    
    return NextResponse.json({ driver: updatedDrivers[0] })
  } catch (error) {
    console.error('Error updating driver:', error)
    
    // Handle unique constraint violation
    const knownError = error as Error;
    if (knownError.message?.includes('duplicate key value violates unique constraint')) {
      return NextResponse.json(
        { error: `A driver with this license number already exists` },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'An error occurred while updating the driver' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a driver
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Check if driver exists
    const drivers = await prisma.$queryRaw`
      SELECT * FROM "Driver"
      WHERE id = ${id}
      LIMIT 1
    `;
    
    // If no driver was found
    if (!drivers || !drivers[0]) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }
    
    // Delete the driver
    await prisma.$executeRaw`
      DELETE FROM "Driver"
      WHERE id = ${id}
    `;
    
    return NextResponse.json({ message: 'Driver deleted successfully' })
  } catch (error) {
    console.error('Error deleting driver:', error)
    return NextResponse.json(
      { error: 'An error occurred while deleting the driver' },
      { status: 500 }
    )
  }
}

// PATCH - Update driver availability
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    
    // Check if availability is provided
    if (body.availability === undefined) {
      return NextResponse.json(
        { error: 'Availability status is required' },
        { status: 400 }
      )
    }
    
    // Check if driver exists
    const drivers = await prisma.$queryRaw`
      SELECT * FROM "Driver"
      WHERE id = ${id}
      LIMIT 1
    `;
    
    // If no driver was found
    if (!drivers || !drivers[0]) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }
    
    // Update driver availability
    await prisma.$executeRaw`
      UPDATE "Driver"
      SET 
        availability = ${body.availability},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;
    
    // Get the updated driver
    const updatedDrivers = await prisma.$queryRaw`
      SELECT * FROM "Driver"
      WHERE id = ${id}
      LIMIT 1
    `;
    
    return NextResponse.json({ driver: updatedDrivers[0] })
  } catch (error) {
    console.error('Error updating driver availability:', error)
    return NextResponse.json(
      { error: 'An error occurred while updating driver availability' },
      { status: 500 }
    )
  }
} 