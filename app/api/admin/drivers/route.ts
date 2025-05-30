import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// GET - Get all drivers
export async function GET(request: NextRequest) {
  try {
    // Get all drivers, ordered by creation date (newest first)
    const drivers = await prisma.$queryRaw`
      SELECT * FROM "Driver" 
      ORDER BY "createdAt" DESC
    `;
    
    return NextResponse.json({ drivers })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching drivers' },
      { status: 500 }
    )
  }
}

// POST - Create a new driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'nationality', 'licenseNumber', 'age', 'languages', 'pricePerDay']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Create the driver using raw SQL
    const result = await prisma.$executeRaw`
      INSERT INTO "Driver" (
        id, name, nationality, "licenseNumber", age, languages, 
        "pricePerDay", "pricePerWeek", "pricePerMonth", photo, availability, 
        "createdAt", "updatedAt"
      ) VALUES (
        ${crypto.randomUUID()}, ${body.name}, ${body.nationality}, ${body.licenseNumber}, 
        ${body.age}, ${body.languages}::text[], ${body.pricePerDay}, 
        ${body.pricePerWeek || null}, ${body.pricePerMonth || null}, 
        ${body.photo || null}, ${body.availability !== undefined ? body.availability : true},
        NOW(), NOW()
      )
      RETURNING *
    `;
    
    // Get the newly created driver
    const driver = await prisma.$queryRaw`
      SELECT * FROM "Driver" 
      WHERE "licenseNumber" = ${body.licenseNumber} 
      LIMIT 1
    `;
    
    return NextResponse.json({ driver: driver[0] }, { status: 201 })
  } catch (error) {
    console.error('Error creating driver:', error)
    
    // Handle unique constraint violation
    const knownError = error as Error;
    if (knownError.message?.includes('duplicate key value violates unique constraint')) {
      return NextResponse.json(
        { error: `A driver with this license number already exists` },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'An error occurred while creating the driver' },
      { status: 500 }
    )
  }
} 