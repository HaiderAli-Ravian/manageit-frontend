'use client'

import { motion } from 'motion/react'
import { format, formatDistanceToNowStrict, differenceInDays } from 'date-fns'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskStatusBadge } from './task-status-badge'
import { TaskPriorityBadge } from './task-priority-badge'
import { useToggleTaskStatusMutation } from '@/hooks/use-tasks'
import type { Task } from '@/services/task.service'

interface TaskRowProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  showOwner?: boolean
}

function formatDueDate(dueDate: string): string {
  const date = new Date(dueDate)
  const diff = Math.abs(differenceInDays(date, new Date()))
  if (diff <= 7) {
    return formatDistanceToNowStrict(date, { addSuffix: true })
  }
  return format(date, 'MMM d, yyyy')
}

export function TaskRow({ task, onEdit, onDelete, showOwner }: TaskRowProps) {
  const toggle = useToggleTaskStatusMutation()
  const isCompleted = task.status === 'COMPLETED'

  function handleCheck(checked: boolean) {
    toggle.mutate({ id: task.id, status: checked ? 'COMPLETED' : 'PENDING' })
  }

  const showActions = onEdit !== undefined || onDelete !== undefined

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.18 }}
      className="flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/30"
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleCheck}
        disabled={toggle.isPending}
        aria-label={`Mark "${task.title}" as ${isCompleted ? 'pending' : 'completed'}`}
      />

      <div
        className="flex min-w-0 flex-1 cursor-pointer flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
        onClick={() => onEdit?.(task)}
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onKeyDown={(e) => e.key === 'Enter' && onEdit?.(task)}
      >
        <div className="min-w-0 flex-1">
          <span
            className={`block truncate text-sm font-medium ${isCompleted ? 'text-muted-foreground line-through' : ''}`}
          >
            {task.title}
          </span>
          {task.description && (
            <span className="hidden truncate text-xs text-muted-foreground sm:block">
              {task.description}
            </span>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />

          {task.dueDate && (
            <span className="hidden text-xs text-muted-foreground sm:block">
              {formatDueDate(task.dueDate)}
            </span>
          )}

          {showOwner && (
            <span className="hidden font-mono text-xs text-muted-foreground sm:block">
              {task.userId.slice(0, 8)}
            </span>
          )}
        </div>
      </div>

      {showActions && (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" />}>
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Task actions</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </motion.div>
  )
}
