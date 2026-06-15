import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BookingStatus } from '@autohub/shared';
import { ChevronRight } from 'lucide-react';

import { useServiceBookings } from '@/api';
import { BookingStatusBadge } from '@/components/service/BookingStatusBadge';
import { Text } from '@/components/ui/text';
import {
  SERVICE_BOOKING_STATUS_ORDER,
  formatServiceBookingDate,
  formatServiceBookingTime,
} from '@/lib/service-booking';
import { cn } from '@/lib/utils';

type StatusFilter = BookingStatus | 'ALL';

export function ServiceBookingsPage() {
  const { t, i18n } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB';
  const apiStatus = statusFilter === 'ALL' ? undefined : statusFilter;
  const { data: bookings = [], isLoading, isError } =
    useServiceBookings(apiStatus);

  const filterOptions: { id: StatusFilter; labelKey: string }[] = [
    { id: 'ALL', labelKey: 'service.bookings.filterAll' },
    ...SERVICE_BOOKING_STATUS_ORDER.map((status) => ({
      id: status as StatusFilter,
      labelKey: `service.bookings.status.${status}`,
    })),
  ];

  if (isError) {
    return <Text variant="muted">{t('service.errors.loadFailed')}</Text>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" variant="h3">
          {t('service.bookings.title')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {t('service.bookings.subtitle')}
        </Text>
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label={t('service.bookings.filterAria')}
      >
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={statusFilter === opt.id}
            onClick={() => setStatusFilter(opt.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition',
              statusFilter === opt.id
                ? 'bg-primary/15 text-primary ring-1 ring-primary/40'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200',
            )}
          >
            {t(opt.labelKey)}
          </button>
        ))}
      </div>

      {!isLoading && bookings.length === 0 ? (
        <Text className="text-sm text-slate-400" variant="muted">
          {t('service.bookings.empty')}
        </Text>
      ) : !isLoading ? (
        <ul className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800/80 bg-slate-900/40">
          {bookings.map((b) => (
            <li key={b.id}>
              <Link
                to={`/service-dashboard/bookings/${b.id}`}
                className="group flex flex-col gap-2 px-4 py-4 transition hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Text className="font-medium text-slate-100 group-hover:text-primary">
                      {b.clientName}
                    </Text>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <Text className="mt-0.5 text-sm text-slate-400" variant="muted">
                    {b.offeringName} · {b.carLabel}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-500" variant="muted">
                    {formatServiceBookingDate(b.scheduledAt, locale)} ·{' '}
                    {formatServiceBookingTime(b.scheduledAt, locale)}
                  </Text>
                </div>
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-slate-600 transition group-hover:text-primary"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
