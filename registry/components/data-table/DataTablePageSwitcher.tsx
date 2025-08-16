'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDataTable } from '@/components/data-table/DataTableProvider'

export function DataTablePageSwitcher<TData>() {
  const { table } = useDataTable<TData>()

  return (
    <Select
      value={`${table.getState().pagination.pageSize}`}
      onValueChange={(value) => {
        table.setPageSize(Number(value))
      }}
    >
      <SelectTrigger className="h-8 w-[120px]" size="sm">
        <SelectValue placeholder={table.getState().pagination.pageSize} />
      </SelectTrigger>
      <SelectContent side="top">
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
