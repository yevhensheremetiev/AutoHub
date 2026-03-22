import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';

export type MeResponse = {
  id: string;
  email: string | null;
  name: string | null;
};

export type Car = {
  id: string;
  userId: string;
  make: string;
  model: string;
  year?: number | null;
  vin?: string | null;
};

export type CreateCarInput = {
  make: string;
  model: string;
  year?: number;
  vin?: string;
};

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get<MeResponse>('/auth/me');
      return res.data;
    },
  });
}

export function useCars() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: async () => {
      const res = await api.get<Car[]>('/cars');
      return res.data;
    },
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCarInput) => {
      const res = await api.post<Car>('/cars', input);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}
