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
    
    // Fetch user data
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        createdAt: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Format the createdAt date to get "month year" for "member since"
    const createdAt = new Date(user.createdAt)
    const memberSince = createdAt.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    return NextResponse.json({
      profile: {
        ...user,
        memberSince
      }
    })
    
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'An error occurred while fetching user profile' },
      { status: 500 }
    )
  }
} 