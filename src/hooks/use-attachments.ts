'use client'

import type { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  addAttachment,
  listAttachments,
  removeAttachment,
} from '@/services/attachment.service'
import type { AddAttachmentPayload } from '@/services/attachment.service'
import type { ApiErrorResponse } from '@/lib/api/types'

const ATTACHMENTS_KEY = (taskId: string) => ['tasks', taskId, 'attachments'] as const
const ACTIVITIES_KEY = (taskId: string) => ['tasks', taskId, 'activities'] as const

export function useAttachments(taskId: string) {
  return useQuery({
    queryKey: ATTACHMENTS_KEY(taskId),
    queryFn: () => listAttachments(taskId),
    enabled: !!taskId,
  })
}

export function useAddAttachmentMutation(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AddAttachmentPayload) => addAttachment(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTACHMENTS_KEY(taskId) })
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEY(taskId) })
      toast.success('Attachment added')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to add attachment')
    },
  })
}

export function useRemoveAttachmentMutation(taskId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (attachmentId: string) => removeAttachment(taskId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTACHMENTS_KEY(taskId) })
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_KEY(taskId) })
      toast.success('Attachment removed')
    },
    onError: (err: AxiosError<ApiErrorResponse>) => {
      toast.error(err.response?.data?.error?.message ?? 'Failed to remove attachment')
    },
  })
}
