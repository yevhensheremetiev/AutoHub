import { useEffect, useMemo } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Car, Save } from 'lucide-react';

import { useCars, useUpdateCar } from '@/api/queries/cars';
import { DriverCarFormFields } from '@/components/driver/DriverCarFormFields';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  createDriverCarFormSchema,
  driverCarFormToApi,
  type DriverCarFormValues,
} from '@/pages/driver/driverCarFormSchema';

export function DriverEditCarPage() {
  const { carId } = useParams<{ carId: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: cars = [], isLoading } = useCars();
  const updateCar = useUpdateCar();

  const car = cars.find((item) => item.id === carId);

  const schema = useMemo(
    () => createDriverCarFormSchema(t),
    [t, i18n.language],
  );

  const form = useForm<DriverCarFormValues>({
    resolver: zodResolver(schema) as unknown as Resolver<DriverCarFormValues>,
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      plate: '',
      vin: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (!car) return;
    form.reset({
      make: car.make,
      model: car.model,
      year: car.year ?? undefined,
      plate: car.licensePlate ?? '',
      vin: car.vin ?? '',
    });
  }, [car, form]);

  useEffect(() => {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }, [form, i18n.language]);

  if (!carId) {
    return <Navigate to="/dashboard/cars" replace />;
  }

  if (!isLoading && !car) {
    return <Navigate to="/dashboard/cars" replace />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    if (!carId) return;
    try {
      await updateCar.mutateAsync({
        carId,
        input: driverCarFormToApi(values),
      });
      navigate('/dashboard/cars');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const msg = (err.response?.data as { message?: string })?.message;
        const isVin =
          typeof msg === 'string' && msg.toLowerCase().includes('vin');
        form.setError('root', {
          message:
            msg ??
            (isVin
              ? t('driver.editCar.duplicateVinError')
              : t('driver.editCar.duplicatePlateError')),
        });
        return;
      }
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        const data = err.response?.data as {
          message?: string;
          issues?: { fieldErrors?: Record<string, string[]> };
        };
        const vinIssue = data.issues?.fieldErrors?.vin?.[0];
        if (vinIssue) {
          form.setError('vin', { message: vinIssue });
          return;
        }
        form.setError('root', {
          message: data.message ?? t('driver.editCar.saveError'),
        });
        return;
      }
      form.setError('root', { message: t('driver.editCar.saveError') });
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Text as="h1" variant="h3" className="text-slate-50">
            {t('driver.editCar.title')}
          </Text>
          <Text className="mt-1 text-slate-400" variant="muted">
            {t('driver.editCar.subtitle')}
          </Text>
        </div>
      </div>

      {!isLoading ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 shadow-lg shadow-black/10">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30">
              <Car className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <Text className="font-semibold text-slate-50">
                {t('driver.editCar.formTitle')}
              </Text>
              <Text className="mt-1 text-sm text-slate-400">
                {t('driver.editCar.formHint')}
              </Text>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
            {form.formState.errors.root ? (
              <Text className="text-destructive sm:col-span-2">
                {form.formState.errors.root.message}
              </Text>
            ) : null}
            <DriverCarFormFields form={form} />

            <div className="sm:col-span-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="button"
                variant="ghost"
                className="text-slate-200 hover:bg-slate-800/70 hover:text-slate-50"
                onClick={() => navigate('/dashboard/cars')}
              >
                {t('driver.editCar.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || updateCar.isPending}
              >
                <Save className="mr-2 h-4 w-4" aria-hidden />
                {t('driver.editCar.save')}
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
