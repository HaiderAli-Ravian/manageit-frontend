import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TaskPriority } from '@/services/task.service'

const labelMap: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const toneMap: Record<TaskPriority, string> = {
  LOW: 'border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-200',
  MEDIUM: 'border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200',
  HIGH: 'border-red-200 bg-red-50/80 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-200',
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'h-6 min-w-20 justify-center rounded-lg px-2.5 text-xs font-medium shadow-none',
        toneMap[priority],
        className,
      )}
    >
      {labelMap[priority]}
    </Badge>
  )
}
