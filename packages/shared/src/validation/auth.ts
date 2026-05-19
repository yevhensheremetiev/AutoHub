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

export const forgotPasswordRequestSchema = createForgotPasswordSchema(
  defaultAuthValidationMessages,
);

export type ForgotPasswordRequestBody = z.infer<typeof forgotPasswordRequestSchema>;

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
    | 'serviceNameRequired'
    | 'serviceAddressRequired'
  >,
) {
  const base = z.object({
    accountType: z.enum(['DRIVER', 'SERVICE']),
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
    confirmPassword: z
      .string()
      .min(1, { message: messages.confirmPasswordRequired }),
    serviceName: z.string().trim().optional(),
    serviceAddress: z.string().trim().optional(),
  });

  return base
    .superRefine((data, ctx) => {
      if (data.accountType === 'SERVICE') {
        if (!data.serviceName?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.serviceNameRequired,
            path: ['serviceName'],
          });
        }
        if (!data.serviceAddress?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: messages.serviceAddressRequired,
            path: ['serviceAddress'],
          });
        }
      }
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
    | 'serviceNameRequired'
    | 'serviceAddressRequired'
  >,
) {
  const base = z.object({
    accountType: z.enum(['DRIVER', 'SERVICE']),
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
    serviceName: z.string().trim().optional(),
    serviceAddress: z.string().trim().optional(),
  });

  return base.superRefine((data, ctx) => {
    if (data.accountType === 'SERVICE') {
      if (!data.serviceName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.serviceNameRequired,
          path: ['serviceName'],
        });
      }
      if (!data.serviceAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: messages.serviceAddressRequired,
          path: ['serviceAddress'],
        });
      }
    }
  });
}

export const signUpRequestSchema = createSignUpRequestSchema(
  defaultAuthValidationMessages,
);

export type SignUpRequestBody = z.infer<typeof signUpRequestSchema>;

export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1, { message: 'Reset token is required' }),
  password: z
    .string()
    .min(1, { message: defaultAuthValidationMessages.passwordRequired })
    .pipe(createStrongPasswordSchema(defaultAuthValidationMessages)),
});

export type ResetPasswordRequestBody = z.infer<typeof resetPasswordRequestSchema>;

export const updateProfileRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: defaultAuthValidationMessages.displayNameRequired })
    .max(120, { message: defaultAuthValidationMessages.displayNameTooLong }),
});

export type UpdateProfileRequestBody = z.infer<typeof updateProfileRequestSchema>;

export function createUpdateProfileSchema(
  messages: Pick<
    AuthValidationMessages,
    'displayNameRequired' | 'displayNameTooLong'
  >,
) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: messages.displayNameRequired })
      .max(120, { message: messages.displayNameTooLong }),
  });
}

export type UpdateProfileFormValues = z.infer<
  ReturnType<typeof createUpdateProfileSchema>
>;

export const changePasswordRequestSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: defaultAuthValidationMessages.currentPasswordRequired }),
  newPassword: z
    .string()
    .min(1, { message: defaultAuthValidationMessages.passwordRequired })
    .pipe(createStrongPasswordSchema(defaultAuthValidationMessages)),
});

export type ChangePasswordRequestBody = z.infer<typeof changePasswordRequestSchema>;

export function createChangePasswordFormSchema(
  messages: Pick<
    AuthValidationMessages,
    | 'currentPasswordRequired'
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
      currentPassword: z
        .string()
        .min(1, { message: messages.currentPasswordRequired }),
      newPassword: z
        .string()
        .min(1, { message: messages.passwordRequired })
        .pipe(createStrongPasswordSchema(messages)),
      confirmNewPassword: z
        .string()
        .min(1, { message: messages.confirmPasswordRequired }),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: messages.passwordsMustMatch,
      path: ['confirmNewPassword'],
    });
}

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof createChangePasswordFormSchema>
>;
