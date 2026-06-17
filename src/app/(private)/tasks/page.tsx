import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { TasksPageClient } from './tasks-page-client'

function TasksPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div className="rounded-lg border border-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
            <Skeleton className="h-4 w-4 rounded" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-48" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TasksPage() {
  return (
    <Suspense fallback={<TasksPageSkeleton />}>
      <TasksPageClient />
    </Suspense>
  )
}
