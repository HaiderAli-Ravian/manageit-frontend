'use client'

import { useState, useEffect } from 'react'
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useTaskFilters } from '@/hooks/use-task-filters'

export function TaskFilters() {
  const { filters, updateFilters } = useTaskFilters()
  const [searchValue, setSearchValue] = useState(filters.search ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchValue || undefined })
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])

  // Keep local search state in sync when URL changes externally (e.g. back button)
  useEffect(() => {
    setSearchValue(filters.search ?? '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search])

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-9 pr-9"
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
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy ?? 'createdAt'}
        onValueChange={(v) => updateFilters({ sortBy: v as 'createdAt' | 'dueDate' | 'priority' | 'status' })}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Created date</SelectItem>
          <SelectItem value="dueDate">Due date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
          <SelectItem value="status">Status</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
        aria-label={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        className="flex-shrink-0"
      >
        {filters.sortOrder === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
