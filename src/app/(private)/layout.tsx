'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useLogoutMutation } from '@/hooks/use-auth'
import LoadingScreen from '@/components/common/loading-screen'
import ThemeToggle from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'

function BrandMark() {
  return (
    <span className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
        <Check className="size-4 stroke-[3]" />
      </span>
      <span>ManageIt</span>
    </span>
  )
}

function PrivateNav() {
  const logout = useLogoutMutation()
  const user = useAuthStore((s) => s.user)

  return (
    <header className="sticky top-0 z-30 border-b bg-background/78 px-4 py-3 shadow-[0_1px_0_color-mix(in_oklch,var(--border),transparent_30%)] backdrop-blur-2xl supports-[backdrop-filter]:bg-background/68 sm:px-6">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        <Link href="/tasks" aria-label="ManageIt tasks">
          <BrandMark />
        </Link>

        <div className="flex items-center gap-2">
          {user?.role === 'ADMIN' && (
            <Button variant="ghost" size="sm" className="h-9 rounded-lg px-3" render={<Link href="/admin/tasks" />}>
              <Shield data-icon="inline-start" />
              Admin
            </Button>
          )}
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="h-9 rounded-lg bg-card/70 px-3 shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <LogOut data-icon="inline-start" />
            {logout.isPending ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </div>
    </header>
  )
}

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const router = useRouter()

  useEffect(() => {
    if (isHydrated && !user) {
      router.replace('/login')
    }
  }, [isHydrated, user, router])

  if (!isHydrated) return <LoadingScreen />
  if (!user) return null

  return (
    <div className="min-h-screen">
      <PrivateNav />
      <main className="min-w-0 px-4 py-7 sm:px-6 md:py-10">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
