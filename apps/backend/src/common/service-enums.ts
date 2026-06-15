import type {
  ServiceLocationArea,
  ServiceType,
} from '@autohub/shared';
import type {
  ServiceLocationArea as PrismaLocationArea,
  ServiceType as PrismaServiceType,
} from '@prisma/client';

const SERVICE_TYPE_TO_API: Record<PrismaServiceType, ServiceType> = {
  WASH: 'wash',
  REPAIR: 'repair',
  TIRE: 'tire',
  DIAGNOSTIC: 'diagnostic',
};

const SERVICE_TYPE_TO_PRISMA: Record<ServiceType, PrismaServiceType> = {
  wash: 'WASH',
  repair: 'REPAIR',
  tire: 'TIRE',
  diagnostic: 'DIAGNOSTIC',
};

const LOCATION_TO_API: Record<PrismaLocationArea, ServiceLocationArea> = {
  CENTER: 'center',
  LEFT_BANK: 'left-bank',
  RIGHT_BANK: 'right-bank',
};

const LOCATION_TO_PRISMA: Record<ServiceLocationArea, PrismaLocationArea> = {
  center: 'CENTER',
  'left-bank': 'LEFT_BANK',
  'right-bank': 'RIGHT_BANK',
};

export function toApiServiceType(
  value: PrismaServiceType | null,
): ServiceType | null {
  if (!value) return null;
  return SERVICE_TYPE_TO_API[value];
}

export function toPrismaServiceType(
  value: ServiceType,
): PrismaServiceType {
  return SERVICE_TYPE_TO_PRISMA[value];
}

export function toApiLocationArea(
  value: PrismaLocationArea | null,
): ServiceLocationArea | null {
  if (!value) return null;
  return LOCATION_TO_API[value];
}

export function toPrismaLocationArea(
  value: ServiceLocationArea,
): PrismaLocationArea {
  return LOCATION_TO_PRISMA[value];
}
