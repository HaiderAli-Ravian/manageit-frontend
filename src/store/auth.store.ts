import { create } from 'zustand'
import type { User } from '@/services/auth.service'

interface AuthState {
  user: User | null
  isHydrated: boolean
  setUser: (user: User | null) => void
  setHydrated: (value: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isHydrated: false,
  setUser: user => set({ user }),
  setHydrated: isHydrated => set({ isHydrated }),
  reset: () => set({ user: null, isHydrated: true }),
}))
