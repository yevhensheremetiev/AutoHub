import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';

import { useServiceOfferings } from '@/api';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

export function ServiceCatalogPage() {
  const { t } = useTranslation();
  const { data: offerings = [], isLoading, isError } = useServiceOfferings();

  if (isError) {
    return <Text variant="muted">{t('service.errors.loadFailed')}</Text>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" variant="h3">
          {t('service.catalog.title')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {t('service.catalog.subtitle')}
        </Text>
      </div>

      {!isLoading && offerings.length === 0 ? (
        <Text className="text-sm text-slate-400" variant="muted">
          {t('service.catalog.empty')}
        </Text>
      ) : !isLoading ? (
        <ul className="space-y-3">
          {offerings.map((offering) => (
            <li
              key={offering.id}
              className={cn(
                'rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5',
                !offering.active && 'opacity-70',
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <Text className="font-medium text-slate-100">
                    {offering.name}
                  </Text>
                  {offering.description ? (
                    <Text className="mt-1 text-sm text-slate-400" variant="muted">
                      {offering.description}
                    </Text>
                  ) : null}
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
                    offering.active
                      ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30'
                      : 'bg-slate-500/15 text-slate-400 ring-slate-500/30',
                  )}
                >
                  {offering.active
                    ? t('service.catalog.active')
                    : t('service.catalog.inactive')}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {t('driver.durationMinutes', {
                    count: offering.durationMinutes,
                  })}
                </span>
                <span>
                  {t('driver.priceUah', { price: offering.priceUah })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
