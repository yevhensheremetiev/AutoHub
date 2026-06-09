import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { BookingStatus } from '@autohub/shared';
import { ArrowLeft, Mail } from 'lucide-react';

import {
  useServiceBooking,
  useUpdateServiceBookingStatus,
} from '@/api';
import { BookingStatusBadge } from '@/components/service/BookingStatusBadge';
import { Text } from '@/components/ui/text';
import {
  SERVICE_BOOKING_STATUS_ORDER,
  formatServiceBookingDateLong,
  formatServiceBookingTime,
} from '@/lib/service-booking';
import { cn } from '@/lib/utils';

export function ServiceBookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { t, i18n } = useTranslation();
  const { data: booking, isLoading, isError } = useServiceBooking(bookingId);
  const statusMutation = useUpdateServiceBookingStatus();

  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB';

  if (isLoading) {
    return <Text variant="muted">{t('service.loading')}</Text>;
  }

  if (isError || !booking) {
    return (
      <div className="space-y-4">
        <Text variant="muted">{t('service.bookings.notFound')}</Text>
        <Link
          to="/service-dashboard/bookings"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('service.bookings.backToList')}
        </Link>
      </div>
    );
  }

  const currentBooking = booking;

  function handleStatusChange(status: BookingStatus) {
    statusMutation.mutate(
      { bookingId: currentBooking.id, body: { status } },
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/service-dashboard/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('service.bookings.backToList')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Text as="h1" variant="h3">
            {currentBooking.clientName}
          </Text>
          <Text className="mt-1 text-slate-400" variant="muted">
            {currentBooking.offeringName} · {currentBooking.carLabel}
          </Text>
        </div>
        <BookingStatusBadge status={currentBooking.status} />
      </div>

      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
        <Text className="text-sm font-semibold text-slate-200">
          {t('service.bookings.detailInfo')}
        </Text>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">{t('service.bookings.fieldDate')}</dt>
            <dd className="mt-0.5 text-slate-100">
              {formatServiceBookingDateLong(currentBooking.scheduledAt, locale)} ·{' '}
              {formatServiceBookingTime(currentBooking.scheduledAt, locale)}
            </dd>
          </div>
          {currentBooking.clientEmail ? (
            <div>
              <dt className="text-slate-500">{t('service.bookings.fieldEmail')}</dt>
              <dd className="mt-0.5">
                <a
                  href={`mailto:${currentBooking.clientEmail}`}
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {currentBooking.clientEmail}
                </a>
              </dd>
            </div>
          ) : null}
          {currentBooking.notes ? (
            <div className="sm:col-span-2">
              <dt className="text-slate-500">
                {t('service.bookings.fieldNotes')}
              </dt>
              <dd className="mt-0.5 text-slate-300">{currentBooking.notes}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-4">
        <Text className="text-sm font-semibold text-slate-200">
          {t('service.bookings.statusTitle')}
        </Text>
        <Text className="text-xs text-slate-500" variant="muted">
          {t('service.bookings.statusHint')}
        </Text>
        <div className="flex flex-wrap gap-2">
          {SERVICE_BOOKING_STATUS_ORDER.map((status) => (
            <button
              key={status}
              type="button"
              disabled={statusMutation.isPending}
              onClick={() => handleStatusChange(status)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition ring-1 ring-inset',
                currentBooking.status === status
                  ? 'bg-primary/15 text-primary ring-primary/40'
                  : 'bg-slate-800/60 text-slate-400 ring-transparent hover:bg-slate-800 hover:text-slate-200',
              )}
            >
              {t(`service.bookings.status.${status}`)}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
