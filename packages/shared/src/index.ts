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
  /** Cached average from reviews for this offering only; null when no reviews. */
  ratingAvg: number | null;
  ratingCount: number;
};

export * from './validation/index.js';
