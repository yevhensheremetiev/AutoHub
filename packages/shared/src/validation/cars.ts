import { z } from 'zod';

import {
  defaultCarValidationMessages,
  type CarValidationMessages,
} from './defaults.js';

const optionalVinSchema = (messages: CarValidationMessages) =>
  z.preprocess(
    (value) => {
      if (value === null || value === undefined) return undefined;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed === '' ? undefined : trimmed;
      }
      return value;
    },
    z
      .string()
      .length(17, { message: messages.vinInvalid })
      .optional(),
  );

const optionalYearSchema = (messages: CarValidationMessages) =>
  z.preprocess(
    (value) => {
      if (value === '' || value === null || value === undefined) return undefined;
      const num = typeof value === 'number' ? value : Number(value);
      return Number.isFinite(num) ? num : value;
    },
    z
      .number()
      .int({ message: messages.yearInvalid })
      .min(1900)
      .max(2100)
      .optional(),
  );

/** POST /cars JSON body (API). */
export function createCreateCarBodySchema(messages: CarValidationMessages) {
  return z.object({
    make: z.string().min(1, { message: messages.makeRequired }),
    model: z.string().min(1, { message: messages.modelRequired }),
    year: optionalYearSchema(messages),
    licensePlate: z
      .string()
      .trim()
      .min(1, { message: messages.licensePlateRequired })
      .max(20, { message: messages.licensePlateTooLong }),
    vin: optionalVinSchema(messages),
  });
}

/**
 * Add-car form: `year` is an optional string field (empty = omitted).
 * Same rules as the API after coercion.
 */
export function createCreateCarFormSchema(messages: CarValidationMessages) {
  return z.object({
    make: z.string().min(1, { message: messages.makeRequired }),
    model: z.string().min(1, { message: messages.modelRequired }),
    year: z
      .string()
      .optional()
      .refine(
        (value) =>
          value === undefined ||
          value === '' ||
          Number.isInteger(Number(value)),
        { message: messages.yearInvalid },
      ),
    licensePlate: z
      .string()
      .trim()
      .min(1, { message: messages.licensePlateRequired })
      .max(20, { message: messages.licensePlateTooLong }),
    vin: optionalVinSchema(messages),
  });
}

export type CreateCarFormValues = z.infer<
  ReturnType<typeof createCreateCarFormSchema>
>;

export const createCarBodySchema = createCreateCarBodySchema(
  defaultCarValidationMessages,
);

export type CreateCarBody = z.infer<typeof createCarBodySchema>;

export const updateCarBodySchema = createCarBodySchema;

export type UpdateCarBody = z.infer<typeof updateCarBodySchema>;
