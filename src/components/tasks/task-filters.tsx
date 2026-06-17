'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import { useTaskFilters } from '@/hooks/use-task-filters'

const statusLabels = {
  ALL: 'All statuses',
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const

const sortLabels = {
  createdAt: 'Created date',
  dueDate: 'Due date',
  priority: 'Priority',
  status: 'Status',
} as const

export function TaskFilters() {
  const { filters, updateFilters } = useTaskFilters()
  const [searchValue, setSearchValue] = useState(filters.search ?? '')
  const selectedStatus = filters.status ?? 'ALL'
  const selectedSort = filters.sortBy ?? 'createdAt'

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchValue || undefined })
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // Keep local search state in sync when URL changes externally (e.g. back button)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchValue(filters.search ?? '')
    }, 0)
    return () => clearTimeout(timer)
  }, [filters.search])

  return (
    <div className="premium-surface premium-hover grid gap-3 rounded-lg border bg-card/82 p-3 backdrop-blur-xl md:grid-cols-[minmax(16rem,1fr)_12rem_12rem_auto] md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="h-11 rounded-lg border-input/80 bg-background/62 pl-9 pr-9 shadow-none transition-all duration-200 focus-visible:bg-background"
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => setSearchValue('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Select
        value={filters.status ?? 'ALL'}
        onValueChange={(v) => updateFilters({ status: v === 'ALL' ? undefined : (v as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED') })}
      >
        <SelectTrigger className="h-11 w-full rounded-lg bg-background/62 transition-all duration-200 data-[size=default]:h-11">
          <span>{statusLabels[selectedStatus]}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={selectedSort}
        onValueChange={(v) => updateFilters({ sortBy: v as 'createdAt' | 'dueDate' | 'priority' | 'status' })}
      >
        <SelectTrigger className="h-11 w-full rounded-lg bg-background/62 transition-all duration-200 data-[size=default]:h-11">
          <span>{sortLabels[selectedSort]}</span>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="createdAt">Created date</SelectItem>
            <SelectItem value="dueDate">Due date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
        aria-label={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        className="size-11 justify-self-start rounded-lg border bg-background/62 shadow-sm transition-all duration-200 hover:shadow-md md:justify-self-auto"
      >
        {filters.sortOrder === 'asc' ? (
          <ChevronUp />
        ) : (
          <ChevronDown />
        )}
      </Button>
    </div>
  )
}
