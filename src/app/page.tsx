'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import LoadingScreen from '@/components/common/loading-screen'

export default function RootPage() {
  const user = useAuthStore(s => s.user)
  const isHydrated = useAuthStore(s => s.isHydrated)
  const router = useRouter()

  useEffect(() => {
    if (!isHydrated) return
    if (user) {
      router.replace('/tasks')
    } else {
      router.replace('/login')
    }
  }, [isHydrated, user, router])

  return <LoadingScreen />
}
