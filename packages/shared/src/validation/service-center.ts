import { z } from 'zod';

import {
  serviceLocationAreaSchema,
  serviceTypeSchema,
} from './services.js';

export const bookingStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const updateServiceProfileBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  address: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((value) => /^[^,]{2,},\s*[^,]{2,}/.test(value), {
      message: 'Use format: City / town, street',
    }),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  hours: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  serviceType: serviceTypeSchema.optional(),
  locationArea: serviceLocationAreaSchema.optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

export type UpdateServiceProfileBody = z.infer<
  typeof updateServiceProfileBodySchema
>;

export const createOfferingBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  durationMinutes: z.number().int().min(5).max(24 * 60),
  priceUah: z.number().int().min(0).max(1_000_000),
  active: z.boolean().optional().default(true),
});

export type CreateOfferingBody = z.infer<typeof createOfferingBodySchema>;

export const updateOfferingBodySchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .nullable()
    .transform((v) => (v === '' ? null : v)),
  durationMinutes: z.number().int().min(5).max(24 * 60).optional(),
  priceUah: z.number().int().min(0).max(1_000_000).optional(),
  active: z.boolean().optional(),
});

export type UpdateOfferingBody = z.infer<typeof updateOfferingBodySchema>;

export const updateBookingStatusBodySchema = z.object({
  status: bookingStatusSchema,
});

export type UpdateBookingStatusBody = z.infer<
  typeof updateBookingStatusBodySchema
>;

export const listBookingsQuerySchema = z.object({
  status: bookingStatusSchema.optional(),
});

export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;
