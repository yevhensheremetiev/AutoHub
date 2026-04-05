export type Brand<K, T> = K & { __brand: T };

export type UserDto = {
  id: string;
  email: string | null;
  name: string | null;
  /** True when the account has an email/password hash (not Google-only). */
  passwordSignInEnabled: boolean;
};

export type CarDto = {
  id: string;
  userId: string;
  make: string;
  model: string;
  year?: number | null;
  vin?: string | null;
};

export * from './validation/index.js';
