import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useCompletePasswordReset } from '@/api';
import { AccentSwitcher } from '@/components/AccentSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeHideIcon from '@/assets/icons/eye-hide.svg';
import { cn } from '@/lib/utils';
import {
  createResetPasswordSchema,
  type ResetPasswordFormValues,
} from '@autohub/shared';

export function ResetPasswordPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const resetMutation = useCompletePasswordReset();

  const schema = useMemo(
    () =>
      createResetPasswordSchema({
        passwordRequired: t('auth.validation.passwordRequired'),
        passwordMinLength: t('auth.validation.passwordMinLength'),
        passwordLowercase: t('auth.validation.passwordLowercase'),
        passwordUppercase: t('auth.validation.passwordUppercase'),
        passwordDigit: t('auth.validation.passwordDigit'),
        passwordSpecial: t('auth.validation.passwordSpecial'),
        confirmPasswordRequired: t('auth.validation.confirmPasswordRequired'),
        passwordsMustMatch: t('auth.validation.passwordsMustMatch'),
      }),
    [t, i18n.language],
  );

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }, [form, i18n.language]);

  const onSubmit = form.handleSubmit((values) => {
    setSubmitError(null);
    resetMutation.mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          setResetSuccess(true);
        },
        onError: (error) => {
          if (
            axios.isAxiosError(error) &&
            error.response?.status === 400
          ) {
            setSubmitError(t('auth.resetPasswordBadToken'));
            return;
          }
          setSubmitError(t('auth.resetPasswordFailed'));
        },
      },
    );
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
            {!token.length ? (
              <>
                <Text as="h1" variant="h3" className="text-slate-50">
                  {t('auth.resetPasswordInvalidTitle')}
                </Text>
                <Text className="mt-2 text-slate-400" variant="muted">
                  {t('auth.resetPasswordInvalidDescription')}
                </Text>
                <div className="mt-8 flex flex-col gap-3">
                  <Button
                    type="button"
                    className="h-11 w-full rounded-full shadow-lg shadow-primary/25"
                    size="lg"
                    onClick={() => navigate('/forgot-password')}
                  >
                    {t('auth.resetPasswordRequestNewLink')}
                  </Button>
                  <Text
                    as="p"
                    variant="muted"
                    className="text-center text-xs text-slate-500"
                  >
                    <Link
                      to="/login"
                      className="text-slate-400 underline-offset-4 transition hover:text-slate-200 hover:underline"
                    >
                      {t('auth.backToLogin')}
                    </Link>
                  </Text>
                </div>
              </>
            ) : resetSuccess ? (
              <>
                <Text as="h1" variant="h3" className="text-slate-50">
                  {t('auth.resetPasswordSuccessTitle')}
                </Text>
                <Text className="mt-2 text-slate-400" variant="muted">
                  {t('auth.resetPasswordSuccessDescription')}
                </Text>
                <div className="mt-8">
                  <Button
                    type="button"
                    className="h-11 w-full rounded-full shadow-lg shadow-primary/25"
                    size="lg"
                    onClick={() => navigate('/login')}
                  >
                    {t('auth.signIn')}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Text as="h1" variant="h3" className="text-slate-50">
                  {t('auth.resetPasswordTitle')}
                </Text>
                <Text className="mt-2 text-slate-400" variant="muted">
                  {t('auth.resetPasswordDescription')}
                </Text>

                <form className="mt-8 space-y-5" onSubmit={onSubmit}>
                  <div className="space-y-2">
                    <label
                      htmlFor="reset-password-new"
                      className="text-sm font-medium leading-none text-slate-200"
                    >
                      {t('auth.newPasswordLabel')}
                    </label>
                    <div className="relative">
                      <input
                        id="reset-password-new"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder={t('auth.newPasswordPlaceholder')}
                        className={cn(
                          inputClass,
                          'pr-12',
                          form.formState.errors.password
                            ? 'border-destructive'
                            : 'border-slate-700',
                        )}
                        {...form.register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-slate-400 hover:bg-transparent hover:text-slate-100"
                        aria-label={
                          showPassword
                            ? t('auth.hidePassword')
                            : t('auth.showPassword')
                        }
                        aria-pressed={showPassword}
                        onClick={() => setShowPassword((v) => !v)}
                      >
                        <img
                          src={showPassword ? eyeHideIcon : eyeIcon}
                          alt=""
                          className="h-5 w-5 shrink-0 brightness-0 invert"
                          aria-hidden
                        />
                      </Button>
                    </div>
                    {form.formState.errors.password ? (
                      <Text className="text-xs text-destructive">
                        {form.formState.errors.password.message}
                      </Text>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="reset-password-confirm"
                      className="text-sm font-medium leading-none text-slate-200"
                    >
                      {t('auth.confirmPasswordLabel')}
                    </label>
                    <div className="relative">
                      <input
                        id="reset-password-confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder={t('auth.confirmPasswordPlaceholder')}
                        className={cn(
                          inputClass,
                          'pr-12',
                          form.formState.errors.confirmPassword
                            ? 'border-destructive'
                            : 'border-slate-700',
                        )}
                        {...form.register('confirmPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-slate-400 hover:bg-transparent hover:text-slate-100"
                        aria-label={
                          showConfirmPassword
                            ? t('auth.hidePassword')
                            : t('auth.showPassword')
                        }
                        aria-pressed={showConfirmPassword}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                      >
                        <img
                          src={showConfirmPassword ? eyeHideIcon : eyeIcon}
                          alt=""
                          className="h-5 w-5 shrink-0 brightness-0 invert"
                          aria-hidden
                        />
                      </Button>
                    </div>
                    {form.formState.errors.confirmPassword ? (
                      <Text className="text-xs text-destructive">
                        {form.formState.errors.confirmPassword.message}
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
                    {t('auth.resetPasswordSubmit')}
                  </Button>
                  {submitError ? (
                    <Text className="text-xs text-destructive">
                      {submitError}
                    </Text>
                  ) : null}
                </form>

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
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
