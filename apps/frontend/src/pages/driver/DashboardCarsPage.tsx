import { useTranslation } from 'react-i18next';
import { Car } from 'lucide-react';

import { Text } from '@/components/ui/text';
import { MOCK_DRIVER_CARS } from '@/mocks/driver-dashboard';

export function DashboardCarsPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('driver.carsTitle')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {t('driver.carsSubtitle')}
        </Text>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {MOCK_DRIVER_CARS.map((car) => (
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
                {t('driver.carsYear', { year: car.year })}
              </Text>
              <Text
                as="span"
                className="mt-2 inline-block rounded-lg bg-slate-800/80 px-2 py-0.5 font-mono text-xs text-slate-300"
              >
                {car.plate}
              </Text>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
