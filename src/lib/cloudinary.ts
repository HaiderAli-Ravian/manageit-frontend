const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
const MAX_BYTES = 4 * 1024 * 1024

export interface UploadResult {
  url: string
  name: string
  type: string
  size: number
}

export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Cloudinary is not configured')
  if (file.size > MAX_BYTES) throw new Error('File exceeds 4 MB limit')

  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
    { method: 'POST', body }
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: { message?: string } }
    throw new Error(data.error?.message ?? 'Upload failed')
  }

  const data = await res.json() as { secure_url: string }
  return { url: data.secure_url, name: file.name, type: file.type, size: file.size }
}
