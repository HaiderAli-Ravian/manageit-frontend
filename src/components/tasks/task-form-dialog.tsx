'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { TaskActivityList } from './task-activity-list'
import { useCreateTaskMutation, useUpdateTaskMutation } from '@/hooks/use-tasks'
import { taskFormSchema, type TaskFormInput } from '@/lib/validations/task'
import type { Task } from '@/services/task.service'

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  task?: Task
}

const createDefaults: TaskFormInput = {
  title: '',
  description: '',
  status: 'PENDING',
  priority: 'MEDIUM',
  dueDate: null,
}

function taskToDefaults(task: Task): TaskFormInput {
  return {
    title: task.title,
    description: task.description ?? '',
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ?? null,
  }
}

export function TaskFormDialog({ open, onOpenChange, mode, task }: TaskFormDialogProps) {
  const createMutation = useCreateTaskMutation()
  const updateMutation = useUpdateTaskMutation()
  const isPending = createMutation.isPending || updateMutation.isPending

  const form = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: mode === 'edit' && task ? taskToDefaults(task) : createDefaults,
  })

  useEffect(() => {
    if (open) {
      form.reset(mode === 'edit' && task ? taskToDefaults(task) : createDefaults)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function onSubmit(values: TaskFormInput) {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      priority: values.priority,
      dueDate: values.dueDate || undefined,
    }

    if (mode === 'create') {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    } else if (task) {
      updateMutation.mutate(
        { id: task.id, ...payload },
        { onSuccess: () => onOpenChange(false) },
      )
    }
  }

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          placeholder="Task title"
          {...form.register('title')}
          aria-invalid={!!form.formState.errors.title}
        />
        <FieldError errors={form.formState.errors.title ? [form.formState.errors.title] : []} />
      </Field>

      <Field>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <Textarea
          id="description"
          placeholder="Optional description"
          rows={3}
          {...form.register('description')}
        />
        <FieldError errors={form.formState.errors.description ? [form.formState.errors.description] : []} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={form.watch('status')}
            onValueChange={(v) => form.setValue('status', v as TaskFormInput['status'], { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Priority</FieldLabel>
          <Select
            value={form.watch('priority')}
            onValueChange={(v) => form.setValue('priority', v as TaskFormInput['priority'], { shouldValidate: true })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field>
        <FieldLabel>Due date</FieldLabel>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 justify-start text-left font-normal"
                />
              }
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch('dueDate')
                ? format(new Date(form.watch('dueDate')!), 'MMM d, yyyy')
                : 'Pick a date'}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={form.watch('dueDate') ? new Date(form.watch('dueDate')!) : undefined}
                onSelect={(date) =>
                  form.setValue('dueDate', date ? date.toISOString() : null, { shouldValidate: true })
                }
              />
            </PopoverContent>
          </Popover>
          {form.watch('dueDate') && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => form.setValue('dueDate', null, { shouldValidate: true })}
            >
              Clear
            </Button>
          )}
        </div>
      </Field>

      <DialogFooter>
        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === 'create' ? 'Create task' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'New task' : 'Edit task'}</DialogTitle>
        </DialogHeader>

        {mode === 'edit' && task ? (
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              {formContent}
            </TabsContent>
            <TabsContent value="activity">
              <TaskActivityList taskId={task.id} />
            </TabsContent>
          </Tabs>
        ) : (
          formContent
        )}
      </DialogContent>
    </Dialog>
  )
}
