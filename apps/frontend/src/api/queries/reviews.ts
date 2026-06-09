import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateReviewBody } from '@autohub/shared';

import { createReview } from '@/api/modules/reviews';
import { driverQueryKeys } from '@/api/queries/driver';

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateReviewBody) => createReview(body),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: driverQueryKeys.history });
      void queryClient.invalidateQueries({
        queryKey: ['services', 'reviews'],
      });
    },
  });
}
