import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { useCars, useCreateCar } from '@/api/hooks'

const carSchema = z.object({
  make: z.string().min(1, 'Марка обовʼязкова'),
  model: z.string().min(1, 'Модель обовʼязкова'),
  year: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isInteger(Number(value)),
      'Рік має бути числом',
    ),
  vin: z.string().optional(),
})

type CarFormValues = z.infer<typeof carSchema>

export function CarsPage() {
  const { data: cars, isLoading } = useCars()
  const createCar = useCreateCar()

  const form = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: '',
      model: '',
      year: undefined,
      vin: '',
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    void createCar.mutateAsync({
      make: values.make,
      model: values.model,
      year: values.year ? Number(values.year) : undefined,
      vin: values.vin || undefined,
    })
    form.reset()
  })

  return (
    <main className="container py-10 space-y-6">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">Мої авто</h1>
        {isLoading ? (
          <p className="mt-2 text-muted-foreground">Завантаження списку авто...</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {cars?.map((car) => (
              <li
                key={car.id}
                className="flex items-center justify-between rounded-md border border-border px-3 py-2"
              >
                <span>
                  {car.make} {car.model}{' '}
                  {car.year ? <span className="text-muted-foreground">({car.year})</span> : null}
                </span>
                {car.vin ? (
                  <span className="text-xs text-muted-foreground">VIN: {car.vin}</span>
                ) : null}
              </li>
            ))}
            {!cars?.length && (
              <li className="text-sm text-muted-foreground">Поки що немає жодного авто.</li>
            )}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold tracking-tight">Додати авто</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-4 max-w-md">
          <div className="space-y-1">
            <label className="block text-sm font-medium">Марка</label>
            <input
              type="text"
              {...form.register('make')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {form.formState.errors.make ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.make.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Модель</label>
            <input
              type="text"
              {...form.register('model')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {form.formState.errors.model ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.model.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">Рік (необовʼязково)</label>
            <input
              type="number"
              {...form.register('year')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            {form.formState.errors.year ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.year.message as string}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium">VIN (необовʼязково)</label>
            <input
              type="text"
              {...form.register('vin')}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={createCar.isPending}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {createCar.isPending ? 'Збереження...' : 'Додати авто'}
          </button>
        </form>
      </section>
    </main>
  )
}

