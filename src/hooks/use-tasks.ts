'use client'

import type { AxiosError } from 'axios'
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createTask,
  listTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskActivities,
  listAllTasksAdmin,
} from '@/services/task.service'
import type { ListTasksQuery, PaginatedTasksResponse, TaskStatus } from '@/services/task.service'
import type { ApiErrorResponse } from '@/lib/api/types'

const TASKS_KEY = ['tasks'] as const
const TASK_KEY = (id: string) => ['tasks', id] as const
const ACTIVITIES_KEY = (id: string) => ['tasks', id, 'activities'] as const
const ADMIN_TASKS_KEY = ['admin', 'tasks'] as const

export function useTasks(query: ListTasksQuery) {
  return useQuery({
    queryKey: [...TASKS_KEY, query],
    queryFn: () => listTasks(query),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  })
}

export function useTask(id: string) {
  return useQuery({
    queryKey: TASK_KEY(id),
    queryFn: () => getTask(id),
    enabled: !!id,
  })
}

export function useTaskActivities(id: string) {
  return useQuery({
    queryKey: ACTIVITIES_KEY(id),
    queryFn: () => getTaskActivities(id),
    enabled: !!id,
  })
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      toast.success('Task created')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to create task')
    },
  })
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Parameters<typeof updateTask>[1]) =>
      updateTask(id, payload),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      queryClient.invalidateQueries({ queryKey: TASK_KEY(id) })
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEY(id) })
      toast.success('Task updated')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to update task')
    },
  })
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
      toast.success('Task deleted')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to delete task')
    },
  })
}

export function useToggleTaskStatusMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTask(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY })
      const snapshots = queryClient.getQueriesData<PaginatedTasksResponse>({ queryKey: TASKS_KEY })
      queryClient.setQueriesData<PaginatedTasksResponse>(
        { queryKey: TASKS_KEY },
        (old) =>
          old
            ? { ...old, data: old.data.map((t) => (t.id === id ? { ...t, status } : t)) }
            : old,
      )
      return { snapshots }
    },
    onError: (_err, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => queryClient.setQueryData(key, data))
      toast.error('Failed to update task')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_KEY })
    },
  })
}

export function useAdminTasks(query: ListTasksQuery) {
  return useQuery({
    queryKey: [...ADMIN_TASKS_KEY, query],
    queryFn: () => listAllTasksAdmin(query),
    placeholderData: keepPreviousData,
    staleTime: 5_000,
  })
}
