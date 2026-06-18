import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional().nullable(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  dueDate: z.string().datetime({ offset: true }).optional().nullable(),
})

export type TaskFormInput = z.infer<typeof taskFormSchema>
