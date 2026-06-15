import type { DriverDashboardDto, DriverHistoryItemDto } from '@autohub/shared';

import { api } from '@/api/client';

export async function getDriverDashboard(): Promise<DriverDashboardDto> {
  const res = await api.get<DriverDashboardDto>('/driver/dashboard');
  return res.data;
}

export async function getDriverHistory(): Promise<DriverHistoryItemDto[]> {
  const res = await api.get<DriverHistoryItemDto[]>('/driver/history');
  return res.data;
}
