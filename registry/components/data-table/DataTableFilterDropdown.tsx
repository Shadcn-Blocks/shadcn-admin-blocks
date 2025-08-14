import * as React from 'react'
import { FilterIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DataTableColumn, FilterValue, FilterMetadata, getDefaultFilterType } from '@/components/data-table/DataTableColumn'
import { StaticDataSource } from '@/lib/data-sources'
import { SelectQuery } from '@jakub.knejzlik/ts-query'
import { RangeFilter } from './filters/RangeFilter'
import { TextFilter } from './filters/TextFilter'
import { ToggleFilter } from './filters/ToggleFilter'
import { DateRangeFilter } from './filters/DateRangeFilter'
import { MultiSelectFilter } from './filters/MultiSelectFilter'
import { cn } from '@/lib/utils'
import { DataTableFilterContext } from '@/components/data-table/DataTableFilterContext'

export interface DataTableFilterDropdownProps {
  column: DataTableColumn<any, any>
  datasource?: StaticDataSource
  query?: SelectQuery
  metadata?: FilterMetadata
  value?: any
  onChange: (value: any) => void
}

export const DataTableFilterDropdown: React.FC<DataTableFilterDropdownProps> = ({
  column,
  datasource,
  query,
  metadata,
  value,
  onChange
}) => {
  const [open, setOpen] = React.useState(false)
  // Use context if available, but don't fail if not
  const filterContext = React.useContext(DataTableFilterContext)
  
  // Extract FilterValue from TanStack Table format or context storage
  const extractFilterValue = React.useCallback((val: any): FilterValue | null => {
    if (!val) return null
    
    // If it's already our format, return it
    if (typeof val === 'object' && 'type' in val && !('_filterValue' in val)) {
      return val as FilterValue
    }
    
    // If it's the TanStack Table wrapper format, extract our data
    if (typeof val === 'object' && '_filterValue' in val) {
      return val._filterValue as FilterValue
    }
    
    // If it's a string (from our new approach), look up in context storage
    if (typeof val === 'string') {
      const columnId = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey))
      if (columnId && filterContext) {
        return filterContext.getFilterValue(columnId) || null
      }
    }
    
    return null
  }, [column, filterContext])
  
  const [localValue, setLocalValue] = React.useState(() => extractFilterValue(value))
  
  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue(extractFilterValue(value))
  }, [value, extractFilterValue])
  
  // Check if column is filterable
  const isFilterable = column.filterable !== false && 
    (!('type' in column) || column.type !== 'actions')
  
  if (!isFilterable) {
    return null
  }

  const filterType = column.filterType || getDefaultFilterType(column)
  
  // Don't show filter for 'none' type
  if (filterType === 'none') {
    return null
  }

  // Check if filter has a value
  const actualValue = extractFilterValue(value)
  const hasFilter = actualValue && (
    (actualValue.value !== undefined) || 
    (actualValue.from !== undefined) || 
    (actualValue.to !== undefined) || 
    (actualValue.values?.length > 0)
  )

  const handleFilterChange = (newValue: FilterValue | null) => {
    const columnId = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey))
    console.log('DataTableFilterDropdown: Filter value changed:', { column: columnId, newValue })
    setLocalValue(newValue)
    
    // Store in context if available
    if (columnId && filterContext) {
      if (newValue) {
        filterContext.setFilterValue(columnId, newValue)
      } else {
        filterContext.setFilterValue(columnId, null)
      }
    }
    
    onChange(newValue)
    // Close popover after applying filter
    if (newValue !== null) {
      setOpen(false)
    }
  }

  const renderFilterComponent = () => {
    // Use DateRangeFilter for date columns with range filter
    if ('type' in column && column.type === 'date' && filterType === 'range') {
      return (
        <DateRangeFilter
          column={column}
          datasource={datasource}
          query={query}
          value={localValue}
          onChange={handleFilterChange}
        />
      )
    }

    switch (filterType) {
      case 'range':
        return (
          <RangeFilter
            column={column}
            datasource={datasource}
            query={query}
            value={localValue}
            onChange={handleFilterChange}
          />
        )
      
      case 'contains':
      case 'equals':
        return (
          <TextFilter
            column={column}
            datasource={datasource}
            query={query}
            value={localValue}
            onChange={handleFilterChange}
          />
        )
      
      case 'select':
        return (
          <TextFilter
            column={column}
            datasource={datasource}
            query={query}
            value={localValue}
            onChange={handleFilterChange}
          />
        )
      
      case 'multi-select':
        return (
          <MultiSelectFilter
            column={column}
            datasource={datasource}
            query={query}
            value={localValue}
            onChange={handleFilterChange}
          />
        )
      
      case 'toggle':
        return (
          <ToggleFilter
            column={column}
            value={localValue}
            onChange={handleFilterChange}
          />
        )
      
      case 'custom':
        if (column.filterOptions?.renderFilter) {
          return column.filterOptions.renderFilter({
            column,
            datasource,
            query,
            metadata,
            value: localValue,
            onChange: handleFilterChange
          })
        }
        return null
      
      default:
        return (
          <div className="p-3 text-sm text-muted-foreground">
            Filter type "{filterType}" not implemented yet
          </div>
        )
    }
  }

  // Get column name for accessibility
  const columnName = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || 'column'
  
  // Get filter description for screen readers
  const getFilterDescription = () => {
    if (!hasFilter || !actualValue) return ''
    if (actualValue.from !== undefined || actualValue.to !== undefined) {
      return `Range: ${actualValue.from || 'min'} to ${actualValue.to || 'max'}`
    }
    if (actualValue.value !== undefined) {
      return `Value: ${actualValue.value}`
    }
    if (actualValue.values?.length > 0) {
      return `${actualValue.values.length} values selected`
    }
    return 'Active'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 w-9 p-0 relative group",
            "md:h-9 md:w-9", // Desktop size
            "touch:h-11 touch:w-11", // Mobile touch target (44px)
            hasFilter && "text-primary"
          )}
          aria-label={`Filter ${columnName}${hasFilter ? ` (${getFilterDescription()})` : ''}`}
          aria-expanded={open}
          aria-haspopup="dialog"
          title={`Filter ${columnName}`}
        >
          <FilterIcon className={cn(
            "h-4 w-4 transition-all",
            "group-hover:h-[18px] group-hover:w-[18px]",
            hasFilter && "h-[18px] w-[18px] fill-primary"
          )} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        className="w-auto p-0"
        onInteractOutside={(e) => {
          // Prevent closing when clicking date picker calendar
          const target = e.target as HTMLElement
          if (target.closest('[role="dialog"]')) {
            e.preventDefault()
          }
        }}
      >
        {renderFilterComponent()}
      </PopoverContent>
    </Popover>
  )
}