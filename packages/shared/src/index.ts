import type { BookingStatus } from './validation/service-center.js';

export type { BookingStatus } from './validation/service-center.js';

export type Brand<K, T> = K & { __brand: T };

export type UserDto = {
  id: string;
  email: string | null;
  name: string | null;
  /** True when the account has an email/password hash (not Google-only). */
  passwordSignInEnabled: boolean;
  accountType: 'DRIVER' | 'SERVICE';
  serviceId: string | null;
};

export type CarDto = {
  id: string;
  userId: string;
  make: string;
  model: string;
  year?: number | null;
  /** Registration / license plate number. */
  licensePlate?: string | null;
  vin?: string | null;
};

export type ServiceDto = {
  id: string;
  name: string;
  address: string;
  /** Cached average from all reviews at this service; null when no reviews. */
  ratingAvg: number | null;
  ratingCount: number;
};

export type OfferingDto = {
  id: string;
  serviceId: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  priceUah: number;
  active?: boolean;
  /** Cached average from reviews for this offering only; null when no reviews. */
  ratingAvg: number | null;
  ratingCount: number;
};

export type ServiceCenterProfileDto = ServiceDto & {
  phone: string | null;
  hours: string | null;
  serviceType: ServiceType | null;
  locationArea: ServiceLocationArea | null;
  lat: number | null;
  lng: number | null;
};

export type ServiceType =
  | 'wash'
  | 'repair'
  | 'tire'
  | 'diagnostic';

export type ServiceLocationArea =
  | 'center'
  | 'left-bank'
  | 'right-bank';

export type PublicOfferingDto = {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  priceUah: number;
};

export type PublicServiceListItemDto = {
  id: string;
  name: string;
  address: string;
  serviceType: ServiceType;
  locationArea: ServiceLocationArea;
  lat: number;
  lng: number;
  ratingAvg: number | null;
  ratingCount: number;
};

export type PublicServiceDetailDto = PublicServiceListItemDto & {
  phone: string | null;
  hours: string | null;
  offerings: PublicOfferingDto[];
};

export type ReviewListItemDto = {
  id: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  authorName: string;
  createdAt: string;
};

export type DriverBookingSummaryDto = {
  id: string;
  scheduledAt: string;
  status: BookingStatus;
  serviceId: string;
  serviceName: string;
  offeringName: string;
  carLabel: string;
  priceUah: number;
};

export type DriverDashboardDto = {
  metrics: {
    visitsThisYear: number;
    spentThisYearUah: number;
    carsCount: number;
  };
  upcomingBookings: DriverBookingSummaryDto[];
};

export type DriverHistoryItemDto = DriverBookingSummaryDto & {
  hasReview: boolean;
  review: ReviewListItemDto | null;
};

export const BOOKING_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
] as const;

export type ServiceCenterOfferingDto = OfferingDto & {
  active: boolean;
};

export type ServiceCenterBookingDto = {
  id: string;
  status: BookingStatus;
  scheduledAt: string;
  notes: string | null;
  clientName: string;
  clientEmail: string | null;
  carLabel: string;
  offeringId: string;
  offeringName: string;
};

export type ServiceCenterDashboardDto = {
  metrics: {
    todayCount: number;
    weekCount: number;
    ratingAvg: number | null;
  };
  todayBookings: ServiceCenterBookingDto[];
};

export * from './validation/index.js';
