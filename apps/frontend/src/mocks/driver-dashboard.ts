export type ServiceTypeId = "wash" | "repair" | "tire" | "diagnostic";

export type MockServiceOffering = {
  id: string;
  nameKey: string;
  durationMin: number;
  priceUah: number;
};

export type MockServiceStation = {
  id: string;
  nameKey: string;
  addressKey: string;
  type: ServiceTypeId;
  locationKey: string;
  rating: number;
  /** WGS84 approximate coordinates (Kyiv area) */
  lat: number;
  lng: number;
  offerings: MockServiceOffering[];
};

export type MockCar = {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
};

export type MockHistoryItem = {
  id: string;
  /** ISO date (yyyy-mm-dd), must be in the past relative to mock "today" */
  date: string;
  stationId: string;
  stationNameKey: string;
  serviceNameKey: string;
  carId: string;
  priceUah: number;
  statusKey: string;
};

/** Fixed reference date for mock timeline consistency (dashboard "today") */
export const MOCK_TODAY = "2026-05-19";

export function getCarLabel(carId: string): string {
  const car = MOCK_DRIVER_CARS.find((c) => c.id === carId);
  return car ? `${car.make} ${car.model}` : carId;
}

export type MockDashboardMetric = {
  id: string;
  value: string;
  labelKey: string;
};

export type MockUpcomingBooking = {
  id: string;
  stationId: string;
  stationNameKey: string;
  serviceNameKey: string;
  /** ISO date (yyyy-mm-dd) */
  date: string;
  time: string;
  carLabel: string;
};

export const MOCK_SERVICE_TYPES: {
  id: ServiceTypeId | "all";
  labelKey: string;
}[] = [
  { id: "all", labelKey: "driver.filters.allTypes" },
  { id: "wash", labelKey: "driver.serviceTypes.wash" },
  { id: "repair", labelKey: "driver.serviceTypes.repair" },
  { id: "tire", labelKey: "driver.serviceTypes.tire" },
  { id: "diagnostic", labelKey: "driver.serviceTypes.diagnostic" },
];

export const MOCK_LOCATIONS: { id: string; labelKey: string }[] = [
  { id: "all", labelKey: "driver.filters.allLocations" },
  { id: "center", labelKey: "driver.locations.center" },
  { id: "left-bank", labelKey: "driver.locations.leftBank" },
  { id: "right-bank", labelKey: "driver.locations.rightBank" },
];

export const MOCK_SERVICE_STATIONS: MockServiceStation[] = [
  {
    id: "station-1",
    nameKey: "driver.catalog.stations.sparkWash",
    addressKey: "driver.catalog.addresses.khreshchatyk",
    type: "wash",
    locationKey: "center",
    rating: 4.8,
    lat: 50.4478,
    lng: 30.5229,
    offerings: [
      {
        id: "s1-complex",
        nameKey: "driver.catalog.offerings.complexWash",
        durationMin: 45,
        priceUah: 650,
      },
      {
        id: "s1-interior",
        nameKey: "driver.catalog.offerings.interior",
        durationMin: 60,
        priceUah: 900,
      },
    ],
  },
  {
    id: "station-2",
    nameKey: "driver.catalog.stations.autoDoc",
    addressKey: "driver.catalog.addresses.obolon",
    type: "repair",
    locationKey: "left-bank",
    rating: 4.6,
    lat: 50.511,
    lng: 30.4985,
    offerings: [
      {
        id: "s2-oil",
        nameKey: "driver.catalog.offerings.oilChange",
        durationMin: 40,
        priceUah: 1200,
      },
      {
        id: "s2-brake",
        nameKey: "driver.catalog.offerings.brakeCheck",
        durationMin: 90,
        priceUah: 450,
      },
    ],
  },
  {
    id: "station-3",
    nameKey: "driver.catalog.stations.tirePro",
    addressKey: "driver.catalog.addresses.pechersk",
    type: "tire",
    locationKey: "right-bank",
    rating: 4.9,
    lat: 50.4265,
    lng: 30.538,
    offerings: [
      {
        id: "s3-season",
        nameKey: "driver.catalog.offerings.seasonSwap",
        durationMin: 50,
        priceUah: 800,
      },
      {
        id: "s3-balance",
        nameKey: "driver.catalog.offerings.balancing",
        durationMin: 30,
        priceUah: 350,
      },
    ],
  },
  {
    id: "station-4",
    nameKey: "driver.catalog.stations.scanLine",
    addressKey: "driver.catalog.addresses.podil",
    type: "diagnostic",
    locationKey: "center",
    rating: 4.7,
    lat: 50.4592,
    lng: 30.518,
    offerings: [
      {
        id: "s4-obd",
        nameKey: "driver.catalog.offerings.obdScan",
        durationMin: 30,
        priceUah: 500,
      },
      {
        id: "s4-full",
        nameKey: "driver.catalog.offerings.fullDiagnostic",
        durationMin: 120,
        priceUah: 2200,
      },
    ],
  },
];

export const MOCK_DRIVER_CARS: MockCar[] = [
  {
    id: "car-1",
    make: "Skoda",
    model: "Octavia",
    year: 2019,
    plate: "AA 1234 BB",
  },
  {
    id: "car-2",
    make: "Toyota",
    model: "RAV4",
    year: 2021,
    plate: "KA 9012 XX",
  },
];

export const MOCK_DASHBOARD_METRICS: MockDashboardMetric[] = [
  { id: "visits", value: "3", labelKey: "driver.home.metricVisits" },
  { id: "spent", value: "₴ 2 650", labelKey: "driver.home.metricSpent" },
  { id: "cars", value: "3", labelKey: "driver.home.metricCars" },
];

export const MOCK_UPCOMING_BOOKINGS: MockUpcomingBooking[] = [
  {
    id: "up-1",
    stationId: "station-1",
    stationNameKey: "driver.catalog.stations.sparkWash",
    serviceNameKey: "driver.catalog.offerings.complexWash",
    date: "2026-05-28",
    time: "10:00",
    carLabel: getCarLabel("car-1"),
  },
  {
    id: "up-2",
    stationId: "station-2",
    stationNameKey: "driver.catalog.stations.autoDoc",
    serviceNameKey: "driver.catalog.offerings.oilChange",
    date: "2026-06-05",
    time: "14:30",
    carLabel: getCarLabel("car-2"),
  },
  {
    id: "up-3",
    stationId: "station-3",
    stationNameKey: "driver.catalog.stations.tirePro",
    serviceNameKey: "driver.catalog.offerings.balancing",
    date: "2026-06-12",
    time: "11:30",
    carLabel: getCarLabel("car-1"),
  },
];

/** Completed visits — prices match catalog offerings; sum = ₴2 650 (3 visits) */
export const MOCK_MAINTENANCE_HISTORY: MockHistoryItem[] = [
  {
    id: "h1",
    date: "2026-04-02",
    stationId: "station-2",
    stationNameKey: "driver.catalog.stations.autoDoc",
    serviceNameKey: "driver.catalog.offerings.oilChange",
    carId: "car-1",
    priceUah: 1200,
    statusKey: "driver.history.statusDone",
  },
  {
    id: "h2",
    date: "2026-02-14",
    stationId: "station-1",
    stationNameKey: "driver.catalog.stations.sparkWash",
    serviceNameKey: "driver.catalog.offerings.complexWash",
    carId: "car-1",
    priceUah: 650,
    statusKey: "driver.history.statusDone",
  },
  {
    id: "h3",
    date: "2025-11-08",
    stationId: "station-3",
    stationNameKey: "driver.catalog.stations.tirePro",
    serviceNameKey: "driver.catalog.offerings.seasonSwap",
    carId: "car-2",
    priceUah: 800,
    statusKey: "driver.history.statusDone",
  },
];

export const MOCK_TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
];

export function filterStations(
  type: ServiceTypeId | "all",
  locationId: string,
): MockServiceStation[] {
  return MOCK_SERVICE_STATIONS.filter((s) => {
    const typeOk = type === "all" || s.type === type;
    const locOk = locationId === "all" || s.locationKey === locationId;
    return typeOk && locOk;
  });
}

export function getStationById(id: string): MockServiceStation | undefined {
  return MOCK_SERVICE_STATIONS.find((s) => s.id === id);
}

export function getOffering(
  stationId: string,
  offeringId: string,
): { station: MockServiceStation; offering: MockServiceOffering } | undefined {
  const station = getStationById(stationId);
  if (!station) return undefined;
  const offering = station.offerings.find((o) => o.id === offeringId);
  if (!offering) return undefined;
  return { station, offering };
}
