import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCar,
  getCars,
  type CreateCarInput,
} from '@/api/modules/cars';

export const carsQueryKeys = {
  list: ['cars'] as const,
};

export function useCars() {
  return useQuery({
    queryKey: carsQueryKeys.list,
    queryFn: getCars,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCarInput) => createCar(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: carsQueryKeys.list });
    },
  });
}
