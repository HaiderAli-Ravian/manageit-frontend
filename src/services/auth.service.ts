import apiClient from '@/lib/api/client'
import type { ApiSuccessResponse } from '@/lib/api/types'

export interface User {
  id: string
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface SignupPayload {
  email: string
  password: string
  name: string
}

export interface LoginPayload {
  email: string
  password: string
}

export async function signup(payload: SignupPayload): Promise<User> {
  const res = await apiClient.post<ApiSuccessResponse<User>>('/auth/signup', payload)
  return res.data.data
}

export async function login(payload: LoginPayload): Promise<User> {
  const res = await apiClient.post<ApiSuccessResponse<User>>('/auth/login', payload)
  return res.data.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function getCurrentUser(): Promise<User> {
  const res = await apiClient.get<ApiSuccessResponse<User>>('/auth/me')
  return res.data.data
}
