import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import {
  createCreateCarFormSchema,
  type CreateCarFormValues,
} from '@autohub/shared';
import { useCars, useCreateCar } from '@/api';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export function CarsPage() {
  const { data: cars, isLoading } = useCars();
  const createCar = useCreateCar();
  const { t, i18n } = useTranslation();

  const carSchema = useMemo(
    () =>
      createCreateCarFormSchema({
        makeRequired: t('cars.validation.brandRequired'),
        modelRequired: t('cars.validation.modelRequired'),
        yearInvalid: t('cars.validation.yearMustBeNumber'),
      }),
    [t, i18n.language],
  );

  const form = useForm<CreateCarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      vin: '',
    },
  });

  useEffect(() => {
    if (form.formState.submitCount > 0) {
      void form.trigger();
    }
  }, [form, i18n.language]);

  const onSubmit = form.handleSubmit((values) => {
    void createCar.mutateAsync({
      make: values.make,
      model: values.model,
      year: values.year ? Number(values.year) : undefined,
      vin: values.vin || undefined,
    });
    form.reset();
  });

  return (
    <main className="container py-10 space-y-6">
      <section>
        <Text as="h1" variant="h3">
          {t('cars.title')}
        </Text>
        {isLoading ? (
          <Text className="mt-2" variant="muted">
            {t('cars.loadingList')}
          </Text>
        ) : (
          <ul className="mt-4 space-y-2">
            {cars?.map((car) => (
              <li
                key={car.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <Text as="span">
                  {car.make} {car.model}{' '}
                  {car.year ? (
                    <Text as="span" className="text-muted-foreground">
                      ({car.year})
                    </Text>
                  ) : null}
                </Text>
                {car.vin ? (
                  <Text as="span" variant="muted" className="text-xs">
                    VIN: {car.vin}
                  </Text>
                ) : null}
              </li>
            ))}
            {!cars?.length && (
              <li>
                <Text variant="muted">{t('cars.emptyList')}</Text>
              </li>
            )}
          </ul>
        )}
      </section>

      <section>
        <Text as="h2" variant="h4">
          {t('cars.addCarTitle')}
        </Text>
        <form onSubmit={onSubmit} className="mt-4 space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="block text-sm font-medium">
              {t('cars.brandLabel')}
            </label>
            <input
              type="text"
              {...form.register('make')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {form.formState.errors.make ? (
              <Text className="text-xs text-destructive">
                {t('cars.validation.brandRequired')}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">
              {t('cars.modelLabel')}
            </label>
            <input
              type="text"
              {...form.register('model')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {form.formState.errors.model ? (
              <Text className="text-xs text-destructive">
                {t('cars.validation.modelRequired')}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">
              {t('cars.yearLabelOptional')}
            </label>
            <input
              type="number"
              {...form.register('year')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {form.formState.errors.year ? (
              <Text className="text-xs text-destructive">
                {t('cars.validation.yearMustBeNumber')}
              </Text>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">
              {t('cars.vinLabelOptional')}
            </label>
            <input
              type="text"
              {...form.register('vin')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <Button type="submit" disabled={createCar.isPending}>
            {createCar.isPending ? t('cars.saving') : t('cars.addCarButton')}
          </Button>
        </form>
      </section>
    </main>
  );
}
