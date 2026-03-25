import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useRequestPasswordReset } from '@/api';
import { AccentSwitcher } from '@/components/AccentSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import {
  createForgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@autohub/shared';

export function ForgotPasswordPage() {
  const { t, i18n } = useTranslation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const resetMutation = useRequestPasswordReset();

  const schema = useMemo(
    () =>
      createForgotPasswordSchema({
        emailRequired: t('auth.validation.emailRequired'),
        emailInvalid: t('auth.validation.emailInvalid'),
      }),
    [t, i18n.language],
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  useEffect(() => {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }, [form, i18n.language]);

  const onSubmit = form.handleSubmit((values) => {
    setSubmitError(null);
    setSubmitted(false);
    resetMutation.mutate(values, {
      onSuccess: () => {
        setSubmitted(true);
      },
      onError: () => {
        setSubmitError(t('auth.forgotPasswordFailed'));
      },
    });
  });

  const inputClass =
    'flex h-11 w-full rounded-xl border bg-slate-950/60 px-3.5 text-sm text-slate-50 shadow-inner placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
        <div className="animate-[pulse_10s_ease-in-out_infinite] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(147,51,234,0.16),_transparent_55%)] blur-3xl" />
      </div>
      <div className="container flex min-h-screen flex-col py-6">
        <header className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg outline-none ring-offset-slate-950 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/40">
              <Text
                as="span"
                className="text-lg font-semibold tracking-tight text-primary"
              >
                A
              </Text>
            </div>
            <div className="flex flex-col text-left">
              <Text as="span" className="text-sm font-semibold tracking-tight">
                {t('common.appName')}
              </Text>
              <Text as="span" variant="muted" className="text-xs">
                {t('home.tagline')}
              </Text>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <AccentSwitcher />
            <LanguageSwitcher />
          </div>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[420px] rounded-2xl border border-slate-800/80 bg-slate-900/50 p-8 shadow-xl shadow-black/25 backdrop-blur sm:p-10">
            <Text as="h1" variant="h3" className="text-slate-50">
              {t('auth.forgotPasswordTitle')}
            </Text>
            <Text className="mt-2 text-slate-400" variant="muted">
              {t('auth.forgotPasswordDescription')}
            </Text>
            <Text className="mt-3 text-xs text-slate-500" variant="muted">
              {t('auth.forgotPasswordGoogleOnlyHint')}
            </Text>

            {submitted ? (
              <Text className="mt-8 text-sm text-emerald-400/90">
                {t('auth.forgotPasswordSuccess')}
              </Text>
            ) : (
              <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label
                    htmlFor="forgot-email"
                    className="text-sm font-medium leading-none text-slate-200"
                  >
                    {t('auth.emailLabel')}
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('auth.emailPlaceholder')}
                    className={cn(
                      inputClass,
                      form.formState.errors.email
                        ? 'border-destructive'
                        : 'border-slate-700',
                    )}
                    {...form.register('email')}
                  />
                  {form.formState.errors.email ? (
                    <Text className="text-xs text-destructive">
                      {form.formState.errors.email.message}
                    </Text>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full rounded-full shadow-lg shadow-primary/25"
                  disabled={
                    form.formState.isSubmitting || resetMutation.isPending
                  }
                >
                  {t('auth.forgotPasswordSubmit')}
                </Button>
                {submitError ? (
                  <Text className="text-xs text-destructive">{submitError}</Text>
                ) : null}
              </form>
            )}

            <Text
              as="p"
              variant="muted"
              className="mt-8 text-center text-xs text-slate-500"
            >
              <Link
                to="/login"
                className="text-slate-400 underline-offset-4 transition hover:text-slate-200 hover:underline"
              >
                {t('auth.backToLogin')}
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </main>
  );
}
