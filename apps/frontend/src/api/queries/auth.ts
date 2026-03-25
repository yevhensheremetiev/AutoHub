import { useMutation, useQuery } from '@tanstack/react-query';

import {
  authenticateWithGoogle,
  completePasswordReset,
  getMe,
  login,
  logout,
  requestPasswordReset,
  signUp,
  type ForgotPasswordInput,
  type GoogleAuthInput,
  type LoginInput,
  type ResetPasswordInput,
  type SignUpInput,
} from '@/api/modules/auth';

export const authQueryKeys = {
  me: ['me'] as const,
};

export function useMe() {
  return useQuery({
    queryKey: authQueryKeys.me,
    queryFn: getMe,
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: (payload: SignUpInput) => signUp(payload),
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
  });
}

export function useGoogleAuth() {
  return useMutation({
    mutationFn: (payload: GoogleAuthInput) => authenticateWithGoogle(payload),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordInput) =>
      requestPasswordReset(payload),
  });
}

export function useCompletePasswordReset() {
  return useMutation({
    mutationFn: (payload: ResetPasswordInput) => completePasswordReset(payload),
  });
}
