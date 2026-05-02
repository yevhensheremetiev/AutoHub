-- AlterTable
ALTER TABLE "cars" ADD COLUMN "licensePlate" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "cars_userId_licensePlate_key" ON "cars"("userId", "licensePlate");
