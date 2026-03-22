import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AccentSwitcher } from '@/components/AccentSwitcher';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeHideIcon from '@/assets/icons/eye-hide.svg';
import googleIcon from '@/assets/icons/google.svg';
import { api } from '@/api/client';
import { firebaseAuth, googleProvider } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { createSignUpSchema, type SignUpFormValues } from '@autohub/shared';

export function SignUpPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signUpSchema = useMemo(
    () =>
      createSignUpSchema({
        firstNameRequired: t('auth.validation.firstNameRequired'),
        lastNameRequired: t('auth.validation.lastNameRequired'),
        emailRequired: t('auth.validation.emailRequired'),
        emailInvalid: t('auth.validation.emailInvalid'),
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

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }, [form, i18n.language]);

  const onSubmit = form.handleSubmit(() => {});

  async function handleGoogleSignUp() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(
      firebaseAuth,
      googleProvider ?? provider,
    );
    const idToken = await result.user.getIdToken();

    await api.post('/auth/google', { idToken });

    navigate('/profile');
  }

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
              {t('auth.signUpTitle')}
            </Text>
            <Text className="mt-2 text-slate-400" variant="muted">
              {t('auth.signUpDescription')}
            </Text>

            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-1">
                  <label
                    htmlFor="signup-first-name"
                    className="text-sm font-medium leading-none text-slate-200"
                  >
                    {t('auth.firstNameLabel')}
                  </label>
                  <input
                    id="signup-first-name"
                    type="text"
                    autoComplete="given-name"
                    placeholder={t('auth.firstNamePlaceholder')}
                    className={cn(
                      inputClass,
                      form.formState.errors.firstName
                        ? 'border-destructive'
                        : 'border-slate-700',
                    )}
                    {...form.register('firstName')}
                  />
                  {form.formState.errors.firstName ? (
                    <Text className="text-xs text-destructive">
                      {form.formState.errors.firstName.message}
                    </Text>
                  ) : null}
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <label
                    htmlFor="signup-last-name"
                    className="text-sm font-medium leading-none text-slate-200"
                  >
                    {t('auth.lastNameLabel')}
                  </label>
                  <input
                    id="signup-last-name"
                    type="text"
                    autoComplete="family-name"
                    placeholder={t('auth.lastNamePlaceholder')}
                    className={cn(
                      inputClass,
                      form.formState.errors.lastName
                        ? 'border-destructive'
                        : 'border-slate-700',
                    )}
                    {...form.register('lastName')}
                  />
                  {form.formState.errors.lastName ? (
                    <Text className="text-xs text-destructive">
                      {form.formState.errors.lastName.message}
                    </Text>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="signup-email"
                  className="text-sm font-medium leading-none text-slate-200"
                >
                  {t('auth.emailLabel')}
                </label>
                <input
                  id="signup-email"
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

              <div className="space-y-2">
                <label
                  htmlFor="signup-password"
                  className="text-sm font-medium leading-none text-slate-200"
                >
                  {t('auth.passwordLabel')}
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('auth.passwordPlaceholder')}
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
                  htmlFor="signup-confirm-password"
                  className="text-sm font-medium leading-none text-slate-200"
                >
                  {t('auth.confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <input
                    id="signup-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('auth.confirmPasswordPlaceholderSignUp')}
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
              >
                {t('auth.signUpSubmit')}
              </Button>
            </form>

            <div className="relative my-8">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden
              >
                <span className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-wide">
                <Text
                  as="span"
                  variant="muted"
                  className="bg-slate-900/80 px-3 text-slate-500"
                >
                  {t('auth.orContinueWith')}
                </Text>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11 w-full rounded-full border-slate-600 bg-slate-950/40 text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-900/80"
              onClick={() => void handleGoogleSignUp()}
            >
              <img
                src={googleIcon}
                alt=""
                className="mr-2 h-5 w-5 shrink-0"
                aria-hidden
              />
              {t('auth.signUpWithGoogle')}
            </Button>

            <Text
              as="p"
              variant="muted"
              className="mt-8 text-center text-xs text-slate-500"
            >
              {t('auth.hasAccountPrompt')}{' '}
              <Link
                to="/login"
                className="font-medium text-primary underline-offset-4 transition hover:underline"
              >
                {t('auth.signIn')}
              </Link>
            </Text>

            <Text
              as="p"
              variant="muted"
              className="mt-3 text-center text-xs text-slate-500"
            >
              <Link
                to="/"
                className="text-slate-400 underline-offset-4 transition hover:text-slate-200 hover:underline"
              >
                {t('auth.backToHome')}
              </Link>
            </Text>
          </div>
        </div>
      </div>
    </main>
  );
}
