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
    <div className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <Skeleton className="h-4 w-4 rounded" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="hidden h-3 w-64 sm:block" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  )
}

export function TaskList({ tasks, isLoading, showOwner, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border">
        {[1, 2, 3, 4, 5].map((i) => (
          <TaskRowSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-border py-16 text-center">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
        <h3 className="font-medium">No tasks found</h3>
        <p className="text-sm text-muted-foreground">
          Tasks you create will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border">
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
