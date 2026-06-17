'use client'

import { AnimatePresence } from 'motion/react'
import { ClipboardList } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskRow } from './task-row'
import type { Task } from '@/services/task.service'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  showOwner?: boolean
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}

function TaskRowSkeleton() {
  return (
    <div className="grid gap-3 border-b px-4 py-4 last:border-b-0 md:grid-cols-[2rem_minmax(14rem,1fr)_8.5rem_8rem_8rem_5rem_2.5rem] md:items-center md:gap-0">
      <Skeleton className="size-4 rounded-lg" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="hidden h-3 w-64 sm:block" />
      </div>
      <Skeleton className="mx-auto h-6 w-24 rounded-lg" />
      <Skeleton className="mx-auto h-6 w-24 rounded-lg" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-14" />
      <Skeleton className="ml-auto size-8 rounded-lg" />
    </div>
  )
}

export function TaskList({ tasks, isLoading, showOwner, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="premium-surface overflow-hidden rounded-lg border bg-card/82 backdrop-blur-xl">
        {[1, 2, 3, 4, 5].map((i) => (
          <TaskRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="premium-surface flex flex-col items-center gap-3 rounded-lg border bg-card/82 px-6 py-16 text-center backdrop-blur-xl">
        <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <ClipboardList className="size-6" />
        </div>
        <h3 className="text-base font-semibold">No tasks found</h3>
        <p className="text-sm text-muted-foreground">
          Tasks you create will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="premium-surface overflow-hidden rounded-lg border bg-card/82 backdrop-blur-xl">
      <div className="hidden border-b bg-muted/35 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid md:grid-cols-[2rem_minmax(14rem,1fr)_8.5rem_8rem_8rem_5rem_2.5rem] md:items-center md:gap-0">
        <span />
        <span>Task</span>
        <span className="text-center">Status</span>
        <span className="text-center">Priority</span>
        <span>Due Date</span>
        <span>{showOwner ? 'Owner' : ''}</span>
        <span />
      </div>
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            showOwner={showOwner}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
