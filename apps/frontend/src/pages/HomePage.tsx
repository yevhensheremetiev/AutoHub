import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CalendarClock,
  Car,
  ClipboardList,
  FileCheck,
  LayoutDashboard,
  ListOrdered,
  MapPin,
  RefreshCw,
  Route,
  UserCircle,
} from 'lucide-react';

import { useMe } from '@/api';
import { AccentSwitcher } from '@/components/AccentSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: me, isPending: isMePending, isError: isMeError } = useMe();

  function handleLogin() {
    navigate('/login');
  }

  function handleSignUp() {
    navigate('/signup');
  }

  function handleDashboard() {
    navigate('/dashboard');
  }

  const driverFeatures = [
    { icon: MapPin, text: t('home.driverFeatureMap') },
    { icon: CalendarClock, text: t('home.driverFeatureBook') },
    { icon: Car, text: t('home.driverFeatureGarage') },
    { icon: Route, text: t('home.driverFeatureHistory') },
  ];

  const providerFeatures = [
    { icon: UserCircle, text: t('home.providerFeatureProfile') },
    { icon: ListOrdered, text: t('home.providerFeatureCatalog') },
    { icon: ClipboardList, text: t('home.providerFeatureBookings') },
    { icon: RefreshCw, text: t('home.providerFeatureStatuses') },
    { icon: FileCheck, text: t('home.providerFeatureResults') },
  ];

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <div className="container flex max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        <header className="flex items-center justify-between animate-[fade-down_0.6s_ease-out]">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/50 transition-transform duration-300 hover:-translate-y-0.5 hover:rotate-3">
              <Text as="span" className="text-lg font-semibold tracking-tight text-primary">
                A
              </Text>
            </div>
            <div className="flex flex-col">
              <Text as="span" className="text-sm font-semibold tracking-tight">
                {t('common.appName')}
              </Text>
              <Text as="span" className="text-xs text-zinc-500">
                {t('home.tagline')}
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AccentSwitcher />
            <LanguageSwitcher />
            {isMePending ? (
              <div
                className="hidden h-9 min-w-[9rem] animate-pulse rounded-full bg-zinc-800/50 sm:block"
                aria-hidden
              />
            ) : (me && !isMeError) ? (
              <Button
                type="button"
                size="sm"
                onClick={handleDashboard}
                className="hidden rounded-full sm:inline-flex"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" aria-hidden />
                {t('home.goToDashboard')}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="hidden text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 sm:inline-flex"
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
              </>
            )}
          </div>
        </header>

        <section className="mt-10 flex flex-1 flex-col gap-10 pb-12 lg:mt-12 lg:gap-12 sm:pb-16">
          <div className="w-full max-w-none">
            <h1
              className="relative w-full max-w-none pl-1"
              aria-label={`${t('home.titleLine1')} ${t('home.titleLine2')}`}
            >
              <span
                className="pointer-events-none absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-transparent via-primary/45 to-transparent sm:top-1.5 sm:bottom-1.5"
                aria-hidden
              />
              <span className="block bg-gradient-to-b from-zinc-100 via-zinc-200 to-primary/40 bg-clip-text pl-4 text-balance text-2xl font-semibold leading-snug tracking-tight text-transparent sm:text-3xl">
                {t('home.titleLine1')}
              </span>
              <span className="mt-2 block bg-gradient-to-b from-zinc-100 via-zinc-200 to-primary/40 bg-clip-text pl-4 text-balance text-2xl font-semibold leading-snug tracking-tight text-transparent sm:text-3xl">
                {t('home.titleLine2')}
              </span>
            </h1>
            <Text className="mt-4 w-full max-w-none text-pretty text-sm leading-relaxed text-zinc-400 sm:text-base">
              {t('home.description')}
            </Text>
          </div>

          {/* Дві аудиторії — завжди поруч (горизонтально), як на макеті */}
          <div className="grid min-w-0 grid-cols-2 gap-px overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] sm:rounded-2xl">
            <section
              className="min-w-0 bg-[#1a1614] p-4 sm:p-6 lg:p-8"
              aria-labelledby="home-audience-drivers"
            >
              <div className="border-l-4 border-amber-500 pl-4">
                <div className="flex items-start gap-3">
                  <Car className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden />
                  <div className="min-w-0">
                    <Text
                      as="h2"
                      id="home-audience-drivers"
                      className="text-base font-bold text-white sm:text-lg"
                    >
                      {t('home.audienceDriversTitle')}
                    </Text>
                    <Text className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                      {t('home.audienceDriversLead')}
                    </Text>
                  </div>
                </div>
                <div className="my-4 h-px bg-white/10 sm:my-5" />
                <ul className="space-y-2.5 sm:space-y-3">
                  {driverFeatures.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex gap-2 text-[11px] leading-snug text-zinc-200 sm:text-sm"
                    >
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90"
                        aria-hidden
                      />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[10px] tracking-wide text-zinc-500 sm:text-[11px]">
                  {t('home.audienceDriversFlow')}
                </p>
              </div>
            </section>

            <section
              className="min-w-0 bg-[#1a1526] p-4 sm:p-6 lg:p-8"
              aria-labelledby="home-audience-providers"
            >
              <div className="border-l-4 border-violet-400 pl-4">
                <div className="flex items-start gap-3">
                  <Building2
                    className="mt-0.5 h-5 w-5 shrink-0 text-violet-300"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <Text
                      as="h2"
                      id="home-audience-providers"
                      className="text-base font-bold text-white sm:text-lg"
                    >
                      {t('home.audienceProvidersTitle')}
                    </Text>
                    <Text className="mt-2 text-xs leading-relaxed text-zinc-400 sm:text-sm">
                      {t('home.audienceProvidersLead')}
                    </Text>
                  </div>
                </div>
                <div className="my-4 h-px bg-white/10 sm:my-5" />
                <ul className="space-y-2.5 sm:space-y-3">
                  {providerFeatures.map(({ icon: Icon, text }) => (
                    <li
                      key={text}
                      className="flex gap-2 text-[11px] leading-snug text-zinc-200 sm:text-sm"
                    >
                      <Icon
                        className="mt-0.5 h-4 w-4 shrink-0 text-violet-300"
                        aria-hidden
                      />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[10px] tracking-wide text-zinc-500 sm:text-[11px]">
                  {t('home.audienceProvidersFlow')}
                </p>
              </div>
            </section>
          </div>
        </section>

        <footer className="mt-auto border-t border-zinc-800/60 pt-4 text-xs text-zinc-500 sm:pt-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Text as="span" className="text-xs text-zinc-500">
              © {new Date().getFullYear()} {t('common.appName')}. {t('home.rightsReserved')}
            </Text>
          </div>
        </footer>
      </div>
    </main>
  );
}
