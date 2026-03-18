import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'

export function NotFoundPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.20),_transparent_55%),_radial-gradient(circle_at_bottom,_hsl(var(--ring)/0.18),_transparent_60%)] blur-3xl" />
        <div className="absolute inset-0 opacity-[0.25] [background-image:linear-gradient(to_right,hsl(var(--foreground)/0.10)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/0.10)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(circle_at_center,black_25%,transparent_70%)]" />
      </div>

      <div className="container flex min-h-screen flex-col items-center justify-center py-12">
        <section className="w-full max-w-3xl animate-[fade-in_0.6s_ease-out]">
          <div className="rounded-3xl border bg-card/70 p-6 shadow-xl shadow-foreground/5 backdrop-blur sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <Text as="span">
                    {t('notFound.badge', { defaultValue: '404 · сторінку не знайдено' })}
                  </Text>
                </div>

                <Text
                  as="h1"
                  className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
                >
                  {t('notFound.title', { defaultValue: 'Упс… тут порожньо.' })}
                </Text>

                <Text className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
                  {t('notFound.description', {
                    defaultValue:
                      'Можливо, посилання застаріло, або сторінку перенесли. Перевірте адресу або поверніться туди, де все працює.',
                  })}
                </Text>
              </div>

              <div className="relative shrink-0 self-stretch sm:self-auto">
                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.35),_transparent_60%)] blur-2xl" />
                <div className="grid place-items-center rounded-2xl border bg-background/60 px-6 py-5 shadow-sm">
                  <Text
                    as="span"
                    className="select-none text-6xl font-semibold tracking-tight text-primary [text-shadow:0_1px_0_hsl(var(--background)),0_14px_30px_hsl(var(--primary)/0.18)] sm:text-7xl"
                  >
                    404
                  </Text>
                  <Text as="span" className="mt-1 text-xs text-muted-foreground">
                    {t('notFound.pathLabel', { defaultValue: 'Запитаний шлях' })}
                  </Text>
                  <Text
                    as="code"
                    className="mt-1 max-w-[16rem] truncate rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground"
                  >
                    {location.pathname}
                  </Text>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-full px-5 shadow-sm"
              >
                {t('notFound.backToHome', { defaultValue: 'На головну' })}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="rounded-full"
              >
                {t('notFound.goBack', { defaultValue: 'Назад' })}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/cars')}
                className="rounded-full"
              >
                {t('notFound.browseCars', { defaultValue: 'Перейти до авто' })}
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  title: t('notFound.tip1Title', { defaultValue: 'Спробуйте пошук' }),
                  body: t('notFound.tip1Body', {
                    defaultValue: 'Перейдіть до списку авто та відфільтруйте потрібне.',
                  }),
                },
                {
                  title: t('notFound.tip2Title', { defaultValue: 'Перевірте адресу' }),
                  body: t('notFound.tip2Body', {
                    defaultValue: 'Іноді помилка — це зайвий символ у URL.',
                  }),
                },
                {
                  title: t('notFound.tip3Title', { defaultValue: 'Увійдіть у профіль' }),
                  body: t('notFound.tip3Body', {
                    defaultValue: 'Деякі сторінки доступні лише після авторизації.',
                  }),
                },
              ].map((tip) => (
                <div
                  key={tip.title}
                  className="group rounded-2xl border bg-background/40 p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-background/70"
                >
                  <Text as="h2" className="text-sm font-medium tracking-tight">
                    {tip.title}
                  </Text>
                  <Text className="mt-1 text-xs text-muted-foreground">{tip.body}</Text>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-6 text-xs text-muted-foreground">
              <Text as="span">
                {t('notFound.supportHint', {
                  defaultValue: 'Якщо це виглядає як баг — оновіть сторінку або спробуйте пізніше.',
                })}
              </Text>
              <Text as="span" className="inline-flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border bg-background/60 px-2 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  <span>{t('notFound.status', { defaultValue: 'система працює' })}</span>
                </span>
              </Text>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

