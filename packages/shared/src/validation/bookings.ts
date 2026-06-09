import { z } from 'zod';

export const createBookingBodySchema = z.object({
  serviceId: z.string().trim().min(1),
  offeringId: z.string().trim().min(1),
  carId: z.string().trim().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be yyyy-mm-dd'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm'),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
});

export type CreateBookingBody = z.infer<typeof createBookingBodySchema>;
