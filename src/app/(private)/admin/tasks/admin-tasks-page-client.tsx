'use client'

import { TaskFilters } from '@/components/tasks/task-filters'
import { TaskList } from '@/components/tasks/task-list'
import { TaskPagination } from '@/components/tasks/task-pagination'
import { useAdminTasks } from '@/hooks/use-tasks'
import { useTaskFilters } from '@/hooks/use-task-filters'

export function AdminTasksPageClient() {
  const { filters, updateFilters } = useTaskFilters()
  const { data, isLoading } = useAdminTasks(filters)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">All Tasks</h1>
          <p className="text-sm text-muted-foreground">Admin view — all users&apos; tasks</p>
        </div>
      </div>

      <TaskFilters />

      <TaskList
        tasks={data?.data ?? []}
        isLoading={isLoading}
        showOwner={true}
      />

      {data && data.meta.totalPages > 1 && (
        <TaskPagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          limit={filters.limit}
          onPageChange={(p) => updateFilters({ page: p })}
          onLimitChange={(l) => updateFilters({ limit: l })}
        />
      )}
    </div>
  )
}
