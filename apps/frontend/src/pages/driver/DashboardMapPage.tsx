import { lazy, Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star } from 'lucide-react';

import { Text } from '@/components/ui/text';
import {
  filterStations,
  MOCK_LOCATIONS,
  MOCK_SERVICE_TYPES,
  type ServiceTypeId,
} from '@/mocks/driver-dashboard';
import { cn } from '@/lib/utils';

const ServiceStationsMap = lazy(() =>
  import('@/components/driver/ServiceStationsMap').then((m) => ({
    default: m.ServiceStationsMap,
  })),
);

export function DashboardMapPage() {
  const { t } = useTranslation();
  const [type, setType] = useState<ServiceTypeId | 'all'>('all');
  const [locationId, setLocationId] = useState('all');

  const filtered = useMemo(
    () => filterStations(type, locationId),
    [type, locationId],
  );

  const selectClass =
    'h-10 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 md:min-w-[180px]';

  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('driver.mapTitle')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {t('driver.mapSubtitle')}
        </Text>
      </div>

      <section
        className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-lg shadow-black/20"
        aria-label={t('driver.filtersAria')}
      >
        <Text as="h2" className="text-sm font-semibold text-slate-200">
          {t('driver.filtersTitle')}
        </Text>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
          <div className="flex-1 space-y-1.5 md:min-w-[200px]">
            <label htmlFor="filter-type" className="text-xs text-slate-400">
              {t('driver.filterServiceType')}
            </label>
            <select
              id="filter-type"
              className={selectClass}
              value={type}
              onChange={(e) =>
                setType(e.target.value as ServiceTypeId | 'all')
              }
            >
              {MOCK_SERVICE_TYPES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 space-y-1.5 md:min-w-[200px]">
            <label htmlFor="filter-location" className="text-xs text-slate-400">
              {t('driver.filterLocation')}
            </label>
            <select
              id="filter-location"
              className={selectClass}
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
            >
              {MOCK_LOCATIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section aria-label={t('driver.mapAria')}>
        <div
          className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner"
          role="application"
          aria-label={t('driver.mapIllustrationAria')}
        >
          <Suspense
            fallback={
              <div
                className="h-[280px] w-full animate-pulse rounded-2xl bg-slate-800/40 md:h-[380px]"
                aria-hidden
              />
            }
          >
            <ServiceStationsMap stations={filtered} />
          </Suspense>
        </div>
      </section>

      <section className="space-y-3">
        <Text as="h2" className="text-sm font-semibold text-slate-200">
          {t('driver.stationListTitle')}
        </Text>
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((station) => (
            <li key={station.id}>
              <Link
                to={`/dashboard/services/${station.id}`}
                className={cn(
                  'flex h-full flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 transition',
                  'hover:border-primary/40 hover:bg-slate-900/80',
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Text className="font-medium text-slate-50">
                      {t(station.nameKey)}
                    </Text>
                    <Text
                      className="mt-1 flex items-start gap-1 text-xs text-slate-400"
                      variant="muted"
                    >
                      <MapPin
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500"
                        aria-hidden
                      />
                      <span>{t(station.addressKey)}</span>
                    </Text>
                  </div>
                  <Text
                    as="span"
                    className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-200"
                  >
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    {station.rating.toFixed(1)}
                  </Text>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Text
                    as="span"
                    className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] text-slate-300"
                  >
                    {t(`driver.serviceTypes.${station.type}`)}
                  </Text>
                  <Text as="span" className="text-[11px] text-slate-500">
                    {t(MOCK_LOCATIONS.find((l) => l.id === station.locationKey)?.labelKey ?? '')}
                  </Text>
                </div>
                <span className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-xl bg-primary text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                  {t('driver.openStation')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {!filtered.length ? (
          <Text className="text-sm text-slate-500">{t('driver.noStations')}</Text>
        ) : null}
      </section>
    </div>
  );
}
