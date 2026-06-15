import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateBookingBody } from '@autohub/shared';

import { createBooking } from '@/api/modules/bookings';
import { driverQueryKeys } from '@/api/queries/driver';
import { serviceCenterQueryKeys } from '@/api/queries/service-center';

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateBookingBody) => createBooking(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: driverQueryKeys.dashboard });
      void queryClient.invalidateQueries({ queryKey: driverQueryKeys.history });
      void queryClient.invalidateQueries({ queryKey: serviceCenterQueryKeys.all });
    },
  });
}
