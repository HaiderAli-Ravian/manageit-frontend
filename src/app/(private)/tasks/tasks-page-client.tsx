'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TaskFilters } from '@/components/tasks/task-filters'
import { TaskList } from '@/components/tasks/task-list'
import { TaskPagination } from '@/components/tasks/task-pagination'
import { TaskFormDialog } from '@/components/tasks/task-form-dialog'
import { TaskDeleteDialog } from '@/components/tasks/task-delete-dialog'
import { useTasks } from '@/hooks/use-tasks'
import { useTaskFilters } from '@/hooks/use-task-filters'
import type { Task } from '@/services/task.service'

export function TasksPageClient() {
  const { filters, updateFilters } = useTaskFilters()
  const { data, isLoading } = useTasks(filters)

  const [createOpen, setCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  return (
    <div className="premium-enter flex flex-col gap-5 md:gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Tasks</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 rounded-lg px-3.5 shadow-md shadow-primary/20 transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          <Plus data-icon="inline-start" />
          New Task
        </Button>
      </div>

      <TaskFilters />

      <TaskList
        tasks={data?.data ?? []}
        isLoading={isLoading}
        onEdit={setEditingTask}
        onDelete={setDeletingTask}
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

      <TaskFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
      />

      <TaskFormDialog
        mode="edit"
        task={editingTask ?? undefined}
        open={!!editingTask}
        onOpenChange={(o) => { if (!o) setEditingTask(null) }}
      />

      <TaskDeleteDialog
        task={deletingTask}
        open={!!deletingTask}
        onOpenChange={(o) => { if (!o) setDeletingTask(null) }}
      />
    </div>
  )
}
