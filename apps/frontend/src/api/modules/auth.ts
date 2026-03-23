import type { LoginRequestBody, UserDto } from '@autohub/shared';

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
