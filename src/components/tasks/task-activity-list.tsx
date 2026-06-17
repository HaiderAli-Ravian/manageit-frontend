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

interface TaskActivityListProps {
  taskId: string
}

export function TaskActivityList({ taskId }: TaskActivityListProps) {
  const { data: activities, isLoading } = useTaskActivities(taskId)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="mt-0.5 h-5 w-5 rounded-full" />
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
      <p className="py-6 text-center text-sm text-muted-foreground">No activity yet.</p>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {activities.map((activity) => {
        const Icon = ActionIcon[activity.action] ?? Pencil
        const label = actionLabels[activity.action] ?? activity.action

        return (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Icon className="h-3 w-3" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-1.5 text-sm">
                <span className="font-medium">{label}</span>
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
                    — {Object.keys(activity.changes).join(', ')}
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNowStrict(new Date(activity.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
