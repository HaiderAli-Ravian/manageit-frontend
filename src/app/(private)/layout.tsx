'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { useLogoutMutation } from '@/hooks/use-auth'
import LoadingScreen from '@/components/common/loading-screen'
import ThemeToggle from '@/components/common/theme-toggle'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

function PrivateNav() {
  const logout = useLogoutMutation()
  const user = useAuthStore((s) => s.user)
  const pathname = usePathname()

  const navLinks = [
    { href: '/tasks', label: 'Tasks' },
    ...(user?.role === 'ADMIN' ? [{ href: '/admin/tasks', label: 'Admin' }] : []),
  ]

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-6">
        <Link href="/tasks" className="font-semibold">
          ManageIt
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
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
    <div className="flex min-h-screen flex-col">
      <PrivateNav />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
