'use client'

import { formatDistanceToNowStrict } from 'date-fns'
import {
  Plus,
  Pencil,
  CheckCircle2,
  Trash2,
  Paperclip,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TaskStatusBadge } from './task-status-badge'
import { useTaskActivities } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
import type { TaskActivityAction, TaskStatus } from '@/services/task.service'

const actionLabels: Record<TaskActivityAction, string> = {
  CREATED: 'Created',
  UPDATED: 'Updated',
  STATUS_CHANGED: 'Status changed',
  DELETED: 'Deleted',
  ATTACHMENT_ADDED: 'Attachment added',
  ATTACHMENT_REMOVED: 'Attachment removed',
}

const ActionIcon: Record<TaskActivityAction, React.ElementType> = {
  CREATED: Plus,
  UPDATED: Pencil,
  STATUS_CHANGED: CheckCircle2,
  DELETED: Trash2,
  ATTACHMENT_ADDED: Paperclip,
  ATTACHMENT_REMOVED: Paperclip,
}

const actionToneMap: Record<TaskActivityAction, string> = {
  CREATED: 'bg-[var(--status-complete-bg)] text-[var(--status-complete-text)] ring-[var(--status-complete-ring)]',
  UPDATED: 'bg-[var(--status-progress-bg)] text-[var(--status-progress-text)] ring-[var(--status-progress-ring)]',
  STATUS_CHANGED: 'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)] ring-[var(--status-pending-ring)]',
  DELETED: 'bg-[color-mix(in_oklch,var(--destructive)_14%,transparent)] text-destructive ring-destructive/25',
  ATTACHMENT_ADDED: 'bg-[var(--priority-low-bg)] text-[var(--priority-low-text)] ring-[var(--priority-low-ring)]',
  ATTACHMENT_REMOVED: 'bg-[var(--priority-medium-bg)] text-[var(--priority-medium-text)] ring-[var(--priority-medium-ring)]',
}

interface TaskActivityListProps {
  taskId: string
}

export function TaskActivityList({ taskId }: TaskActivityListProps) {
  const { data: activities, isLoading } = useTaskActivities(taskId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border bg-muted/20 p-3">
            <Skeleton className="mt-0.5 size-8 rounded-lg" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
        No activity yet.
      </div>
    )
  }

  return (
    <div className="relative flex flex-col gap-3 py-2">
      <span className="absolute bottom-4 left-4 top-4 w-px bg-border" aria-hidden="true" />
      {activities.map((activity, index) => {
        const Icon = ActionIcon[activity.action] ?? Pencil
        const label = actionLabels[activity.action] ?? activity.action

        return (
          <div key={activity.id} className="relative flex items-start gap-3">
            <div
              className={cn(
                'z-10 flex size-8 flex-shrink-0 items-center justify-center rounded-lg shadow-sm ring-1',
                actionToneMap[activity.action],
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1 rounded-lg border bg-background/68 px-3 py-2.5 shadow-sm transition-all duration-200 hover:bg-background/88 hover:shadow-md">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">{label}</span>
                {activity.action === 'STATUS_CHANGED' && activity.changes?.status && (
                  <>
                    <span className="text-muted-foreground">from</span>
                    <TaskStatusBadge status={activity.changes.status.from as TaskStatus} />
                    <span className="text-muted-foreground">to</span>
                    <TaskStatusBadge status={activity.changes.status.to as TaskStatus} />
                  </>
                )}
                {activity.action === 'UPDATED' && activity.changes && (
                  <span className="text-muted-foreground">
                    - {Object.keys(activity.changes).join(', ')}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                <span>
                  {formatDistanceToNowStrict(new Date(activity.createdAt), { addSuffix: true })}
                </span>
                <span className="font-mono">{activity.userId.slice(0, 8)}</span>
              </div>
            </div>
            {index === activities.length - 1 && (
              <span className="absolute bottom-0 left-4 top-8 w-px bg-background" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
