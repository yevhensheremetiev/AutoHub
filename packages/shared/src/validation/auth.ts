import { z } from 'zod';

import type { AuthValidationMessages } from './defaults.js';
import { defaultAuthValidationMessages } from './defaults.js';

export type StrongPasswordMessages = Pick<
  AuthValidationMessages,
  | 'passwordMinLength'
  | 'passwordLowercase'
  | 'passwordUppercase'
  | 'passwordDigit'
  | 'passwordSpecial'
>;

/** New passwords: length + mixed case + digit + symbol (non-alphanumeric). */
export function createStrongPasswordSchema(messages: StrongPasswordMessages) {
  return z
    .string()
    .min(8, { message: messages.passwordMinLength })
    .regex(/[a-z]/, { message: messages.passwordLowercase })
    .regex(/[A-Z]/, { message: messages.passwordUppercase })
    .regex(/\d/, { message: messages.passwordDigit })
    .regex(/[^A-Za-z0-9]/, { message: messages.passwordSpecial });
}

export function createLoginSchema(
  messages: Pick<
    AuthValidationMessages,
    'emailRequired' | 'emailInvalid' | 'passwordRequired' | 'passwordMinLength'
  >,
) {
  return z.object({
    email: z
      .string()
      .min(1, { message: messages.emailRequired })
      .email({ message: messages.emailInvalid }),
    password: z
      .string()
      .min(1, { message: messages.passwordRequired })
      .min(8, { message: messages.passwordMinLength }),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

export function createLoginRequestSchema(
  messages: Pick<
    AuthValidationMessages,
    'emailRequired' | 'emailInvalid' | 'passwordRequired' | 'passwordMinLength'
  >,
) {
  return createLoginSchema(messages);
}

export const loginRequestSchema = createLoginRequestSchema(
  defaultAuthValidationMessages,
);

export type LoginRequestBody = z.infer<typeof loginRequestSchema>;

export function createForgotPasswordSchema(
  messages: Pick<AuthValidationMessages, 'emailRequired' | 'emailInvalid'>,
) {
  return z.object({
    email: z
      .string()
      .min(1, { message: messages.emailRequired })
      .email({ message: messages.emailInvalid }),
  });
}

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;

export function createResetPasswordSchema(
  messages: Pick<
    AuthValidationMessages,
    | 'passwordRequired'
    | 'passwordMinLength'
    | 'passwordLowercase'
    | 'passwordUppercase'
    | 'passwordDigit'
    | 'passwordSpecial'
    | 'confirmPasswordRequired'
    | 'passwordsMustMatch'
  >,
) {
  return z
    .object({
      password: z
        .string()
        .min(1, { message: messages.passwordRequired })
        .pipe(createStrongPasswordSchema(messages)),
      confirmPassword: z
        .string()
        .min(1, { message: messages.confirmPasswordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMustMatch,
      path: ['confirmPassword'],
    });
}

export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;

export function createSignUpSchema(
  messages: Pick<
    AuthValidationMessages,
    | 'firstNameRequired'
    | 'lastNameRequired'
    | 'emailRequired'
    | 'emailInvalid'
    | 'passwordRequired'
    | 'passwordMinLength'
    | 'passwordLowercase'
    | 'passwordUppercase'
    | 'passwordDigit'
    | 'passwordSpecial'
    | 'confirmPasswordRequired'
    | 'passwordsMustMatch'
  >,
) {
  return z
    .object({
      firstName: z
        .string()
        .min(1, { message: messages.firstNameRequired }),
      lastName: z.string().min(1, { message: messages.lastNameRequired }),
      email: z
        .string()
        .min(1, { message: messages.emailRequired })
        .email({ message: messages.emailInvalid }),
      password: z
        .string()
        .min(1, { message: messages.passwordRequired })
        .pipe(createStrongPasswordSchema(messages)),
      confirmPassword: z
        .string()
        .min(1, { message: messages.confirmPasswordRequired }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.passwordsMustMatch,
      path: ['confirmPassword'],
    });
}

export type SignUpFormValues = z.infer<ReturnType<typeof createSignUpSchema>>;

export function createSignUpRequestSchema(
  messages: Pick<
    AuthValidationMessages,
    | 'firstNameRequired'
    | 'lastNameRequired'
    | 'emailRequired'
    | 'emailInvalid'
    | 'passwordRequired'
    | 'passwordMinLength'
    | 'passwordLowercase'
    | 'passwordUppercase'
    | 'passwordDigit'
    | 'passwordSpecial'
  >,
) {
  return z.object({
    firstName: z.string().min(1, { message: messages.firstNameRequired }),
    lastName: z.string().min(1, { message: messages.lastNameRequired }),
    email: z
      .string()
      .min(1, { message: messages.emailRequired })
      .email({ message: messages.emailInvalid }),
    password: z
      .string()
      .min(1, { message: messages.passwordRequired })
      .pipe(createStrongPasswordSchema(messages)),
  });
}

export const signUpRequestSchema = createSignUpRequestSchema(
  defaultAuthValidationMessages,
);

export type SignUpRequestBody = z.infer<typeof signUpRequestSchema>;
