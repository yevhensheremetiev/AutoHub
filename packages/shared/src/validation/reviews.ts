import { z } from 'zod';

import {
  defaultReviewValidationMessages,
  type ReviewValidationMessages,
} from './defaults.js';

export function createCreateReviewBodySchema(messages: ReviewValidationMessages) {
  return z.object({
    bookingId: z.string().trim().min(1, { message: messages.bookingIdRequired }),
    rating: z
      .number({ message: messages.ratingRequired })
      .int({ message: messages.ratingMustBeInteger })
      .min(1, { message: messages.ratingOutOfRange })
      .max(5, { message: messages.ratingOutOfRange }),
    comment: z
      .string()
      .trim()
      .max(2000, { message: messages.reviewCommentTooLong })
      .optional(),
  });
}

export function createUpdateReviewBodySchema(messages: ReviewValidationMessages) {
  return z.object({
    rating: z
      .number({ message: messages.ratingRequired })
      .int({ message: messages.ratingMustBeInteger })
      .min(1, { message: messages.ratingOutOfRange })
      .max(5, { message: messages.ratingOutOfRange }),
    comment: z
      .string()
      .trim()
      .max(2000, { message: messages.reviewCommentTooLong })
      .optional()
      .nullable(),
  });
}

export const createReviewBodySchema = createCreateReviewBodySchema(
  defaultReviewValidationMessages,
);

export const updateReviewBodySchema = createUpdateReviewBodySchema(
  defaultReviewValidationMessages,
);

export type CreateReviewBody = z.infer<typeof createReviewBodySchema>;
export type UpdateReviewBody = z.infer<typeof updateReviewBodySchema>;
