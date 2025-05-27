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
    const status = url.searchParams.get('status') || 'all'
    const dateFilter = url.searchParams.get('dateFilter') || 'all'
    const fromDate = url.searchParams.get('fromDate') || ''
    const toDate = url.searchParams.get('toDate') || ''
    const sortBy = url.searchParams.get('sortBy') || 'newest'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const skip = (page - 1) * limit
    
    // Build the where clause for filtering
    const whereClause: any = {}
    
    // Search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Date filter
    if (dateFilter === '7days') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      whereClause.createdAt = { gte: sevenDaysAgo }
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      whereClause.createdAt = { gte: thirtyDaysAgo }
    } else if (dateFilter === 'custom' && fromDate) {
      whereClause.createdAt = {}
      if (fromDate) {
        whereClause.createdAt.gte = new Date(fromDate)
      }
      if (toDate) {
        whereClause.createdAt.lte = new Date(toDate)
      }
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
      case 'a-z':
        orderBy = { name: 'asc' }
        break
      case 'z-a':
        orderBy = { name: 'desc' }
        break
    }
    
    // Query users from database with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
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
      prisma.user.count({
        where: whereClause
      })
    ])
    
    // Format the user data
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || 'Not provided',
      registrationDate: user.createdAt,
      status: 'active', // Default status as schema doesn't have status field
      bookingCount: user._count.bookings
    }))
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit)
    
    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    )
  }
} 