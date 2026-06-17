'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { ListTasksQuery, TaskStatus } from '@/services/task.service'

export function useTaskFilters() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const filters: ListTasksQuery = {
    status: (params.get('status') as TaskStatus) || undefined,
    search: params.get('search') || undefined,
    sortBy: (params.get('sortBy') as ListTasksQuery['sortBy']) || 'createdAt',
    sortOrder: (params.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: parseInt(params.get('page') || '1', 10),
    limit: parseInt(params.get('limit') || '10', 10),
  }

  function updateFilters(patch: Partial<ListTasksQuery>) {
    const next = new URLSearchParams(params.toString())
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === '' || v === null) {
        next.delete(k)
      } else {
        next.set(k, String(v))
      }
    })
    const nonPageKeys = Object.keys(patch).filter((k) => k !== 'page')
    if (nonPageKeys.length > 0) next.set('page', '1')
    router.replace(`${pathname}?${next.toString()}`, { scroll: false })
  }

  return { filters, updateFilters }
}
