'use client'

import { useAuthStore } from '@/store/auth.store'
import { Badge } from '@/components/ui/badge'

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)

  if (!user) return null

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{user.email}</span>
        <Badge variant="secondary">{user.role}</Badge>
      </div>
    </div>
  )
}
