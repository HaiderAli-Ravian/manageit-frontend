'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface TaskPaginationProps {
  page: number
  totalPages: number
  limit?: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export function TaskPagination({
  page,
  totalPages,
  limit,
  onPageChange,
  onLimitChange,
}: TaskPaginationProps) {
  if (totalPages <= 1 && !onLimitChange) return null

  return (
    <div className="flex items-center justify-between gap-4">
      {onLimitChange && limit ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Rows per page</span>
          <Select
            value={String(limit)}
            onValueChange={(v) => v && onLimitChange(parseInt(v, 10))}
          >
            <SelectTrigger className="h-8 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="min-w-20 text-center text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
