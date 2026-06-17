'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { useSignupMutation } from '@/hooks/use-auth'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PasswordInput from '@/components/auth/password-input'

export default function SignupForm() {
  const mutation = useSignupMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  return (
    <form onSubmit={handleSubmit(values => mutation.mutate(values))} className="flex flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="name">Name</FieldLabel>
        <Input id="name" type="text" placeholder="Your name" {...register('name')} />
        {errors.name && <FieldError>{errors.name.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
        {errors.email && <FieldError>{errors.email.message}</FieldError>}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Password</FieldLabel>
        <PasswordInput id="password" placeholder="••••••••" {...register('password')} />
        {errors.password && <FieldError>{errors.password.message}</FieldError>}
      </Field>

      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending && <Loader2 data-icon="inline-start" className="animate-spin" />}
        {mutation.isPending ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  )
}
