import { Badge } from '@/components/ui/badge'
import type { TaskStatus } from '@/services/task.service'

const labelMap: Record<TaskStatus, string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

const variantMap: Record<TaskStatus, 'secondary' | 'default' | 'outline'> = {
  PENDING: 'secondary',
  IN_PROGRESS: 'default',
  COMPLETED: 'outline',
}

interface TaskStatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function TaskStatusBadge({ status, className }: TaskStatusBadgeProps) {
  return (
    <Badge
      variant={variantMap[status]}
      className={`transition-colors duration-200 ${className ?? ''}`}
    >
      {labelMap[status]}
    </Badge>
  )
}
