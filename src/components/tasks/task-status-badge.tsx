import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TaskStatus } from '@/services/task.service'

const labelMap: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

const toneMap: Record<TaskStatus, string> = {
  PENDING: 'border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200',
  IN_PROGRESS: 'border-blue-200 bg-blue-50/80 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-200',
  COMPLETED: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200',
}

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-6 min-w-20 justify-center rounded-lg px-2.5 text-xs font-medium shadow-none transition-colors duration-200',
        toneMap[status],
        className,
      )}
    >
      {labelMap[status]}
    </Badge>
  )
}
