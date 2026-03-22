import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { AccentSwitcher } from '@/components/AccentSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleLogin() {
    navigate('/login');
  }

  function handleSignUp() {
    navigate('/login');
  }

  return (
    <main className="min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="animate-[pulse_10s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(147,51,234,0.16),_transparent_55%)] blur-3xl" />
      </div>
      <div className="container flex min-h-screen flex-col py-6">
        <header className="flex items-center justify-between animate-[fade-down_0.6s_ease-out]">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/40 transition-transform duration-300 hover:-translate-y-0.5 hover:rotate-3">
              <Text
                as="span"
                className="text-lg font-semibold tracking-tight text-primary"
              >
                A
              </Text>
            </div>
            <div className="flex flex-col">
              <Text as="span" className="text-sm font-semibold tracking-tight">
                {t('common.appName')}
              </Text>
              <Text as="span" variant="muted" className="text-xs">
                {t('home.tagline')}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AccentSwitcher />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleLogin}
              className="hidden text-xs text-muted-foreground hover:text-slate-900 dark:hover:text-slate-50 sm:inline-flex"
            >
              {t('auth.loginTitle')}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSignUp}
              className="hidden rounded-full sm:inline-flex"
            >
              {t('auth.signUp')}
            </Button>
            <LanguageSwitcher />
          </div>
        </header>

        <section className="mt-12 grid flex-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-8 animate-[fade-in_0.8s_ease-out]">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-slate-900/60 px-3 py-1 text-xs text-slate-100 shadow-sm backdrop-blur">
              <Text
                as="span"
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              />
              <Text as="span" className="text-slate-100">
                {t('home.pill')}
              </Text>
            </div>
            <div>
              <Text
                as="h1"
                className="text-balance bg-gradient-to-b from-slate-50 via-slate-50 to-primary bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl lg:text-6xl"
              >
                {t('home.title')}
              </Text>
              <Text className="mt-4 max-w-xl text-balance text-base text-slate-300 sm:text-lg">
                {t('home.description')}
              </Text>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                size="lg"
                onClick={handleSignUp}
                className="rounded-full px-6 py-2.5 shadow-lg shadow-primary/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-primary/50"
              >
                {t('home.getStarted')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleLogin}
                className="rounded-full border-slate-700 bg-slate-900/40 px-5 py-2.5 text-slate-100 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-slate-500 hover:bg-slate-900"
              >
                {t('home.alreadyHaveAccount')}
              </Button>
              <Text as="span" className="text-xs text-slate-400">
                {t('home.noCreditCard')}
              </Text>
            </div>

            <dl className="grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/15">
                <dt className="text-xs text-slate-400">
                  {t('home.metricInventory')}
                </dt>
                <dd className="mt-1 text-lg font-semibold">1 місце</dd>
                <Text className="mt-1 text-xs text-slate-400">
                  {t('home.metricInventoryDesc')}
                </Text>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-sky-500/15">
                <dt className="text-xs text-slate-400">
                  {t('home.metricLeads')}
                </dt>
                <dd className="mt-1 text-lg font-semibold">+30%</dd>
                <Text className="mt-1 text-xs text-slate-400">
                  {t('home.metricLeadsDesc')}
                </Text>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/15">
                <dt className="text-xs text-slate-400">
                  {t('home.metricTime')}
                </dt>
                <dd className="mt-1 text-lg font-semibold">до 10 год/тиж</dd>
                <Text className="mt-1 text-xs text-slate-400">
                  {t('home.metricTimeDesc')}
                </Text>
              </div>
            </dl>
          </div>

          <div className="relative mt-2 animate-[fade-in_0.9s_ease-out] lg:mt-0">
            <div className="pointer-events-none absolute inset-0 -z-10 translate-x-10 translate-y-5 scale-110 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.28),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(129,140,248,0.18),_transparent_55%)] blur-3xl" />
            <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/80 backdrop-blur transition-transform duration-500 hover:-translate-y-1.5 hover:scale-[1.01]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Text
                    as="span"
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-rose-500"
                  />
                  <Text
                    as="span"
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-amber-400"
                  />
                  <Text
                    as="span"
                    aria-hidden="true"
                    className="h-2 w-2 rounded-full bg-emerald-400"
                  />
                </div>
                <Text as="span" className="text-xs text-slate-500">
                  {t('home.previewLabel')}
                </Text>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <Text className="text-xs text-slate-400">
                      {t('home.previewTitle')}
                    </Text>
                    <Text className="text-lg font-semibold text-slate-50">
                      28 авто
                    </Text>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <Text
                      as="span"
                      className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300"
                    >
                      {t('home.previewInStock')}
                    </Text>
                    <Text
                      as="span"
                      className="rounded-full bg-sky-500/10 px-2 py-1 text-sky-300"
                    >
                      {t('home.previewReserved')}
                    </Text>
                  </div>
                </div>

                <div className="grid gap-3 text-xs text-slate-200">
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 transition-transform duration-300 hover:-translate-y-1 hover:border-emerald-500/60">
                    <div>
                      <Text className="font-medium">Tesla Model 3</Text>
                      <Text className="mt-0.5 text-[11px] text-slate-400">
                        Long Range · 2022
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="text-sm font-semibold">$41 900</Text>
                      <Text className="mt-0.5 text-[11px] text-emerald-400">
                        {t('home.statusInStock')}
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 transition-transform duration-300 hover:-translate-y-1 hover:border-sky-500/60">
                    <div>
                      <Text className="font-medium">BMW X5</Text>
                      <Text className="mt-0.5 text-[11px] text-slate-400">
                        xDrive 30d · 2021
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="text-sm font-semibold">$58 300</Text>
                      <Text className="mt-0.5 text-[11px] text-sky-300">
                        {t('home.statusReserved')}
                      </Text>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5 transition-transform duration-300 hover:-translate-y-1 hover:border-amber-400/70">
                    <div>
                      <Text className="font-medium">Audi Q8 e-tron</Text>
                      <Text className="mt-0.5 text-[11px] text-slate-400">
                        quattro · 2023
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text className="text-sm font-semibold">$76 200</Text>
                      <Text className="mt-0.5 text-[11px] text-amber-300">
                        {t('home.statusTestDrive')}
                      </Text>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleSignUp}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary/90 px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-lg hover:shadow-primary/40"
                >
                  {t('home.ctaDashboard')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-800/60 pt-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Text as="span" className="text-xs text-slate-500">
              © {new Date().getFullYear()} {t('common.appName')}.{' '}
              {t('home.rightsReserved')}
            </Text>
            <Text as="span" className="text-[11px] text-slate-500">
              {t('home.footerNote')}
            </Text>
          </div>
        </footer>
      </div>
    </main>
  );
}
