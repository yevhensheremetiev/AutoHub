import { useTranslation } from 'react-i18next';
import { Calendar, Wrench } from 'lucide-react';

import { Text } from '@/components/ui/text';
import {
  getCarLabel,
  MOCK_MAINTENANCE_HISTORY,
} from '@/mocks/driver-dashboard';

export function MaintenanceHistoryPage() {
  const { t } = useTranslation();

  const sorted = [...MOCK_MAINTENANCE_HISTORY].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('driver.historyTitle')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {t('driver.historySubtitle')}
        </Text>
      </div>

      <ol className="space-y-3">
        {sorted.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300 ring-1 ring-slate-700">
              <Wrench className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Text className="font-medium text-slate-50">
                  {t(item.serviceNameKey)}
                </Text>
                <Text
                  as="span"
                  className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                >
                  {t(item.statusKey)}
                </Text>
              </div>
              <Text className="text-sm text-slate-400">
                {t(item.stationNameKey)}
              </Text>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" aria-hidden />
                  {item.date}
                </span>
                <span aria-hidden>·</span>
                <span>{getCarLabel(item.carId)}</span>
                <span aria-hidden>·</span>
                <span>{t('driver.priceUah', { price: item.priceUah })}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
