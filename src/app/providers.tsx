'use client'

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { useMe } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth.store'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
    mutations: { retry: 0 },
  },
})

function AuthHydrator() {
  const { data, isSuccess, isError } = useMe()
  const setUser = useAuthStore(s => s.setUser)
  const setHydrated = useAuthStore(s => s.setHydrated)
  const reset = useAuthStore(s => s.reset)

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data)
      setHydrated(true)
    }
  }, [isSuccess, data, setUser, setHydrated])

  useEffect(() => {
    if (isError) reset()
  }, [isError, reset])

  return null
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Toaster />
        <AuthHydrator />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
