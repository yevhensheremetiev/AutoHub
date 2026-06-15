import type {
  ListServicesQuery,
  PublicServiceDetailDto,
  PublicServiceListItemDto,
  ReviewListItemDto,
} from '@autohub/shared';

import { api } from '@/api/client';

export async function listServices(
  params?: ListServicesQuery,
): Promise<PublicServiceListItemDto[]> {
  const res = await api.get<PublicServiceListItemDto[]>('/services', {
    params,
  });
  return res.data;
}

export async function getService(
  serviceId: string,
): Promise<PublicServiceDetailDto> {
  const res = await api.get<PublicServiceDetailDto>(`/services/${serviceId}`);
  return res.data;
}

export async function getServiceReviews(
  serviceId: string,
): Promise<ReviewListItemDto[]> {
  const res = await api.get<ReviewListItemDto[]>(
    `/services/${serviceId}/reviews`,
  );
  return res.data;
}

export async function getBookingTimeSlots(
  date: string,
): Promise<{ slots: string[] }> {
  const res = await api.get<{ slots: string[] }>('/services/time-slots', {
    params: { date },
  });
  return res.data;
}
