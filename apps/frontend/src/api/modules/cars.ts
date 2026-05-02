import type { CarDto } from '@autohub/shared';

import { api } from '@/api/client';

export type CreateCarInput = {
  make: string;
  model: string;
  year?: number;
  licensePlate: string;
  vin?: string;
};

export async function getCars(): Promise<CarDto[]> {
  const res = await api.get<CarDto[]>('/cars');
  return res.data;
}

export async function createCar(input: CreateCarInput): Promise<CarDto> {
  const res = await api.post<CarDto>('/cars', input);
  return res.data;
}
