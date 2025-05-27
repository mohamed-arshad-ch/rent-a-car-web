import { PrismaClient } from '../lib/generated/prisma'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const SALT_ROUNDS = 10

// Direct hashPassword implementation in this file
async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

async function main() {
  // Create default admin
  const adminEmail = 'admin@rentacar.com'
  
  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  })
  
  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: await hashPassword('admin123'),
        role: 'ADMIN',
      },
    })
    console.log('Admin user created successfully')
  } else {
    console.log('Admin user already exists')
  }
  
  // Add sample cars if needed
  const carsCount = await prisma.car.count()
  
  if (carsCount === 0) {
    // Add some sample cars
    await prisma.car.createMany({
      data: [
        {
          name: 'Honda City',
          brand: 'Honda',
          type: 'Sedan',
          model: 'City',
          year: 2023,
          color: 'White',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 3500,
          image: '/images/cars/honda-city.jpg',
          description: 'The Honda City is a subcompact car manufactured by Honda.',
        },
        {
          name: 'Toyota Innova',
          brand: 'Toyota',
          type: 'MPV',
          model: 'Innova',
          year: 2022,
          color: 'Silver',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 4500,
          image: '/images/cars/toyota-innova.jpg',
          description: 'The Toyota Innova is a compact MPV manufactured by Toyota.',
        },
        {
          name: 'Hyundai Creta',
          brand: 'Hyundai',
          type: 'SUV',
          model: 'Creta',
          year: 2023,
          color: 'Red',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 4000,
          image: '/images/cars/hyundai-creta.jpg',
          description: 'The Hyundai Creta is a subcompact crossover SUV produced by Hyundai.',
        },
      ],
    })
    console.log('Sample cars added successfully')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 