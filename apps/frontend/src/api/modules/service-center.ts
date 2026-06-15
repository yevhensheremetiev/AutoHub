import type {
  BookingStatus,
  ServiceCenterBookingDto,
  ServiceCenterDashboardDto,
  ServiceCenterOfferingDto,
  ServiceCenterProfileDto,
  UpdateBookingStatusBody,
  UpdateOfferingBody,
  UpdateServiceProfileBody,
} from '@autohub/shared';

import { api } from '@/api/client';

export async function getServiceDashboard(): Promise<ServiceCenterDashboardDto> {
  const res = await api.get<ServiceCenterDashboardDto>(
    '/service-center/dashboard',
  );
  return res.data;
}

export async function getServiceProfile(): Promise<ServiceCenterProfileDto> {
  const res = await api.get<ServiceCenterProfileDto>('/service-center/profile');
  return res.data;
}

export async function updateServiceProfile(
  body: UpdateServiceProfileBody,
): Promise<ServiceCenterProfileDto> {
  const res = await api.patch<ServiceCenterProfileDto>(
    '/service-center/profile',
    body,
  );
  return res.data;
}

export async function getServiceOfferings(): Promise<
  ServiceCenterOfferingDto[]
> {
  const res = await api.get<ServiceCenterOfferingDto[]>(
    '/service-center/offerings',
  );
  return res.data;
}

export async function updateServiceOffering(
  offeringId: string,
  body: UpdateOfferingBody,
): Promise<ServiceCenterOfferingDto> {
  const res = await api.patch<ServiceCenterOfferingDto>(
    `/service-center/offerings/${offeringId}`,
    body,
  );
  return res.data;
}

export async function getServiceBookings(
  status?: BookingStatus,
): Promise<ServiceCenterBookingDto[]> {
  const res = await api.get<ServiceCenterBookingDto[]>(
    '/service-center/bookings',
    { params: status ? { status } : undefined },
  );
  return res.data;
}

export async function getServiceBooking(
  bookingId: string,
): Promise<ServiceCenterBookingDto> {
  const res = await api.get<ServiceCenterBookingDto>(
    `/service-center/bookings/${bookingId}`,
  );
  return res.data;
}

export async function updateServiceBookingStatus(
  bookingId: string,
  body: UpdateBookingStatusBody,
): Promise<ServiceCenterBookingDto> {
  const res = await api.patch<ServiceCenterBookingDto>(
    `/service-center/bookings/${bookingId}/status`,
    body,
  );
  return res.data;
}
