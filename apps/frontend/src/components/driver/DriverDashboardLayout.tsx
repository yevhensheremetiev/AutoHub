import { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, History, Home, LogOut, Map, User } from 'lucide-react';

import { useLogout, useMe } from '@/api';
import { AccentSwitcher } from '@/components/AccentSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function getErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const response = (err as { response?: unknown }).response;
  if (!response || typeof response !== 'object') return undefined;
  const status = (response as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

const navClass =
  'flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors md:flex-row md:gap-2 md:text-sm';
const navActive =
  'bg-primary/15 text-primary ring-1 ring-primary/40';
const navInactive = 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100';

export function DriverDashboardLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: me, isLoading, isError, error, isFetching } = useMe();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (!isError) return;
    if (isFetching) return;
    const status = getErrorStatus(error);
    if (status === 401) {
      navigate('/login');
    }
  }, [isError, error, isFetching, navigate]);

  async function handleLogout() {
    await logoutMutation.mutateAsync();
    navigate('/login');
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-50">
        <Text variant="muted">{t('driver.loading')}</Text>
      </main>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-50">
        <div className="animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(circle_at_20%_20%,_rgba(56,189,248,0.12),_transparent_50%),_radial-gradient(circle_at_80%_60%,_rgba(147,51,234,0.12),_transparent_50%)] blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between gap-3 md:h-16">
          <Link
            to="/"
            className="flex min-w-0 max-w-full items-center gap-3 rounded-lg outline-none ring-offset-slate-950 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/40">
              <Text
                as="span"
                className="text-lg font-semibold tracking-tight text-primary"
              >
                A
              </Text>
            </div>
            <div className="min-w-0">
              <Text as="span" className="block truncate text-sm font-semibold">
                {t('driver.headerTitle')}
              </Text>
              <Text
                as="span"
                variant="muted"
                className="block truncate text-xs text-slate-400"
              >
                {t('home.tagline')}
              </Text>
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <AccentSwitcher />
            <LanguageSwitcher />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-600 bg-slate-900/50 text-slate-100 hover:bg-slate-800"
              disabled={logoutMutation.isPending}
              onClick={() => void handleLogout()}
            >
              <LogOut className="mr-1.5 h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">{t('profile.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex flex-1 flex-col pb-24 md:flex-row md:pb-8 md:pt-6">
        <nav
          className="hidden w-52 shrink-0 flex-col gap-1 pr-6 md:flex"
          aria-label={t('driver.navAria')}
        >
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              cn(navClass, isActive ? navActive : navInactive)
            }
          >
            <Home className="h-4 w-4 shrink-0" aria-hidden />
            {t('driver.navHome')}
          </NavLink>
          <NavLink
            to="/dashboard/map"
            className={({ isActive }) =>
              cn(navClass, isActive ? navActive : navInactive)
            }
          >
            <Map className="h-4 w-4 shrink-0" aria-hidden />
            {t('driver.navMap')}
          </NavLink>
          <NavLink
            to="/dashboard/cars"
            className={({ isActive }) =>
              cn(navClass, isActive ? navActive : navInactive)
            }
          >
            <Car className="h-4 w-4 shrink-0" aria-hidden />
            {t('driver.navCars')}
          </NavLink>
          <NavLink
            to="/dashboard/history"
            className={({ isActive }) =>
              cn(navClass, isActive ? navActive : navInactive)
            }
          >
            <History className="h-4 w-4 shrink-0" aria-hidden />
            {t('driver.navHistory')}
          </NavLink>
          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              cn(navClass, isActive ? navActive : navInactive)
            }
          >
            <User className="h-4 w-4 shrink-0" aria-hidden />
            {t('driver.navProfile')}
          </NavLink>
        </nav>

        <main className="min-w-0 flex-1 pt-4 md:pt-0">
          <Outlet />
        </main>
      </div>

      <nav
        className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-800/80 bg-slate-950/95 px-2 py-2 backdrop-blur-md md:hidden"
        aria-label={t('driver.navAria')}
      >
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-medium',
              isActive ? 'text-primary' : 'text-slate-500',
            )
          }
        >
          <Home className="h-5 w-5" aria-hidden />
          {t('driver.navHome')}
        </NavLink>
        <NavLink
          to="/dashboard/map"
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-medium',
              isActive ? 'text-primary' : 'text-slate-500',
            )
          }
        >
          <Map className="h-5 w-5" aria-hidden />
          {t('driver.navMap')}
        </NavLink>
        <NavLink
          to="/dashboard/cars"
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-medium',
              isActive ? 'text-primary' : 'text-slate-500',
            )
          }
        >
          <Car className="h-5 w-5" aria-hidden />
          {t('driver.navCars')}
        </NavLink>
        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-medium',
              isActive ? 'text-primary' : 'text-slate-500',
            )
          }
        >
          <History className="h-5 w-5" aria-hidden />
          {t('driver.navHistory')}
        </NavLink>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-2 text-[10px] font-medium',
              isActive ? 'text-primary' : 'text-slate-500',
            )
          }
        >
          <User className="h-5 w-5" aria-hidden />
          {t('driver.navProfile')}
        </NavLink>
      </nav>
    </div>
  );
}
