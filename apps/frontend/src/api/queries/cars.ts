import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCar,
  getCars,
  updateCar,
  type CreateCarInput,
  type UpdateCarInput,
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

export function useUpdateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      carId,
      input,
    }: {
      carId: string;
      input: UpdateCarInput;
    }) => updateCar(carId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: carsQueryKeys.list });
    },
  });
}
