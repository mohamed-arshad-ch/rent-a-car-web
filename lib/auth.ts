import bcrypt from 'bcrypt'
import { prisma } from './prisma'

const SALT_ROUNDS = 10

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * User authentication
 */
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) return null

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null

  // Don't return the password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Admin authentication
 */
export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  })

  if (!admin) return null

  const isValid = await verifyPassword(password, admin.password)
  if (!isValid) return null

  // Don't return the password
  const { password: _, ...adminWithoutPassword } = admin
  return adminWithoutPassword
} 