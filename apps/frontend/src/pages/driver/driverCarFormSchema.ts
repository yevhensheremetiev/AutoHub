import { z } from 'zod';
import type { TFunction } from 'i18next';

export type DriverCarFormValues = {
  make: string;
  model: string;
  year?: number | undefined;
  plate: string;
  vin?: string | undefined;
};

export function createDriverCarFormSchema(t: TFunction) {
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
        .max(
          new Date().getFullYear() + 1,
          t('driver.addCar.validation.yearInvalid'),
        )
        .optional(),
    ),
    plate: z
      .string()
      .trim()
      .min(1, t('driver.addCar.validation.plateRequired'))
      .max(20, t('driver.addCar.validation.plateTooLong')),
    vin: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) => !value || value.length === 17,
        t('driver.addCar.validation.vinInvalid'),
      ),
  });
}

export function driverCarFormToApi(values: DriverCarFormValues) {
  const vin = values.vin?.trim();
  return {
    make: values.make.trim(),
    model: values.model.trim(),
    year: values.year,
    licensePlate: values.plate.trim(),
    vin: vin || undefined,
  };
}
