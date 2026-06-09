import { z } from 'zod';

export const serviceTypeSchema = z.enum([
  'wash',
  'repair',
  'tire',
  'diagnostic',
]);

export const serviceLocationAreaSchema = z.enum([
  'center',
  'left-bank',
  'right-bank',
]);

export type ServiceTypeId = z.infer<typeof serviceTypeSchema>;
export type ServiceLocationAreaId = z.infer<typeof serviceLocationAreaSchema>;

export const listServicesQuerySchema = z.object({
  type: serviceTypeSchema.optional(),
  locationArea: serviceLocationAreaSchema.optional(),
});

export type ListServicesQuery = z.infer<typeof listServicesQuerySchema>;

export const bookingTimeSlotsQuerySchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be yyyy-mm-dd'),
});

export type BookingTimeSlotsQuery = z.infer<typeof bookingTimeSlotsQuerySchema>;
