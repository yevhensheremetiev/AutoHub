import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';

function parseIsoDate(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  ) {
    return null;
  }
  return date;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function dateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function localeTag(language: string): string {
  return language === 'uk' ? 'uk-UA' : 'en-GB';
}

function getMondayBasedOffset(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0).getDate();
  const offset = getMondayBasedOffset(first);
  const days: (Date | null)[] = Array.from({ length: offset }, () => null);

  for (let day = 1; day <= lastDay; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

function getWeekdayLabels(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const monday = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(
      monday.getFullYear(),
      monday.getMonth(),
      monday.getDate() + index,
    );
    return formatter.format(date);
  });
}

export type DatePickerProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
  minDate?: string;
  disabled?: boolean;
};

export function DatePicker({
  id,
  value,
  onChange,
  placeholder,
  className,
  hasError = false,
  minDate,
  disabled = false,
}: DatePickerProps) {
  const { t, i18n } = useTranslation();
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const popoverId = `${triggerId}-popover`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const locale = localeTag(i18n.language);
  const selected = useMemo(() => parseIsoDate(value), [value]);
  const min = useMemo(
    () => (minDate ? parseIsoDate(minDate) : null),
    [minDate],
  );

  const [viewMonth, setViewMonth] = useState(() =>
    startOfMonth(selected ?? new Date()),
  );

  useEffect(() => {
    if (selected) {
      setViewMonth(startOfMonth(selected));
    }
  }, [selected]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const displayValue = selected
    ? new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(selected)
    : '';

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(viewMonth);

  const weekdays = useMemo(() => getWeekdayLabels(locale), [locale]);
  const calendarDays = useMemo(
    () => buildCalendarDays(viewMonth.getFullYear(), viewMonth.getMonth()),
    [viewMonth],
  );

  const isDisabledDay = (date: Date) => {
    if (!min) return false;
    return dateOnly(date) < dateOnly(min);
  };

  const selectDate = (date: Date) => {
    onChange(toIsoDate(date));
    setOpen(false);
  };

  const goToPreviousMonth = () => {
    setViewMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setViewMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  };

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 text-left text-sm text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:cursor-not-allowed disabled:opacity-50',
          hasError ? 'border-destructive' : '',
          !displayValue ? 'text-slate-500' : '',
        )}
      >
        <span className="truncate">
          {displayValue || placeholder || t('common.datePicker.placeholder')}
        </span>
        <Calendar className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      </button>

      {open ? (
        <div
          id={popoverId}
          role="dialog"
          aria-label={t('common.datePicker.dialogLabel')}
          className="absolute left-0 top-full z-50 mt-2 w-[min(100%,18rem)] rounded-xl border border-slate-700 bg-slate-900 p-3 shadow-xl shadow-black/40"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goToPreviousMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
              aria-label={t('common.datePicker.previousMonth')}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="text-sm font-medium capitalize text-slate-100">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
              aria-label={t('common.datePicker.nextMonth')}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {weekdays.map((label) => (
              <span
                key={label}
                className="py-1 text-[0.65rem] font-medium uppercase tracking-wide text-slate-500"
              >
                {label}
              </span>
            ))}
            {calendarDays.map((date, index) =>
              date ? (
                <button
                  key={toIsoDate(date)}
                  type="button"
                  disabled={isDisabledDay(date)}
                  onClick={() => selectDate(date)}
                  className={cn(
                    'h-8 w-8 rounded-md text-sm transition',
                    value === toIsoDate(date)
                      ? 'bg-primary font-medium text-primary-foreground'
                      : 'text-slate-200 hover:bg-slate-800',
                    isDisabledDay(date)
                      ? 'cursor-not-allowed opacity-30 hover:bg-transparent'
                      : '',
                  )}
                >
                  {date.getDate()}
                </button>
              ) : (
                <span key={`empty-${index}`} aria-hidden />
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
