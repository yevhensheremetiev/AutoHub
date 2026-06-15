-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('WASH', 'REPAIR', 'TIRE', 'DIAGNOSTIC');

-- CreateEnum
CREATE TYPE "ServiceLocationArea" AS ENUM ('CENTER', 'LEFT_BANK', 'RIGHT_BANK');

-- AlterTable
ALTER TABLE "services" ADD COLUMN "serviceType" "ServiceType";
ALTER TABLE "services" ADD COLUMN "locationArea" "ServiceLocationArea";
ALTER TABLE "services" ADD COLUMN "lat" DOUBLE PRECISION;
ALTER TABLE "services" ADD COLUMN "lng" DOUBLE PRECISION;
