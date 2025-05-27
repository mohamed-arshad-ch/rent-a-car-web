import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const type = url.searchParams.get('type') || ''
    const limit = parseInt(url.searchParams.get('limit') || '12')
    
    // Build the query
    const whereClause: any = {
      availability: true
    }
    
    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add type filter
    if (type && type !== 'All Types') {
      whereClause.type = type
    }
    
    // Query cars from database
    const cars = await prisma.car.findMany({
      where: whereClause,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({ cars })
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching cars' },
      { status: 500 }
    )
  }
} 