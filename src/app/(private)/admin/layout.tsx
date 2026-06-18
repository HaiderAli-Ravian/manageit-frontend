'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.replace('/tasks')
    }
  }, [user, router])

  if (!user || user.role !== 'ADMIN') return null

  return <>{children}</>
}
