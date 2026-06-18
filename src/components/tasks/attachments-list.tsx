'use client'

import { useRef, useState } from 'react'
import { formatDistanceToNowStrict } from 'date-fns'
import { AnimatePresence, motion } from 'motion/react'
import {
  ExternalLink,
  File,
  FileText,
  FileType,
  ImageIcon,
  Loader2,
  Paperclip,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/lib/cloudinary'
import {
  useAttachments,
  useAddAttachmentMutation,
  useRemoveAttachmentMutation,
} from '@/hooks/use-attachments'
import { formatFileSize } from '@/lib/format-file-size'
import type { Attachment } from '@/services/attachment.service'

interface AttachmentsListProps {
  taskId: string
}

function FileIcon({ fileType }: { fileType: string }) {
  if (fileType.startsWith('image/')) return <ImageIcon className="size-4" />
  if (fileType === 'application/pdf') return <FileText className="size-4" />
  if (
    fileType === 'application/msword' ||
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <FileType className="size-4" />
  }
  return <File className="size-4" />
}

function AttachmentRow({
  attachment,
  onRemove,
  isRemoving,
}: {
  attachment: Attachment
  onRemove: (id: string) => void
  isRemoving: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.16 }}
      className="relative flex items-center gap-3 rounded-lg border bg-background/68 px-3 py-2.5 shadow-sm"
    >
      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <FileIcon fileType={attachment.fileType} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium"
          title={attachment.fileName}
        >
          {attachment.fileName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(attachment.fileSize)} &middot;{' '}
          {formatDistanceToNowStrict(new Date(attachment.createdAt))} ago
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8"
          asChild
        >
          <a
            href={attachment.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open file"
          >
            <ExternalLink className="size-4" />
          </a>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-destructive"
          onClick={() => onRemove(attachment.id)}
          disabled={isRemoving}
          aria-label="Remove file"
        >
          {isRemoving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      </div>
    </motion.div>
  )
}

export function AttachmentsList({ taskId }: AttachmentsListProps) {
  const { data: attachments, isLoading } = useAttachments(taskId)
  const addMutation = useAddAttachmentMutation(taskId)
  const removeMutation = useRemoveAttachmentMutation(taskId)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    setIsUploading(true)
    try {
      const result = await uploadToCloudinary(file)
      addMutation.mutate({
        fileUrl: result.url,
        fileName: result.name,
        fileType: result.type,
        fileSize: result.size,
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">Files</span>
        {attachments && attachments.length > 0 && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {attachments.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border bg-muted/20 p-3">
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : attachments && attachments.length > 0 ? (
        <div className="flex flex-col gap-2">
          <AnimatePresence initial={false}>
            {attachments.map((attachment) => (
              <AttachmentRow
                key={attachment.id}
                attachment={attachment}
                onRemove={(id) => removeMutation.mutate(id)}
                isRemoving={
                  removeMutation.isPending && removeMutation.variables === attachment.id
                }
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No files attached</p>
      )}

      <div className="flex flex-col items-center gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          className="sr-only"
          accept="image/*,.pdf,.doc,.docx"
          disabled={isUploading}
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className=""
        >
          {isUploading
            ? <Loader2 className="mr-2 size-4 animate-spin" />
            : <Paperclip className="mr-2 size-4" />}
          {isUploading ? 'Uploading…' : 'Attach file'}
        </Button>
        <p className="text-xs text-muted-foreground">Images, PDF, DOC, DOCX · max 4 MB</p>
      </div>
    </div>
  )
}
