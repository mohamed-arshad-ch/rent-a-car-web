const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample driver data
const driversSeedData = [
  {
    name: "John Smith",
    nationality: "American",
    licenseNumber: "DL-123456",
    age: 35,
    languages: ["English", "Spanish"],
    pricePerDay: 80,
    pricePerWeek: 500,
    pricePerMonth: 1800,
    photo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    availability: true,
  },
  {
    name: "Emma Johnson",
    nationality: "British",
    licenseNumber: "UK-789123",
    age: 29,
    languages: ["English", "French"],
    pricePerDay: 75,
    pricePerWeek: 480,
    pricePerMonth: 1700,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    availability: true,
  },
  {
    name: "Carlos Rodriguez",
    nationality: "Spanish",
    licenseNumber: "ESP-45678",
    age: 32,
    languages: ["Spanish", "English", "Portuguese"],
    pricePerDay: 70,
    pricePerWeek: 450,
    pricePerMonth: 1600,
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    availability: true,
  },
  {
    name: "Hiroshi Tanaka",
    nationality: "Japanese",
    licenseNumber: "JP-98765",
    age: 38,
    languages: ["Japanese", "English"],
    pricePerDay: 85,
    pricePerWeek: 550,
    pricePerMonth: 2000,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    availability: true,
  },
  {
    name: "Sophie Dubois",
    nationality: "French",
    licenseNumber: "FR-24680",
    age: 31,
    languages: ["French", "English", "German"],
    pricePerDay: 78,
    pricePerWeek: 490,
    pricePerMonth: 1750,
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    availability: true,
  }
];

async function main() {
  console.log('Starting to seed drivers...');
  
  try {
    // Create drivers one by one using raw SQL to avoid Prisma client issues
    for (const driver of driversSeedData) {
      await prisma.$executeRaw`
        INSERT INTO "Driver" (
          id, name, nationality, "licenseNumber", age, languages, 
          "pricePerDay", "pricePerWeek", "pricePerMonth", photo, availability, 
          "createdAt", "updatedAt"
        ) VALUES (
          ${crypto.randomUUID()}, ${driver.name}, ${driver.nationality}, ${driver.licenseNumber}, 
          ${driver.age}, ${driver.languages}::text[], ${driver.pricePerDay}, 
          ${driver.pricePerWeek}, ${driver.pricePerMonth}, 
          ${driver.photo}, ${driver.availability},
          NOW(), NOW()
        )
        ON CONFLICT ("licenseNumber") DO NOTHING
      `;
      
      console.log(`Added driver: ${driver.name}`);
    }
    
    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding drivers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 