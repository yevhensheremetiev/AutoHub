import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { z } from 'zod';

import { useServiceProfile, useUpdateServiceProfile } from '@/api';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

const profileFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  address: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((value) => /^[^,]{2,},\s*[^,]{2,}/.test(value), {
      message: 'Use format: City / town, street',
    }),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine(
      (value) => {
        if (value === '') return true;
        if (!/^[+\d][\d\s()-]*$/.test(value)) return false;
        const digits = value.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      { message: 'Enter a valid phone number' },
    ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const inputClass =
  'flex h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 text-sm text-slate-50 shadow-inner placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

export function ServiceCenterProfilePage() {
  const { t } = useTranslation();
  const { data: profile, isLoading, isError } = useServiceProfile();
  const updateMutation = useUpdateServiceProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      name: profile.name,
      address: profile.address,
      phone: profile.phone ?? '',
    });
  }, [profile, form]);

  const onSubmit = form.handleSubmit((values) => {
    updateMutation.mutate(
      {
        name: values.name,
        address: values.address,
        phone: values.phone || undefined,
        hours: undefined,
      },
      {
        onSuccess: () => {
          form.reset(values);
        },
      },
    );
  });

  if (isLoading) {
    return null;
  }

  if (isError || !profile) {
    return <Text variant="muted">{t('service.errors.loadFailed')}</Text>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Text as="h1" variant="h3">
          {t('service.profile.title')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {t('service.profile.subtitle')}
        </Text>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
        <span>
          {profile.ratingAvg != null ? profile.ratingAvg.toFixed(1) : '—'} ·{' '}
          {t('service.profile.reviewCount', { count: profile.ratingCount })}
        </span>
      </div>

      <form
        onSubmit={(e) => void onSubmit(e)}
        className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 space-y-5"
      >
        <Text className="text-sm font-semibold text-slate-200">
          {t('service.profile.formTitle')}
        </Text>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-500" htmlFor="service-name">
              {t('service.profile.nameLabel')}
            </label>
            <input
              id="service-name"
              className={cn(inputClass, 'mt-1.5')}
              {...form.register('name')}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500" htmlFor="service-address">
              {t('service.profile.address')}
            </label>
            <input
              id="service-address"
              className={cn(inputClass, 'mt-1.5')}
              {...form.register('address')}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500" htmlFor="service-phone">
              {t('service.profile.phone')}
            </label>
            <input
              id="service-phone"
              className={cn(inputClass, 'mt-1.5')}
              {...form.register('phone')}
            />
          </div>
        </div>

        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending
            ? t('service.profile.saving')
            : t('service.profile.edit.save')}
        </Button>
        {form.formState.isSubmitted &&
        Object.keys(form.formState.errors).length > 0 ? (
          <Text className="text-xs text-rose-300" variant="muted">
            {t('auth.validation.formHasErrors')}
          </Text>
        ) : null}
        {updateMutation.isSuccess ? (
          <Text className="text-xs text-emerald-400" variant="muted">
            {t('service.profile.saved')}
          </Text>
        ) : null}
      </form>
    </div>
  );
}
