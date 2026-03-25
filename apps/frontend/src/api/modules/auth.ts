import type {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  ResetPasswordRequestBody,
  UserDto,
} from '@autohub/shared';

import { api } from '@/api/client';

export type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type GoogleAuthInput = {
  idToken: string;
};

export type LoginInput = LoginRequestBody;

export type ForgotPasswordInput = ForgotPasswordRequestBody;

export type ResetPasswordInput = ResetPasswordRequestBody;

export async function signUp(payload: SignUpInput): Promise<UserDto> {
  const res = await api.post<UserDto>('/auth/signup', payload);
  return res.data;
}

export async function login(payload: LoginInput): Promise<UserDto> {
  const res = await api.post<UserDto>('/auth/login', payload);
  return res.data;
}

export async function authenticateWithGoogle(
  payload: GoogleAuthInput,
): Promise<UserDto> {
  const res = await api.post<UserDto>('/auth/google', payload);
  return res.data;
}

export async function getMe(): Promise<UserDto> {
  const res = await api.get<UserDto>('/auth/me');
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function requestPasswordReset(
  payload: ForgotPasswordInput,
): Promise<void> {
  await api.post('/auth/forgot-password', payload);
}

export async function completePasswordReset(
  payload: ResetPasswordInput,
): Promise<void> {
  await api.post('/auth/reset-password', payload);
}
