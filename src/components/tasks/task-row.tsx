'use client'

import { motion } from 'motion/react'
import { format, formatDistanceToNowStrict, differenceInDays } from 'date-fns'
import { CalendarDays, MoreVertical, Pencil, Trash2, UserRound } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TaskStatusBadge } from './task-status-badge'
import { TaskPriorityBadge } from './task-priority-badge'
import { useToggleTaskStatusMutation } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'
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
      className="m-2 grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-3 gap-y-3 rounded-lg border bg-background/66 p-4 shadow-sm transition-colors duration-200 hover:bg-background/86 md:m-0 md:grid-cols-[2rem_minmax(14rem,1fr)_8.5rem_8rem_8rem_5rem_2.5rem] md:items-center md:gap-0 md:rounded-lg md:border-0 md:border-b md:bg-transparent md:px-4 md:py-3.5 md:shadow-none md:hover:bg-muted/30 md:last:border-b-0"
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={handleCheck}
        disabled={toggle.isPending}
        aria-label={`Mark "${task.title}" as ${isCompleted ? 'pending' : 'completed'}`}
        className="mt-1 md:mt-0"
      />

      <div
        className="col-start-2 row-start-1 flex min-w-0 cursor-pointer flex-col gap-1 pr-1 md:col-auto md:row-auto md:pr-0"
        onClick={() => onEdit?.(task)}
        role={onEdit ? 'button' : undefined}
        tabIndex={onEdit ? 0 : undefined}
        onKeyDown={(e) => e.key === 'Enter' && onEdit?.(task)}
      >
        <span
          className={cn(
            'block truncate text-sm font-semibold leading-5 transition-colors',
            isCompleted && 'text-muted-foreground line-through',
          )}
        >
          {task.title}
        </span>
        {task.description && (
          <span className="line-clamp-2 text-xs leading-5 text-muted-foreground md:truncate">
            {task.description}
          </span>
        )}
      </div>

      <div className="col-span-2 col-start-2 flex min-w-0 flex-col gap-3 pt-1 md:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <TaskStatusBadge status={task.status} />
          <TaskPriorityBadge priority={task.priority} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {task.dueDate ? (
            <span className="flex h-6 min-w-0 items-center gap-1.5 rounded-lg">
              <CalendarDays className="size-3.5 shrink-0" />
              <span className="truncate">{formatDueDate(task.dueDate)}</span>
            </span>
          ) : (
            <span className="flex h-6 items-center">No due date</span>
          )}

          {showOwner && (
            <span className="flex h-6 min-w-0 items-center gap-1.5">
              <UserRound className="size-3.5 shrink-0" />
              <span className="truncate">{task.user?.name ?? task.userId.slice(0, 8)}</span>
            </span>
          )}
        </div>
      </div>

      <div className="hidden flex-wrap items-center gap-2 md:col-auto md:flex md:justify-center">
        <TaskStatusBadge status={task.status} />
      </div>

      <div className="hidden flex-wrap items-center gap-2 md:col-auto md:flex md:justify-center">
        <TaskPriorityBadge priority={task.priority} />
      </div>

      <div className="hidden min-w-0 items-center gap-1.5 text-xs text-muted-foreground md:col-auto md:flex">
        {task.dueDate ? (
          <span className="flex h-6 min-w-24 items-center gap-1.5 rounded-lg px-2.5">
            <CalendarDays className="size-3.5 shrink-0" />
            <span className="truncate">{formatDueDate(task.dueDate)}</span>
          </span>
        ) : (
          <span className="hidden md:inline">-</span>
        )}
      </div>

      <div className="hidden min-w-0 items-center gap-1.5 text-xs text-muted-foreground md:col-auto md:flex">
        {showOwner && (
          <>
            <UserRound className="size-3.5 shrink-0" />
            <span className="truncate">{task.user?.name ?? task.userId.slice(0, 8)}</span>
          </>
        )}
      </div>

      {showActions && (
        <div className="col-start-3 row-start-1 flex justify-end self-start md:col-auto md:row-auto md:self-center">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="shrink-0 rounded-lg" />}>
              <MoreVertical />
              <span className="sr-only">Task actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={() => onDelete(task)} variant="destructive">
                    <Trash2 />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {!showActions && (
        <span className="hidden md:block" />
      )}
    </motion.div>
  )
}
