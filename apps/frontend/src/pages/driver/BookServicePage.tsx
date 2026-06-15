import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';

import {
  useBookingTimeSlots,
  useCars,
  useCreateBooking,
  useService,
} from '@/api';
import { Button } from '@/components/ui/button';
import { DatePicker, toIsoDate } from '@/components/ui/date-picker';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

function createBookSchema(t: (k: string) => string) {
  return z.object({
    offeringId: z.string().min(1, t('driver.book.validation.offering')),
    carId: z.string().min(1, t('driver.book.validation.car')),
    date: z.string().min(1, t('driver.book.validation.date')),
    time: z.string().min(1, t('driver.book.validation.time')),
    notes: z.string().optional(),
  });
}

type BookFormValues = z.infer<ReturnType<typeof createBookSchema>>;

export function BookServicePage() {
  const { stationId } = useParams<{ stationId: string }>();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const { data: cars = [] } = useCars();
  const { data: station, isLoading, isError } = useService(stationId);
  const createBookingMutation = useCreateBooking();

  const offerFromQuery = searchParams.get('offer') ?? '';

  const bookSchema = useMemo(() => createBookSchema(t), [t]);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      offeringId: '',
      carId: '',
      date: '',
      time: '',
      notes: '',
    },
  });

  const watchedDate = useWatch({ control: form.control, name: 'date' });
  const { data: timeSlotsData } = useBookingTimeSlots(watchedDate ?? '');

  useEffect(() => {
    if (cars.length === 0) return;
    const current = form.getValues('carId');
    if (!current || !cars.some((c) => c.id === current)) {
      form.setValue('carId', cars[0]!.id);
    }
  }, [cars, form]);

  useEffect(() => {
    if (!station) return;
    const oid =
      offerFromQuery &&
      station.offerings.some((o) => o.id === offerFromQuery)
        ? offerFromQuery
        : (station.offerings[0]?.id ?? '');
    form.reset({
      offeringId: oid,
      carId: cars[0]?.id ?? '',
      date: '',
      time: '',
      notes: '',
    });
  }, [station, offerFromQuery, form, cars]);

  const offeringId = useWatch({
    control: form.control,
    name: 'offeringId',
    defaultValue: '',
  });

  const selectedOffering = station?.offerings.find((o) => o.id === offeringId);

  if (isLoading) {
    return null;
  }

  if (isError || !station) {
    return (
      <div className="space-y-4">
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('driver.serviceNotFound')}
        </Text>
        <Link
          to="/dashboard/map"
          className="inline-flex h-9 items-center justify-center rounded-md border border-slate-600 bg-slate-900 px-4 text-sm text-slate-100 hover:bg-slate-800"
        >
          {t('driver.backToMap')}
        </Link>
      </div>
    );
  }

  const todayIso = toIsoDate(new Date());
  const timeSlots = timeSlotsData?.slots ?? [];

  const inputClass =
    'flex h-11 w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 text-sm text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70';

  const onSubmit = form.handleSubmit((values) => {
    createBookingMutation.mutate(
      {
        serviceId: station.id,
        offeringId: values.offeringId,
        carId: values.carId,
        date: values.date,
        time: values.time,
        notes: values.notes,
      },
      { onSuccess: () => setSubmitted(true) },
    );
  });

  const linkBtnSecondary =
    'inline-flex h-10 items-center justify-center rounded-md border border-slate-600 bg-slate-900 px-4 text-sm font-medium text-slate-100 shadow-sm hover:bg-slate-800';

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <Text as="h1" className="text-lg font-semibold text-emerald-100">
          {t('driver.book.successTitle')}
        </Text>
        <Text className="text-sm text-emerald-200/90">
          {t('driver.book.successBody')}
        </Text>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            {t('driver.navHome')}
          </Link>
          <Link
            to={`/dashboard/services/${station.id}`}
            className={linkBtnSecondary}
          >
            {t('driver.backToStation')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <Link
          to={`/dashboard/services/${station.id}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('driver.backToStation')}
        </Link>
        <Text as="h1" variant="h3" className="text-slate-50">
          {t('driver.book.title')}
        </Text>
        <Text className="mt-1 text-slate-400" variant="muted">
          {station.name}
        </Text>
      </div>

      <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="book-offering" className="text-sm text-slate-200">
            {t('driver.book.fieldService')}
          </label>
          <select
            id="book-offering"
            className={cn(
              inputClass,
              form.formState.errors.offeringId ? 'border-destructive' : '',
            )}
            {...form.register('offeringId')}
          >
            {station.offerings.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} — {t('driver.priceUah', { price: o.priceUah })}
              </option>
            ))}
          </select>
          {form.formState.errors.offeringId ? (
            <Text className="text-xs text-destructive">
              {form.formState.errors.offeringId.message}
            </Text>
          ) : null}
        </div>

        {selectedOffering ? (
          <Text className="text-xs text-slate-500" variant="muted">
            {t('driver.durationMinutes', {
              count: selectedOffering.durationMinutes,
            })}
          </Text>
        ) : null}

        <div className="space-y-2">
          <label htmlFor="book-car" className="text-sm text-slate-200">
            {t('driver.book.fieldCar')}
          </label>
          {cars.length === 0 ? (
            <Text className="text-sm text-amber-200/90">
              {t('driver.book.noCarsHint')}{' '}
              <Link
                to="/dashboard/cars/new"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/90"
              >
                {t('driver.addCarCta')}
              </Link>
            </Text>
          ) : (
            <>
              <select
                id="book-car"
                className={cn(
                  inputClass,
                  form.formState.errors.carId ? 'border-destructive' : '',
                )}
                {...form.register('carId')}
              >
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model}
                    {car.year != null ? ` (${car.year})` : ''} ·{' '}
                    {car.licensePlate ?? '—'}
                  </option>
                ))}
              </select>
              {form.formState.errors.carId ? (
                <Text className="text-xs text-destructive">
                  {form.formState.errors.carId.message}
                </Text>
              ) : null}
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="book-date" className="text-sm text-slate-200">
              {t('driver.book.fieldDate')}
            </label>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id="book-date"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    form.setValue('time', '');
                  }}
                  placeholder={t('driver.book.selectDate')}
                  minDate={todayIso}
                  hasError={!!form.formState.errors.date}
                />
              )}
            />
            {form.formState.errors.date ? (
              <Text className="text-xs text-destructive">
                {form.formState.errors.date.message}
              </Text>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="book-time" className="text-sm text-slate-200">
              {t('driver.book.fieldTime')}
            </label>
            <select
              id="book-time"
              className={cn(
                inputClass,
                form.formState.errors.time ? 'border-destructive' : '',
              )}
              disabled={!watchedDate}
              {...form.register('time')}
            >
              <option value="">{t('driver.book.selectTime')}</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            {form.formState.errors.time ? (
              <Text className="text-xs text-destructive">
                {form.formState.errors.time.message}
              </Text>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="book-notes" className="text-sm text-slate-200">
            {t('driver.book.fieldNotes')}
          </label>
          <textarea
            id="book-notes"
            rows={3}
            className={cn(inputClass, 'min-h-[88px] resize-y py-2')}
            placeholder={t('driver.book.notesPlaceholder')}
            {...form.register('notes')}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={cars.length === 0 || createBookingMutation.isPending}
          className="h-11 w-full rounded-xl shadow-lg shadow-primary/20"
        >
          {t('driver.book.submit')}
        </Button>
      </form>
    </div>
  );
}
