'use client'

import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
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

const statusLabels: Record<TaskFormInput['status'], string> = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

const priorityLabels: Record<TaskFormInput['priority'], string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
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

  const watchedStatus = useWatch({ control: form.control, name: 'status' })
  const watchedPriority = useWatch({ control: form.control, name: 'priority' })
  const watchedDueDate = useWatch({ control: form.control, name: 'dueDate' })

  const formContent = (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <Input
          id="title"
          placeholder="Task title"
          className="h-11 rounded-lg bg-background/70 px-4 shadow-none"
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
          className="min-h-28 rounded-lg bg-background/70 px-4 py-3 shadow-none"
          {...form.register('description')}
        />
        <FieldError errors={form.formState.errors.description ? [form.formState.errors.description] : []} />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel>Status</FieldLabel>
          <Select
            value={watchedStatus}
            onValueChange={(v) => form.setValue('status', v as TaskFormInput['status'], { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 w-full rounded-lg bg-background/70 px-4 data-[size=default]:h-11">
              <span>{statusLabels[watchedStatus]}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Priority</FieldLabel>
          <Select
            value={watchedPriority}
            onValueChange={(v) => form.setValue('priority', v as TaskFormInput['priority'], { shouldValidate: true })}
          >
            <SelectTrigger className="h-11 w-full rounded-lg bg-background/70 px-4 data-[size=default]:h-11">
              <span>{priorityLabels[watchedPriority]}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectGroup>
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
                  className="h-11 flex-1 justify-start rounded-lg bg-background/70 px-4 text-left font-normal"
                />
              }
            >
              <CalendarIcon data-icon="inline-start" />
              {watchedDueDate
                ? format(new Date(watchedDueDate), 'MMM d, yyyy')
                : 'Pick a date'}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={watchedDueDate ? new Date(watchedDueDate) : undefined}
                onSelect={(date) =>
                  form.setValue('dueDate', date ? date.toISOString() : null, { shouldValidate: true })
                }
              />
            </PopoverContent>
          </Popover>
          {watchedDueDate && (
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-lg px-4"
              onClick={() => form.setValue('dueDate', null, { shouldValidate: true })}
            >
              Clear
            </Button>
          )}
        </div>
      </Field>

      <DialogFooter className="-mx-6 -mb-6 p-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="h-11 rounded-lg px-5"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} className="h-11 rounded-lg px-5">
          {isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {mode === 'create' ? 'Create task' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="premium-surface max-h-[90vh] gap-5 overflow-y-auto rounded-lg bg-card/95 p-6 backdrop-blur-2xl sm:max-w-xl md:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            {mode === 'create' ? 'New task' : 'Edit task'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'edit' && task ? (
          <Tabs defaultValue="details">
            <TabsList className="mb-5 h-11 w-full justify-start rounded-lg bg-muted/70">
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
