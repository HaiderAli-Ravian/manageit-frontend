import axios from 'axios'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let pendingQueue: Array<{ resolve: () => void; reject: (err: unknown) => void }> = []

function drainQueue(error?: unknown) {
  pendingQueue.forEach(p => (error ? p.reject(error) : p.resolve()))
  pendingQueue = []
}

apiClient.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    const isAuthEndpoint =
      original?.url?.includes('/auth/refresh') ||
      original?.url?.includes('/auth/login') ||
      original?.url?.includes('/auth/signup')

    if (err.response?.status !== 401 || original?._retry || isAuthEndpoint) {
      return Promise.reject(err)
    }

    original._retry = true

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: () => resolve(apiClient(original)),
          reject,
        })
      })
    }

    isRefreshing = true

    try {
      await apiClient.post('/auth/refresh')
      drainQueue()
      return apiClient(original)
    } catch (refreshErr) {
      drainQueue(refreshErr)
      const { useAuthStore } = await import('@/store/auth.store')
      useAuthStore.getState().reset()
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient
