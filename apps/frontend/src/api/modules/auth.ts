import type {
  ChangePasswordRequestBody,
  ForgotPasswordRequestBody,
  LoginRequestBody,
  ResetPasswordRequestBody,
  SignUpRequestBody,
  UpdateProfileRequestBody,
  UserDto,
} from '@autohub/shared';

import { api } from '@/api/client';

export type SignUpInput = SignUpRequestBody;

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

export async function updateProfile(
  payload: UpdateProfileRequestBody,
): Promise<UserDto> {
  const res = await api.patch<UserDto>('/auth/me', payload);
  return res.data;
}

export async function changePassword(
  payload: ChangePasswordRequestBody,
): Promise<void> {
  await api.post('/auth/change-password', payload);
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
