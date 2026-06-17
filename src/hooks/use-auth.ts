'use client'

import type { AxiosError } from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { getCurrentUser, login, signup, logout } from '@/services/auth.service'
import type { ApiErrorResponse } from '@/lib/api/types'
import { useAuthStore } from '@/store/auth.store'

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getCurrentUser,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useLoginMutation() {
  const setUser = useAuthStore(s => s.setUser)
  const router = useRouter()
  return useMutation({
    mutationFn: login,
    onSuccess: user => {
      setUser(user)
      toast.success('Welcome back!')
      router.replace('/dashboard')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Login failed')
    },
  })
}

export function useSignupMutation() {
  const setUser = useAuthStore(s => s.setUser)
  const router = useRouter()
  return useMutation({
    mutationFn: signup,
    onSuccess: user => {
      setUser(user)
      toast.success('Account created!')
      router.replace('/dashboard')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Signup failed')
    },
  })
}

export function useLogoutMutation() {
  const reset = useAuthStore(s => s.reset)
  const router = useRouter()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      reset()
      toast.success('Signed out')
      router.replace('/login')
    },
  })
}
