import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  taskAttachment: f({
    image: { maxFileSize: '4MB', maxFileCount: 1 },
    pdf: { maxFileSize: '4MB', maxFileCount: 1 },
    'application/msword': { maxFileSize: '4MB', maxFileCount: 1 },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const cookieHeader = req.headers.get('cookie') ?? ''
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { cookie: cookieHeader },
        credentials: 'include',
      })
      if (!res.ok) throw new UploadThingError('Unauthorized')
      const json = await res.json()
      const userId = json.data?.id
      if (!userId) throw new UploadThingError('Unauthorized')
      return { userId }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete:', { userId: metadata.userId, url: file.url })
      return { uploadedBy: metadata.userId, url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
