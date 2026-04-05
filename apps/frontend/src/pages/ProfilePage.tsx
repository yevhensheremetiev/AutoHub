import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Shield, UserRound } from 'lucide-react';

import { useChangePassword, useMe, useUpdateProfile } from '@/api';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import eyeIcon from '@/assets/icons/eye.svg';
import eyeHideIcon from '@/assets/icons/eye-hide.svg';
import { cn } from '@/lib/utils';
import {
  createChangePasswordFormSchema,
  createUpdateProfileSchema,
  type ChangePasswordFormValues,
  type UpdateProfileFormValues,
} from '@autohub/shared';

function getErrorStatus(err: unknown): number | undefined {
  if (!err || typeof err !== 'object') return undefined;
  const response = (err as { response?: unknown }).response;
  if (!response || typeof response !== 'object') return undefined;
  const status = (response as { status?: unknown }).status;
  return typeof status === 'number' ? status : undefined;
}

function getApiMessage(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined;
  const raw = err.response?.data;
  if (!raw || typeof raw !== 'object') return undefined;
  const message = (raw as { message?: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && typeof message[0] === 'string') {
    return message[0];
  }
  return undefined;
}

function displayInitials(name: string | null, email: string | null): string {
  const n = (name ?? '').trim();
  if (n.length) {
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0]?.[0];
      const b = parts[parts.length - 1]?.[0];
      if (a && b) return `${a}${b}`.toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }
  const e = (email ?? '').trim();
  if (e.length) return e.slice(0, 2).toUpperCase();
  return '?';
}

const inputClass =
  'flex h-11 w-full rounded-xl border bg-slate-950/60 px-3.5 text-sm text-slate-50 shadow-inner placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

const cardClass =
  'rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-lg shadow-black/20 backdrop-blur sm:p-7';

/** Driver dashboard: `/dashboard/profile` (layout provides chrome and log out). */
export function ProfilePage() {
  const navigate = useNavigate();
  const { data: me, isError, error, isFetching } = useMe();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const { t, i18n } = useTranslation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nameFeedback, setNameFeedback] = useState<'ok' | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<'ok' | null>(null);
  const [nameSubmitError, setNameSubmitError] = useState<string | null>(null);
  const [passwordSubmitError, setPasswordSubmitError] = useState<string | null>(
    null,
  );

  const updateProfileSchema = useMemo(
    () =>
      createUpdateProfileSchema({
        displayNameRequired: t('profile.validation.displayNameRequired'),
        displayNameTooLong: t('profile.validation.displayNameTooLong'),
      }),
    [t, i18n.language],
  );

  const changePasswordSchema = useMemo(
    () =>
      createChangePasswordFormSchema({
        currentPasswordRequired: t('auth.validation.currentPasswordRequired'),
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

  const nameForm = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: '' },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  useEffect(() => {
    if (!isError) return;
    if (isFetching) return;

    const status = getErrorStatus(error);
    if (status === 401) {
      navigate('/login');
    }
  }, [isError, error, isFetching, navigate]);

  useEffect(() => {
    if (!me) return;
    nameForm.reset({ name: me.name ?? '' });
  }, [me, nameForm]);

  useEffect(() => {
    if (nameForm.formState.submitCount > 0) {
      void nameForm.trigger();
    }
  }, [nameForm, i18n.language]);

  useEffect(() => {
    if (passwordForm.formState.submitCount > 0) {
      void passwordForm.trigger();
    }
  }, [passwordForm, i18n.language]);

  const onNameSubmit = nameForm.handleSubmit((values) => {
    setNameSubmitError(null);
    setNameFeedback(null);
    updateProfileMutation.mutate(
      { name: values.name },
      {
        onSuccess: () => {
          setNameFeedback('ok');
          window.setTimeout(() => setNameFeedback(null), 4000);
        },
        onError: () => {
          setNameSubmitError(t('profile.errors.generic'));
        },
      },
    );
  });

  const onPasswordSubmit = passwordForm.handleSubmit((values) => {
    setPasswordSubmitError(null);
    setPasswordFeedback(null);
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          passwordForm.reset({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
          });
          setPasswordFeedback('ok');
          window.setTimeout(() => setPasswordFeedback(null), 5000);
        },
        onError: (err) => {
          const code = getApiMessage(err);
          if (code === 'INVALID_CURRENT_PASSWORD') {
            setPasswordSubmitError(t('profile.errors.invalidCurrentPassword'));
            return;
          }
          if (code === 'PASSWORD_SIGN_IN_NOT_SET') {
            setPasswordSubmitError(t('profile.errors.passwordSignInNotSet'));
            return;
          }
          setPasswordSubmitError(t('profile.errors.generic'));
        },
      },
    );
  });

  if (!me) {
    return null;
  }

  const canChangePassword = me.passwordSignInEnabled !== false;
  const initials = displayInitials(me.name, me.email);
  const displayName = me.name?.trim() || t('profile.noName');

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('profile.title')}
        </Text>
        <Text className="mt-2 max-w-xl text-slate-400" variant="muted">
          {t('profile.subtitle')}
        </Text>
      </header>

      <div className={cn(cardClass, 'text-center sm:text-left')}>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div
            className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 text-2xl font-semibold tracking-tight text-primary ring-2 ring-primary/35"
            aria-label={displayName}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <Text as="p" className="text-lg font-semibold text-slate-50">
              {displayName}
            </Text>
            <Text className="text-sm text-slate-400">
              {me.email ?? t('profile.noEmail')}
            </Text>
          </div>
        </div>
      </div>

      <section className={cardClass} aria-labelledby="profile-account-heading">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-primary">
            <UserRound className="h-4 w-4" aria-hidden />
          </div>
          <Text
            as="h2"
            id="profile-account-heading"
            className="text-base font-semibold text-slate-100"
          >
            {t('profile.accountCardTitle')}
          </Text>
        </div>

        <form className="space-y-6" onSubmit={onNameSubmit} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="profile-display-name"
              className="text-sm font-medium text-slate-200"
            >
              {t('profile.displayNameLabel')}
            </label>
            <input
              id="profile-display-name"
              type="text"
              autoComplete="name"
              className={cn(
                inputClass,
                nameForm.formState.errors.name
                  ? 'border-destructive'
                  : 'border-slate-700',
              )}
              {...nameForm.register('name')}
            />
            {nameForm.formState.errors.name ? (
              <Text className="text-xs text-destructive">
                {nameForm.formState.errors.name.message}
              </Text>
            ) : (
              <Text className="text-xs text-slate-500">
                {t('profile.displayNameHint')}
              </Text>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile-email"
              className="text-sm font-medium text-slate-200"
            >
              {t('profile.emailLabel')}
            </label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                aria-hidden
              />
              <input
                id="profile-email"
                type="email"
                readOnly
                value={me.email ?? ''}
                className={cn(
                  inputClass,
                  'cursor-not-allowed border-slate-800 pl-10 text-slate-400',
                )}
              />
            </div>
            <Text className="text-xs text-slate-500">
              {t('profile.emailReadOnlyHint')}
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              className="rounded-full"
              disabled={
                updateProfileMutation.isPending || !nameForm.formState.isDirty
              }
            >
              {updateProfileMutation.isPending
                ? t('profile.savingName')
                : t('profile.saveName')}
            </Button>
            {nameFeedback === 'ok' ? (
              <Text className="text-sm text-emerald-400/90">
                {t('profile.nameSaved')}
              </Text>
            ) : null}
          </div>
          {nameSubmitError ? (
            <Text className="text-xs text-destructive">{nameSubmitError}</Text>
          ) : null}
        </form>
      </section>

      <section className={cardClass} aria-labelledby="profile-security-heading">
        <div className="mb-5 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-primary">
            <Shield className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <Text
              as="h2"
              id="profile-security-heading"
              className="text-base font-semibold text-slate-100"
            >
              {t('profile.securityCardTitle')}
            </Text>
            <Text className="text-xs text-slate-500">
              {t('profile.securityCardHint')}
            </Text>
          </div>
        </div>

        {!canChangePassword ? (
          <div className="rounded-xl border border-slate-800/90 bg-slate-950/40 px-4 py-3">
            <Text className="text-sm text-slate-400">
              {t('profile.googleOnlyPassword')}
            </Text>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={onPasswordSubmit} noValidate>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs text-primary"
                onClick={() => navigate('/forgot-password')}
              >
                {t('profile.forgotPasswordLink')}
              </Button>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-current-password"
                className="text-sm font-medium text-slate-200"
              >
                {t('profile.currentPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  id="profile-current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className={cn(
                    inputClass,
                    'pr-12',
                    passwordForm.formState.errors.currentPassword
                      ? 'border-destructive'
                      : 'border-slate-700',
                  )}
                  {...passwordForm.register('currentPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-slate-400 hover:bg-transparent hover:text-slate-100"
                  aria-label={
                    showCurrentPassword
                      ? t('auth.hidePassword')
                      : t('auth.showPassword')
                  }
                  aria-pressed={showCurrentPassword}
                  onClick={() => setShowCurrentPassword((v) => !v)}
                >
                  <img
                    src={showCurrentPassword ? eyeHideIcon : eyeIcon}
                    alt=""
                    className="h-5 w-5 shrink-0 brightness-0 invert"
                    aria-hidden
                  />
                </Button>
              </div>
              {passwordForm.formState.errors.currentPassword ? (
                <Text className="text-xs text-destructive">
                  {passwordForm.formState.errors.currentPassword.message}
                </Text>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-new-password"
                className="text-sm font-medium text-slate-200"
              >
                {t('profile.newPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  id="profile-new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    inputClass,
                    'pr-12',
                    passwordForm.formState.errors.newPassword
                      ? 'border-destructive'
                      : 'border-slate-700',
                  )}
                  {...passwordForm.register('newPassword')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-slate-400 hover:bg-transparent hover:text-slate-100"
                  aria-label={
                    showNewPassword
                      ? t('auth.hidePassword')
                      : t('auth.showPassword')
                  }
                  aria-pressed={showNewPassword}
                  onClick={() => setShowNewPassword((v) => !v)}
                >
                  <img
                    src={showNewPassword ? eyeHideIcon : eyeIcon}
                    alt=""
                    className="h-5 w-5 shrink-0 brightness-0 invert"
                    aria-hidden
                  />
                </Button>
              </div>
              {passwordForm.formState.errors.newPassword ? (
                <Text className="text-xs text-destructive">
                  {passwordForm.formState.errors.newPassword.message}
                </Text>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-confirm-password"
                className="text-sm font-medium text-slate-200"
              >
                {t('profile.confirmNewPasswordLabel')}
              </label>
              <div className="relative">
                <input
                  id="profile-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cn(
                    inputClass,
                    'pr-12',
                    passwordForm.formState.errors.confirmNewPassword
                      ? 'border-destructive'
                      : 'border-slate-700',
                  )}
                  {...passwordForm.register('confirmNewPassword')}
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
              {passwordForm.formState.errors.confirmNewPassword ? (
                <Text className="text-xs text-destructive">
                  {passwordForm.formState.errors.confirmNewPassword.message}
                </Text>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="submit"
                className="rounded-full"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? t('profile.changingPassword')
                  : t('profile.changePassword')}
              </Button>
              {passwordFeedback === 'ok' ? (
                <Text className="text-sm text-emerald-400/90">
                  {t('profile.passwordChanged')}
                </Text>
              ) : null}
            </div>
            {passwordSubmitError ? (
              <Text className="text-xs text-destructive">
                {passwordSubmitError}
              </Text>
            ) : null}
          </form>
        )}
      </section>
    </div>
  );
}
