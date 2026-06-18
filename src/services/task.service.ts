import apiClient from '@/lib/api/client'
import type { ApiSuccessResponse } from '@/lib/api/types'

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TaskActivityAction =
  | 'CREATED'
  | 'UPDATED'
  | 'STATUS_CHANGED'
  | 'DELETED'
  | 'ATTACHMENT_ADDED'
  | 'ATTACHMENT_REMOVED'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface TaskActivity {
  id: string
  taskId: string
  userId: string
  action: TaskActivityAction
  changes: Record<string, { from: unknown; to: unknown }> | null
  createdAt: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: string
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>

export interface ListTasksQuery {
  status?: TaskStatus
  search?: string
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'status'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface PaginatedTasksResponse {
  data: Task[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

function buildParams(query: ListTasksQuery): Record<string, string | number> {
  const params: Record<string, string | number> = {}
  if (query.status) params.status = query.status
  if (query.search) params.search = query.search
  if (query.sortBy) params.sortBy = query.sortBy
  if (query.sortOrder) params.sortOrder = query.sortOrder
  if (query.page != null) params.page = query.page
  if (query.limit != null) params.limit = query.limit
  return params
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await apiClient.post<ApiSuccessResponse<Task>>('/tasks', payload)
  return res.data.data
}

export async function listTasks(query: ListTasksQuery): Promise<PaginatedTasksResponse> {
  const res = await apiClient.get<ApiSuccessResponse<Task[]>>('/tasks', {
    params: buildParams(query),
  })
  return { data: res.data.data, meta: res.data.meta! }
}

export async function getTask(id: string): Promise<Task> {
  const res = await apiClient.get<ApiSuccessResponse<Task>>(`/tasks/${id}`)
  return res.data.data
}

export async function updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
  const res = await apiClient.patch<ApiSuccessResponse<Task>>(`/tasks/${id}`, payload)
  return res.data.data
}

export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`)
}

export async function getTaskActivities(id: string): Promise<TaskActivity[]> {
  const res = await apiClient.get<ApiSuccessResponse<TaskActivity[]>>(`/tasks/${id}/activities`)
  return res.data.data
}

export async function listAllTasksAdmin(query: ListTasksQuery): Promise<PaginatedTasksResponse> {
  const res = await apiClient.get<ApiSuccessResponse<Task[]>>('/admin/tasks', {
    params: buildParams(query),
  })
  return { data: res.data.data, meta: res.data.meta! }
}
