import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react';

import { Text } from '@/components/ui/text';
import { getStationById, MOCK_LOCATIONS } from '@/mocks/driver-dashboard';

export function ServiceDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const { t } = useTranslation();
  const station = stationId ? getStationById(stationId) : undefined;

  if (!station) {
    return (
      <div className="space-y-4">
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('driver.serviceNotFound')}
        </Text>
        <Link
          to="/dashboard/map"
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-600 bg-slate-900 px-4 text-sm font-medium text-slate-100 shadow-sm hover:bg-slate-800"
        >
          {t('driver.backToMap')}
        </Link>
      </div>
    );
  }

  const locationLabel =
    MOCK_LOCATIONS.find((l) => l.id === station.locationKey)?.labelKey ?? '';

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/dashboard/map"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('driver.backToMap')}
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Text as="h1" variant="h3" className="text-slate-50">
              {t(station.nameKey)}
            </Text>
            <Text
              className="mt-2 flex items-start gap-1.5 text-slate-400"
              variant="muted"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {t(station.addressKey)}
            </Text>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Text
              as="span"
              className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-sm font-medium text-amber-200"
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              {station.rating.toFixed(1)}
            </Text>
            <Text
              as="span"
              className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
            >
              {t(`driver.serviceTypes.${station.type}`)}
            </Text>
            <Text
              as="span"
              className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-400"
            >
              {t(locationLabel)}
            </Text>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-lg shadow-black/15">
        <Text as="h2" className="text-base font-semibold text-slate-100">
          {t('driver.availableServicesTitle')}
        </Text>
        <Text className="mt-1 text-sm text-slate-500" variant="muted">
          {t('driver.availableServicesHint')}
        </Text>
        <ul className="mt-5 divide-y divide-slate-800/80">
          {station.offerings.map((offering) => (
            <li
              key={offering.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <Text className="font-medium text-slate-50">
                  {t(offering.nameKey)}
                </Text>
                <Text
                  className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"
                  variant="muted"
                >
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {t('driver.durationMinutes', { count: offering.durationMin })}
                  <span aria-hidden>·</span>
                  {t('driver.priceUah', { price: offering.priceUah })}
                </Text>
              </div>
              <Link
                to={`/dashboard/services/${station.id}/book?offer=${encodeURIComponent(offering.id)}`}
                className="inline-flex h-8 shrink-0 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
              >
                {t('driver.bookService')}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
