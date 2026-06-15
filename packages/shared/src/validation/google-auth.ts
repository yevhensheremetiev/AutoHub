import { z } from 'zod';

import {
  defaultGoogleAuthValidationMessages,
  type GoogleAuthValidationMessages,
} from './defaults.js';

export function createGoogleAuthSchema(messages: GoogleAuthValidationMessages) {
  return z.object({
    idToken: z.string().min(1, { message: messages.idTokenRequired }),
  });
}

export const googleAuthSchema = createGoogleAuthSchema(
  defaultGoogleAuthValidationMessages,
);

export type GoogleAuthBody = z.infer<typeof googleAuthSchema>;
