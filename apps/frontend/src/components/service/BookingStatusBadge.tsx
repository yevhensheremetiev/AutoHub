import { useTranslation } from 'react-i18next';

import type { BookingStatus } from '@autohub/shared';
import { cn } from '@/lib/utils';

const statusStyles: Record<BookingStatus, string> = {
  PENDING: 'bg-amber-500/15 text-amber-300 ring-amber-500/30',
  CONFIRMED: 'bg-sky-500/15 text-sky-300 ring-sky-500/30',
  IN_PROGRESS: 'bg-violet-500/15 text-violet-300 ring-violet-500/30',
  COMPLETED: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30',
  CANCELLED: 'bg-slate-500/15 text-slate-400 ring-slate-500/30',
};

type BookingStatusBadgeProps = {
  status: BookingStatus;
  className?: string;
};

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        statusStyles[status],
        className,
      )}
    >
      {t(`service.bookings.status.${status}`)}
    </span>
  );
}
