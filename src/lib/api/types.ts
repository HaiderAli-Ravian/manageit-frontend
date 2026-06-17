export interface ApiSuccessResponse<T> {
  success: true
  data: T
  message?: string
  meta?: { page: number; limit: number; total: number; totalPages: number }
}

export interface ApiErrorResponse {
  success: false
  error: { code: string; message: string; details?: unknown }
}
