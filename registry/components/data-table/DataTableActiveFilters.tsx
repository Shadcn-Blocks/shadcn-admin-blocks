import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDataTable } from '@/components/data-table/DataTableProvider'
import { DataTableColumn } from '@/components/data-table/DataTableColumn'
import dayjs from 'dayjs'

interface DataTableActiveFiltersProps<TData> {
  columns: DataTableColumn<TData, any>[]
}

export function DataTableActiveFilters<TData>({ columns }: DataTableActiveFiltersProps<TData>) {
  const table = useDataTable()
  const columnFilters = table.getState().columnFilters
  
  if (columnFilters.length === 0) {
    return null
  }
  
  const getFilterLabel = (columnId: string, value: any): string => {
    const column = columns.find(c => 
      ('id' in c && c.id === columnId) || 
      ('accessorKey' in c && String(c.accessorKey) === columnId)
    )
    
    if (!column) return `${columnId}: ${JSON.stringify(value)}`
    
    const columnName = ('id' in column && column.id) || 
                      ('accessorKey' in column && String(column.accessorKey)) || 
                      'Unknown'
    
    // Handle different filter value types
    if (value?.from !== undefined || value?.to !== undefined) {
      const from = value.from ?? 'min'
      const to = value.to ?? 'max'
      
      if ('type' in column && column.type === 'date') {
        const fromStr = value.from ? dayjs(value.from).format('MMM D') : 'start'
        const toStr = value.to ? dayjs(value.to).format('MMM D') : 'end'
        return `${columnName}: ${fromStr} to ${toStr}`
      }
      
      return `${columnName}: ${from} to ${to}`
    }
    
    if (value?.value !== undefined) {
      return `${columnName}: ${value.value}`
    }
    
    if (value?.values?.length > 0) {
      return `${columnName}: ${value.values.length} selected`
    }
    
    // Fallback for simple values
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return `${columnName}: ${value}`
    }
    
    return `${columnName}: filtered`
  }
  
  const clearFilter = (columnId: string) => {
    table.getColumn(columnId)?.setFilterValue(undefined)
  }
  
  const clearAllFilters = () => {
    table.resetColumnFilters()
  }
  
  return (
    <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
      <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
      <div className="flex flex-wrap gap-2">
        {columnFilters.map((filter) => (
          <Badge
            key={filter.id}
            variant="secondary"
            className="pr-1.5 text-xs font-normal"
          >
            {getFilterLabel(filter.id, filter.value)}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 h-auto p-0 hover:bg-transparent"
              onClick={() => clearFilter(filter.id)}
              aria-label={`Clear filter for ${filter.id}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="ml-auto text-xs"
      >
        Clear all
      </Button>
    </div>
  )
}