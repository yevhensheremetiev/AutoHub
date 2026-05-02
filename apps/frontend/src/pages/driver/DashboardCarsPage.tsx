import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Car, Plus } from 'lucide-react';

import { useCars } from '@/api/queries/cars';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';

export function DashboardCarsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: cars = [], isLoading, isError, error } = useCars();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text as="h1" variant="h3" className="text-slate-50">
            {t('driver.carsTitle')}
          </Text>
          <Text className="mt-1 text-slate-400" variant="muted">
            {t('driver.carsSubtitle')}
          </Text>
        </div>

        <Button type="button" onClick={() => navigate('/dashboard/cars/new')}>
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          {t('driver.addCarCta')}
        </Button>
      </div>

      {isLoading ? (
        <Text className="text-slate-400">{t('driver.loading')}</Text>
      ) : null}

      {isError ? (
        <Text className="text-destructive">
          {error instanceof Error ? error.message : t('driver.carsLoadError')}
        </Text>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2">
        {!isLoading && !isError
          ? cars.map((car) => (
          <li
            key={car.id}
            className="flex gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-lg shadow-black/10"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Car className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <Text className="font-semibold text-slate-50">
                {car.make} {car.model}
              </Text>
              <Text className="mt-1 text-sm text-slate-400">
                {car.year != null
                  ? t('driver.carsYear', { year: car.year })
                  : t('driver.carsYearUnknown')}
              </Text>
              <Text
                as="span"
                className="mt-2 inline-block rounded-lg bg-slate-800/80 px-2 py-0.5 font-mono text-xs text-slate-300"
              >
                {car.licensePlate ?? '—'}
              </Text>
            </div>
          </li>
            ))
          : null}
      </ul>
    </div>
  );
}
