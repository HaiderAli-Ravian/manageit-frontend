'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, 'type'>

export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const Icon = isVisible ? EyeOff : Eye

  return (
    <div className="relative">
      <Input
        type={isVisible ? 'text' : 'password'}
        className={className ? `${className} pr-9` : 'pr-9'}
        {...props}
      />
      <button
        type="button"
        aria-label={isVisible ? 'Hide password' : 'Show password'}
        onClick={() => setIsVisible(value => !value)}
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Icon className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}
