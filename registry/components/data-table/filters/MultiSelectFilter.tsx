import * as React from 'react'
import { X, Search } from 'lucide-react'
import { DataTableColumn, FilterValue, FilterMetadata } from '@/components/data-table/DataTableColumn'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StaticDataSource } from '@/lib/data-sources'
import { SelectQuery } from '@jakub.knejzlik/ts-query'
import { FilterMetadataService } from '@/components/data-table/services/FilterMetadataService'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'

export interface MultiSelectFilterProps {
  column: DataTableColumn<any, any>
  datasource?: StaticDataSource
  query?: SelectQuery
  value?: FilterValue
  onChange: (value: FilterValue | null) => void
  isOpen?: boolean
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({
  column,
  datasource,
  query,
  value,
  onChange,
  isOpen = false
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
    new Set(value?.values || [])
  )

  // Get column id for query key
  const columnId = ('id' in column && column.id) || 
    ('accessorKey' in column && String(column.accessorKey)) || 'unknown'

  // Use React Query for metadata fetching
  const { data: metadata = {} as FilterMetadata, isLoading: loading } = useQuery<FilterMetadata>({
    queryKey: ['filter-metadata', query?.toSQL(), columnId],
    queryFn: async () => {
      if (!datasource || !query) return {} as FilterMetadata
      return FilterMetadataService.fetchMetadata(datasource, query, column)
    },
    // Enable query when dropdown is open or when we have existing values
    enabled: !!datasource && !!query && (isOpen || (!!value?.values && value.values.length > 0)),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  })

  // Update selected values when prop changes
  React.useEffect(() => {
    setSelectedValues(new Set(value?.values || []))
  }, [value])

  const handleToggleValue = (val: string) => {
    const newSelected = new Set(selectedValues)
    if (newSelected.has(val)) {
      newSelected.delete(val)
    } else {
      newSelected.add(val)
    }
    setSelectedValues(newSelected)
  }

  const handleSelectAll = () => {
    if (metadata?.distinctValues) {
      setSelectedValues(new Set(metadata.distinctValues.map(item => item.value || '__empty__')))
    }
  }

  const handleClear = () => {
    setSelectedValues(new Set())
    onChange(null)
  }

  const handleApply = () => {
    if (selectedValues.size === 0) {
      onChange(null)
    } else {
      const values = Array.from(selectedValues).map(v => v === '__empty__' ? '' : v)
      onChange({
        type: 'multi-select',
        values
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-2 p-4 min-w-[280px]">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  const filteredValues = metadata?.distinctValues?.filter(item => {
    const value = item.value || '(empty)'
    return value.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  const columnName = ('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || 'field'

  return (
    <div className="p-4 min-w-[300px] max-w-[400px]">
      {/* Header with Clear button */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">
          Select {columnName} values
        </div>
        {selectedValues.size > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="h-7 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Search input */}
      {filteredValues.length > 5 && (
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search values..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pl-8"
          />
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-2 mb-3">
        <Button
          size="sm"
          variant="outline"
          onClick={handleSelectAll}
          className="h-7 text-xs flex-1"
        >
          Select all ({metadata?.distinctValues?.length || 0})
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedValues(new Set())}
          className="h-7 text-xs flex-1"
        >
          Deselect all
        </Button>
      </div>

      {/* Selected count */}
      {selectedValues.size > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          {selectedValues.size} of {metadata?.distinctValues?.length || 0} selected
        </div>
      )}

      {/* Values list */}
      <ScrollArea className="h-[200px] border rounded-md p-2 mb-3">
        {filteredValues.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No matching values
          </div>
        ) : (
          <div className="space-y-1">
            {filteredValues.map((item) => {
              const itemValue = item.value || '__empty__'
              const isSelected = selectedValues.has(itemValue)
              return (
                <div
                  key={itemValue}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                    "hover:bg-accent",
                    isSelected && "bg-accent"
                  )}
                  onClick={() => handleToggleValue(itemValue)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleValue(itemValue)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-sm">
                      {item.value || '(empty)'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Info about null values */}
      {metadata?.nullCount && metadata.nullCount > 0 && (
        <div className="text-xs text-muted-foreground mb-3">
          {metadata.nullCount} empty values in data
        </div>
      )}

      {/* Action button */}
      <Button
        onClick={handleApply}
        className="w-full"
        disabled={selectedValues.size === 0}
      >
        Apply Filter ({selectedValues.size} selected)
      </Button>
    </div>
  )
}