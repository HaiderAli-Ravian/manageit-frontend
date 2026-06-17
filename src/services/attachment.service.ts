import apiClient from '@/lib/api/client'
import type { ApiSuccessResponse } from '@/lib/api/types'

export interface Attachment {
  id: string
  taskId: string
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
  uploadedById: string
  createdAt: string
  updatedAt: string
}

export interface AddAttachmentPayload {
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number
}

export async function listAttachments(taskId: string): Promise<Attachment[]> {
  const res = await apiClient.get<ApiSuccessResponse<Attachment[]>>(`/tasks/${taskId}/attachments`)
  return res.data.data
}

export async function addAttachment(taskId: string, payload: AddAttachmentPayload): Promise<Attachment> {
  const res = await apiClient.post<ApiSuccessResponse<Attachment>>(`/tasks/${taskId}/attachments`, payload)
  return res.data.data
}

export async function removeAttachment(taskId: string, attachmentId: string): Promise<void> {
  await apiClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`)
}
