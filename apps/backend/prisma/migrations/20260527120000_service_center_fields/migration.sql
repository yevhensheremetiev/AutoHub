-- AlterTable
ALTER TABLE "services" ADD COLUMN "phone" TEXT;
ALTER TABLE "services" ADD COLUMN "hours" TEXT;

-- AlterTable
ALTER TABLE "offerings" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "workResult" TEXT;
