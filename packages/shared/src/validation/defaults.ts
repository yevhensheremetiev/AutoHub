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
  serviceNameRequired: 'Service name is required',
  serviceAddressRequired: 'Service address is required',
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
  licensePlateRequired: 'License plate is required',
  licensePlateTooLong: 'License plate is too long',
  vinInvalid: 'VIN must be exactly 17 characters',
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

export const defaultReviewValidationMessages = {
  bookingIdRequired: 'Booking is required',
  ratingRequired: 'Rating is required',
  ratingMustBeInteger: 'Rating must be a whole number',
  ratingOutOfRange: 'Rating must be between 1 and 5',
  reviewCommentTooLong: 'Comment is too long',
} as const;

export type ReviewValidationMessages = {
  [K in keyof typeof defaultReviewValidationMessages]: string;
};
