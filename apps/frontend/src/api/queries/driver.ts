import { useQuery } from '@tanstack/react-query';

import { getDriverDashboard, getDriverHistory } from '@/api/modules/driver';

export const driverQueryKeys = {
  dashboard: ['driver', 'dashboard'] as const,
  history: ['driver', 'history'] as const,
};

export function useDriverDashboard() {
  return useQuery({
    queryKey: driverQueryKeys.dashboard,
    queryFn: getDriverDashboard,
  });
}

export function useDriverHistory() {
  return useQuery({
    queryKey: driverQueryKeys.history,
    queryFn: getDriverHistory,
  });
}
