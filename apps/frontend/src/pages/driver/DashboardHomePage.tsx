import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CalendarClock, Map } from 'lucide-react';

import { useMe } from '@/api';
import { Text } from '@/components/ui/text';
import {
  MOCK_DASHBOARD_METRICS,
  MOCK_UPCOMING_BOOKINGS,
} from '@/mocks/driver-dashboard';

function formatBookingDate(isoDate: string, locale: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(d);
}

export function DashboardHomePage() {
  const { t, i18n } = useTranslation();
  const { data: me } = useMe();

  const locale = i18n.language === 'uk' ? 'uk-UA' : 'en-GB';
  const rawName = me?.name?.trim();
  const displayName =
    rawName ||
    (me?.email ? me.email.split('@')[0] : '') ||
    t('driver.home.guestName');

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-primary/10 p-6 shadow-lg shadow-black/20 md:p-8">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Text as="h1" variant="h3" className="text-slate-50">
              {t('driver.home.welcome', { name: displayName })}
            </Text>
            <Text className="mt-2 max-w-xl text-slate-400" variant="muted">
              {t('driver.home.subtitle')}
            </Text>
          </div>
          <Link
            to="/dashboard/map"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition hover:bg-primary/90"
          >
            <Map className="h-4 w-4" aria-hidden />
            {t('driver.home.openMap')}
          </Link>
        </div>
      </section>

      <section aria-labelledby="dash-metrics-heading">
        <Text
          as="h2"
          id="dash-metrics-heading"
          className="text-sm font-semibold text-slate-200"
        >
          {t('driver.home.metricsTitle')}
        </Text>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {MOCK_DASHBOARD_METRICS.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 shadow-inner shadow-black/10"
            >
              <Text
                as="p"
                className="text-2xl font-semibold tracking-tight text-slate-50"
              >
                {m.value}
              </Text>
              <Text className="mt-1 text-xs text-slate-400" variant="muted">
                {t(m.labelKey)}
              </Text>
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-lg shadow-black/20"
        aria-labelledby="dash-upcoming-heading"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Text
            as="h2"
            id="dash-upcoming-heading"
            className="text-sm font-semibold text-slate-200"
          >
            {t('driver.home.upcomingTitle')}
          </Text>
        </div>
        <ul className="mt-4 divide-y divide-slate-800/80">
          {MOCK_UPCOMING_BOOKINGS.map((b) => (
            <li key={b.id} className="py-3 first:pt-0 last:pb-0">
              <Link
                to={`/dashboard/services/${b.stationId}`}
                className="group flex flex-col gap-2 rounded-xl py-1 transition sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <Text
                    as="p"
                    className="font-medium text-slate-100 group-hover:text-primary"
                  >
                    {t(b.stationNameKey)}
                  </Text>
                  <Text className="mt-0.5 text-sm text-slate-400" variant="muted">
                    {t(b.serviceNameKey)} · {b.carLabel}
                  </Text>
                  <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarClock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {t('driver.home.bookingWhen', {
                      date: formatBookingDate(b.date, locale),
                      time: b.time,
                    })}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary opacity-90 transition group-hover:opacity-100">
                  {t('driver.home.viewBooking')}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
