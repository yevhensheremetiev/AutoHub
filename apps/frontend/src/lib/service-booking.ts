import type { BookingStatus } from '@autohub/shared';

export const SERVICE_BOOKING_STATUS_ORDER: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
];

export function formatServiceBookingDate(
  scheduledAt: string,
  locale: string,
  style: 'short' | 'long' = 'short',
): string {
  const d = new Date(scheduledAt);
  return new Intl.DateTimeFormat(locale, {
    ...(style === 'long'
      ? {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      : {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
  }).format(d);
}

export function formatServiceBookingTime(
  scheduledAt: string,
  locale: string,
): string {
  const d = new Date(scheduledAt);
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatServiceBookingDateLong(
  scheduledAt: string,
  locale: string,
): string {
  return formatServiceBookingDate(scheduledAt, locale, 'long');
}
