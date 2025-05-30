-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "licenseNumber" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "languages" TEXT[],
    "pricePerDay" DECIMAL(65,30) NOT NULL,
    "pricePerWeek" DECIMAL(65,30),
    "pricePerMonth" DECIMAL(65,30),
    "photo" TEXT,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_licenseNumber_key" ON "Driver"("licenseNumber");
