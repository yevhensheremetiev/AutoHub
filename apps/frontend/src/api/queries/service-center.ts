import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { BookingStatus } from '@autohub/shared';
import type {
  UpdateBookingStatusBody,
  UpdateOfferingBody,
  UpdateServiceProfileBody,
} from '@autohub/shared';

import {
  getServiceBooking,
  getServiceBookings,
  getServiceDashboard,
  getServiceOfferings,
  getServiceProfile,
  updateServiceBookingStatus,
  updateServiceOffering,
  updateServiceProfile,
} from '@/api/modules/service-center';

export const serviceCenterQueryKeys = {
  all: ['service-center'] as const,
  dashboard: ['service-center', 'dashboard'] as const,
  profile: ['service-center', 'profile'] as const,
  offerings: ['service-center', 'offerings'] as const,
  bookings: (status?: BookingStatus) =>
    ['service-center', 'bookings', status ?? 'all'] as const,
  booking: (id: string) => ['service-center', 'booking', id] as const,
};

export function useServiceDashboard() {
  return useQuery({
    queryKey: serviceCenterQueryKeys.dashboard,
    queryFn: getServiceDashboard,
  });
}

export function useServiceProfile() {
  return useQuery({
    queryKey: serviceCenterQueryKeys.profile,
    queryFn: getServiceProfile,
  });
}

export function useUpdateServiceProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateServiceProfileBody) => updateServiceProfile(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: serviceCenterQueryKeys.profile,
      });
    },
  });
}

export function useServiceOfferings() {
  return useQuery({
    queryKey: serviceCenterQueryKeys.offerings,
    queryFn: getServiceOfferings,
  });
}

export function useUpdateServiceOffering() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      offeringId,
      body,
    }: {
      offeringId: string;
      body: UpdateOfferingBody;
    }) => updateServiceOffering(offeringId, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: serviceCenterQueryKeys.offerings,
      });
    },
  });
}

export function useServiceBookings(status?: BookingStatus) {
  return useQuery({
    queryKey: serviceCenterQueryKeys.bookings(status),
    queryFn: () => getServiceBookings(status),
  });
}

export function useServiceBooking(bookingId: string | undefined) {
  return useQuery({
    queryKey: serviceCenterQueryKeys.booking(bookingId ?? ''),
    queryFn: () => getServiceBooking(bookingId!),
    enabled: Boolean(bookingId),
  });
}

export function useUpdateServiceBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      bookingId,
      body,
    }: {
      bookingId: string;
      body: UpdateBookingStatusBody;
    }) => updateServiceBookingStatus(bookingId, body),
    onSuccess: (booking) => {
      void queryClient.invalidateQueries({
        queryKey: serviceCenterQueryKeys.all,
      });
      queryClient.setQueryData(
        serviceCenterQueryKeys.booking(booking.id),
        booking,
      );
    },
  });
}
