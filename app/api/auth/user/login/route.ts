import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'
import jwt from 'jsonwebtoken'

// Get JWT secret from environment or use a fallback (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-jwt-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({ 
      user,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
} 