import { useTranslation } from 'react-i18next';
import { Calendar, Wrench } from 'lucide-react';

import { useDriverHistory } from '@/api';
import { HistoryReviewBlock } from '@/components/driver/HistoryReviewBlock';
import { Text } from '@/components/ui/text';
import {
  formatServiceBookingDate,
  formatServiceBookingTime,
} from '@/lib/service-booking';

export function MaintenanceHistoryPage() {
  const { t, i18n } = useTranslation();
  const { data: history = [], isLoading, isError } = useDriverHistory();
  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB';

  if (isError) {
    return <Text variant="muted">{t('driver.errors.loadFailed')}</Text>;
  }

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

      {!isLoading && history.length === 0 ? (
        <Text className="text-sm text-slate-400" variant="muted">
          {t('driver.history.empty')}
        </Text>
      ) : !isLoading ? (
        <ol className="space-y-3">
          {history.map((item) => (
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
                    {item.offeringName}
                  </Text>
                  <Text
                    as="span"
                    className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                  >
                    {t('driver.history.statusDone')}
                  </Text>
                </div>
                <Text className="text-sm text-slate-400">{item.serviceName}</Text>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" aria-hidden />
                    {formatServiceBookingDate(item.scheduledAt, locale)} ·{' '}
                    {formatServiceBookingTime(item.scheduledAt, locale)}
                  </span>
                  <span aria-hidden>·</span>
                  <span>{item.carLabel}</span>
                  <span aria-hidden>·</span>
                  <span>{t('driver.priceUah', { price: item.priceUah })}</span>
                </div>
                <HistoryReviewBlock
                  bookingId={item.id}
                  existingReview={item.review}
                />
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
