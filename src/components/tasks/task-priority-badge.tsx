import { Badge } from '@/components/ui/badge'
import type { TaskPriority } from '@/services/task.service'

const labelMap: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

const variantMap: Record<TaskPriority, 'outline' | 'secondary' | 'destructive'> = {
  LOW: 'outline',
  MEDIUM: 'secondary',
  HIGH: 'destructive',
}

interface TaskPriorityBadgeProps {
  priority: TaskPriority
  className?: string
}

export function TaskPriorityBadge({ priority, className }: TaskPriorityBadgeProps) {
  return (
    <Badge variant={variantMap[priority]} className={className}>
      {labelMap[priority]}
    </Badge>
  )
}
