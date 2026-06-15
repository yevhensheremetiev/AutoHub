import { useQuery } from '@tanstack/react-query';
import type { ListServicesQuery } from '@autohub/shared';

import {
  getBookingTimeSlots,
  getService,
  getServiceReviews,
  listServices,
} from '@/api/modules/services';

export const servicesQueryKeys = {
  all: ['services'] as const,
  list: (params?: ListServicesQuery) =>
    ['services', 'list', params ?? {}] as const,
  detail: (id: string) => ['services', 'detail', id] as const,
  reviews: (id: string) => ['services', 'reviews', id] as const,
  timeSlots: (date: string) => ['services', 'time-slots', date] as const,
};

export function useServices(params?: ListServicesQuery) {
  return useQuery({
    queryKey: servicesQueryKeys.list(params),
    queryFn: () => listServices(params),
  });
}

export function useService(serviceId: string | undefined) {
  return useQuery({
    queryKey: servicesQueryKeys.detail(serviceId ?? ''),
    queryFn: () => getService(serviceId!),
    enabled: Boolean(serviceId),
  });
}

export function useServiceReviews(serviceId: string | undefined) {
  return useQuery({
    queryKey: servicesQueryKeys.reviews(serviceId ?? ''),
    queryFn: () => getServiceReviews(serviceId!),
    enabled: Boolean(serviceId),
  });
}

export function useBookingTimeSlots(date: string) {
  return useQuery({
    queryKey: servicesQueryKeys.timeSlots(date),
    queryFn: () => getBookingTimeSlots(date),
    enabled: Boolean(date),
  });
}
