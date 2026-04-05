/** Default English messages for API / server-side validation. */
export const defaultAuthValidationMessages = {
  firstNameRequired: 'First name is required',
  lastNameRequired: 'Last name is required',
  emailRequired: 'Email is required',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordMinLength: 'At least 8 characters',
  passwordLowercase: 'Add at least one lowercase letter',
  passwordUppercase: 'Add at least one uppercase letter',
  passwordDigit: 'Add at least one digit',
  passwordSpecial: 'Add at least one special character (!@#$…)',
  confirmPasswordRequired: 'Confirm your password',
  passwordsMustMatch: 'Passwords do not match',
  currentPasswordRequired: 'Current password is required',
  displayNameRequired: 'Name is required',
  displayNameTooLong: 'Name is too long (max 120 characters)',
} as const;

export type AuthValidationMessages = {
  [K in keyof typeof defaultAuthValidationMessages]: string;
};

export const defaultCarValidationMessages = {
  makeRequired: 'Make is required',
  modelRequired: 'Model is required',
  yearInvalid: 'Year must be a whole number',
} as const;

export type CarValidationMessages = {
  [K in keyof typeof defaultCarValidationMessages]: string;
};

export const defaultGoogleAuthValidationMessages = {
  idTokenRequired: 'Google ID token is required',
} as const;

export type GoogleAuthValidationMessages = {
  [K in keyof typeof defaultGoogleAuthValidationMessages]: string;
};
