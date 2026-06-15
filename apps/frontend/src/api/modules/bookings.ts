import type { CreateBookingBody } from '@autohub/shared';

import { api } from '@/api/client';

export type BookingDto = {
  id: string;
  userId: string;
  carId: string;
  serviceId: string;
  offeringId: string;
  scheduledAt: string;
  status: string;
  notes: string | null;
};

export async function createBooking(body: CreateBookingBody): Promise<BookingDto> {
  const res = await api.post<BookingDto>('/bookings', body);
  return res.data;
}
