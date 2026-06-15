import type { ServiceLocationArea, ServiceType } from '@autohub/shared';

export const SERVICE_TYPE_FILTERS: {
  id: ServiceType | 'all';
  labelKey: string;
}[] = [
  { id: 'all', labelKey: 'driver.filters.allTypes' },
  { id: 'wash', labelKey: 'driver.serviceTypes.wash' },
  { id: 'repair', labelKey: 'driver.serviceTypes.repair' },
  { id: 'tire', labelKey: 'driver.serviceTypes.tire' },
  { id: 'diagnostic', labelKey: 'driver.serviceTypes.diagnostic' },
];

export const SERVICE_LOCATION_FILTERS: {
  id: ServiceLocationArea | 'all';
  labelKey: string;
}[] = [
  { id: 'all', labelKey: 'driver.filters.allLocations' },
  { id: 'center', labelKey: 'driver.locations.center' },
  { id: 'left-bank', labelKey: 'driver.locations.leftBank' },
  { id: 'right-bank', labelKey: 'driver.locations.rightBank' },
];

export const LOCATION_LABEL_KEYS: Record<ServiceLocationArea, string> = {
  center: 'driver.locations.center',
  'left-bank': 'driver.locations.leftBank',
  'right-bank': 'driver.locations.rightBank',
};
