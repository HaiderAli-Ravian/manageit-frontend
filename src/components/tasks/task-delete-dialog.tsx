'use client'

import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useDeleteTaskMutation } from '@/hooks/use-tasks'
import type { Task } from '@/services/task.service'

interface TaskDeleteDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TaskDeleteDialog({ task, open, onOpenChange }: TaskDeleteDialogProps) {
  const deleteMutation = useDeleteTaskMutation()

  function handleConfirm() {
    if (!task) return
    deleteMutation.mutate(task.id, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="premium-surface max-w-lg rounded-lg bg-card/95 p-6 backdrop-blur-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold tracking-tight">Delete task?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{' '}
            <span className="font-semibold text-foreground">{task?.title}</span>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 p-6">
          <AlertDialogCancel className="h-11 rounded-lg px-5">Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={deleteMutation.isPending}
            className="h-11 rounded-lg px-5"
          >
            {deleteMutation.isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
