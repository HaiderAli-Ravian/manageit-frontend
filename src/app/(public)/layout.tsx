'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import LoadingScreen from '@/components/common/loading-screen'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  const isHydrated = useAuthStore(s => s.isHydrated)
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && user) {
      router.replace('/dashboard')
    }
  }, [isHydrated, user, router])

  if (!isHydrated) return <LoadingScreen />
  if (user) return null

  return <>{children}</>
}
