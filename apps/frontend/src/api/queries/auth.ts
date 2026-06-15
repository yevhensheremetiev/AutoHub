import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  authenticateWithGoogle,
  changePassword,
  completePasswordReset,
  getMe,
  login,
  logout,
  requestPasswordReset,
  signUp,
  updateProfile,
  type ForgotPasswordInput,
  type GoogleAuthInput,
  type LoginInput,
  type ResetPasswordInput,
  type SignUpInput,
} from '@/api/modules/auth';
import type {
  ChangePasswordRequestBody,
  UpdateProfileRequestBody,
} from '@autohub/shared';

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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SignUpInput) => signUp(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me, user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginInput) => login(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me, user);
    },
  });
}

export function useGoogleAuth() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: GoogleAuthInput) => authenticateWithGoogle(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: authQueryKeys.me });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfileRequestBody) => updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(authQueryKeys.me, user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequestBody) =>
      changePassword(payload),
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
