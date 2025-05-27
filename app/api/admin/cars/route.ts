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
    const type = url.searchParams.get('type') || ''
    const status = url.searchParams.get('status') || ''
    const sortBy = url.searchParams.get('sortBy') || 'newest'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Build the query
    const whereClause: any = {}
    
    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add type filter
    if (type && type !== 'all') {
      whereClause.type = type
    }
    
    // Add availability filter
    if (status === 'available') {
      whereClause.availability = true
    } else if (status === 'unavailable') {
      whereClause.availability = false
    }
    
    // Determine sort order
    let orderBy: any = { createdAt: 'desc' }
    
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price-high':
        orderBy = { pricePerDay: 'desc' }
        break
      case 'price-low':
        orderBy = { pricePerDay: 'asc' }
        break
      case 'name-asc':
        orderBy = { name: 'asc' }
        break
      case 'name-desc':
        orderBy = { name: 'desc' }
        break
    }
    
    // Query cars from database with pagination
    const [cars, totalCount] = await Promise.all([
      prisma.car.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: orderBy,
        include: {
          _count: {
            select: { bookings: true }
          }
        }
      }),
      prisma.car.count({
        where: whereClause
      })
    ])
    
    // Transform data to match UI expectations
    const formattedCars = cars.map(car => ({
      id: car.id,
      make: car.brand,
      model: car.model,
      name: car.name,
      year: car.year,
      category: car.type,
      dailyRate: Number(car.pricePerDay),
      status: car.availability ? 'available' : 'unavailable',
      image: car.image || 'https://via.placeholder.com/400x225?text=No+Image',
      description: car.description || '',
      features: [
        car.transmission,
        car.fuelType,
        `${car.seats} Seats`,
        car.color
      ],
      addedDate: car.createdAt.toISOString().split('T')[0],
      bookingCount: car._count.bookings
    }))
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      cars: formattedCars,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error fetching cars for admin:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching cars' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    
    // Get car data from request body
    const carData = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'brand', 'model', 'year', 'type', 'pricePerDay']
    for (const field of requiredFields) {
      if (!carData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Create car in database
    const car = await prisma.car.create({
      data: {
        name: carData.name,
        brand: carData.brand,
        model: carData.model,
        year: parseInt(carData.year),
        type: carData.category || carData.type,
        pricePerDay: parseFloat(carData.dailyRate || carData.pricePerDay),
        color: carData.color || 'Not specified',
        transmission: carData.transmission || 'Automatic',
        fuelType: carData.fuelType || 'Gasoline',
        seats: carData.seats || 5,
        availability: carData.status === 'available',
        image: carData.image || null,
        description: carData.description || null
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Car created successfully',
      car
    })
    
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json(
      { error: 'An error occurred while creating the car' },
      { status: 500 }
    )
  }
} 