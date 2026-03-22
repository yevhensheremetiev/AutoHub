import { z } from 'zod';

import {
  defaultCarValidationMessages,
  type CarValidationMessages,
} from './defaults.js';

/** POST /cars JSON body (API). */
export function createCreateCarBodySchema(messages: CarValidationMessages) {
  return z.object({
    make: z.string().min(1, { message: messages.makeRequired }),
    model: z.string().min(1, { message: messages.modelRequired }),
    year: z
      .number()
      .int({ message: messages.yearInvalid })
      .min(1900)
      .max(2100)
      .optional(),
    vin: z.string().optional(),
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
    vin: z.string().optional(),
  });
}

export type CreateCarFormValues = z.infer<
  ReturnType<typeof createCreateCarFormSchema>
>;

export const createCarBodySchema = createCreateCarBodySchema(
  defaultCarValidationMessages,
);

export type CreateCarBody = z.infer<typeof createCarBodySchema>;
