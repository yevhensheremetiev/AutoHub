import { useEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import axios from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Car, Plus } from 'lucide-react';

import { useCreateCar } from '@/api/queries/cars';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

type DriverAddCarFormValues = {
  make: string;
  model: string;
  year?: number | undefined;
  plate: string;
};

export function DriverAddCarPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const createCar = useCreateCar();

  const schema = useMemo(() => {
    return z.object({
      make: z.string().trim().min(1, t('driver.addCar.validation.makeRequired')),
      model: z
        .string()
        .trim()
        .min(1, t('driver.addCar.validation.modelRequired')),
      year: z.preprocess(
        (v) => {
          if (v === '' || v === null || v === undefined) return undefined;
          const num = typeof v === 'number' ? v : Number(v);
          return Number.isFinite(num) ? num : undefined;
        },
        z
          .number()
          .int()
          .min(1900, t('driver.addCar.validation.yearInvalid'))
          .max(new Date().getFullYear() + 1, t('driver.addCar.validation.yearInvalid'))
          .optional(),
      ),
      plate: z
        .string()
        .trim()
        .min(1, t('driver.addCar.validation.plateRequired'))
        .max(20, t('driver.addCar.validation.plateTooLong')),
    });
  }, [t, i18n.language]);

  const form = useForm<DriverAddCarFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<DriverAddCarFormValues>,
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      plate: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }, [form, i18n.language]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createCar.mutateAsync({
        make: values.make.trim(),
        model: values.model.trim(),
        year: values.year,
        licensePlate: values.plate.trim(),
      });
      navigate('/dashboard/cars');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const msg = (err.response?.data as { message?: string })?.message;
        form.setError('root', {
          message: msg ?? t('driver.addCar.duplicatePlateError'),
        });
        return;
      }
      form.setError('root', { message: t('driver.addCar.saveError') });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text as="h1" variant="h3" className="text-slate-50">
            {t('driver.addCar.title')}
          </Text>
          <Text className="mt-1 text-slate-400" variant="muted">
            {t('driver.addCar.subtitle')}
          </Text>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg shadow-black/10">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
            <Car className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <Text className="font-semibold text-slate-50">
              {t('driver.addCar.formTitle')}
            </Text>
            <Text className="mt-1 text-sm text-slate-400">
              {t('driver.addCar.formHint')}
            </Text>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          {form.formState.errors.root ? (
            <Text className="text-destructive sm:col-span-2">
              {form.formState.errors.root.message}
            </Text>
          ) : null}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              {t('driver.addCar.makeLabel')}
            </label>
            <input
              type="text"
              {...form.register('make')}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t('driver.addCar.makePlaceholder')}
            />
            {form.formState.errors.make ? (
              <Text className="text-xs text-destructive">
                {form.formState.errors.make.message}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              {t('driver.addCar.modelLabel')}
            </label>
            <input
              type="text"
              {...form.register('model')}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t('driver.addCar.modelPlaceholder')}
            />
            {form.formState.errors.model ? (
              <Text className="text-xs text-destructive">
                {form.formState.errors.model.message}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              {t('driver.addCar.yearLabelOptional')}
            </label>
            <input
              type="number"
              inputMode="numeric"
              {...form.register('year')}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t('driver.addCar.yearPlaceholder')}
            />
            {form.formState.errors.year ? (
              <Text className="text-xs text-destructive">
                {form.formState.errors.year.message}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-200">
              {t('driver.addCar.plateLabel')}
            </label>
            <input
              type="text"
              {...form.register('plate')}
              className="w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder={t('driver.addCar.platePlaceholder')}
            />
            {form.formState.errors.plate ? (
              <Text className="text-xs text-destructive">
                {form.formState.errors.plate.message}
              </Text>
            ) : null}
          </div>

          <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="text-slate-200 hover:bg-slate-800/70 hover:text-slate-50"
              onClick={() => navigate('/dashboard/cars')}
            >
              {t('driver.addCar.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || createCar.isPending}
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden />
              {t('driver.addCar.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

