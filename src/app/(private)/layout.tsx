'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useLogoutMutation } from '@/hooks/use-auth'
import LoadingScreen from '@/components/common/loading-screen'
import ThemeToggle from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'

function PrivateNav() {
  const logout = useLogoutMutation()
  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <span className="font-semibold">ManageIt</span>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>
    </header>
  )
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore(s => s.user)
  const isHydrated = useAuthStore(s => s.isHydrated)
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/login')
    }
  }, [isHydrated, user, router])

  if (!isHydrated) return <LoadingScreen />
  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <PrivateNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
