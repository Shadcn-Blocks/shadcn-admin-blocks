import * as React from 'react'
import { Search, X } from 'lucide-react'
import { DataTableColumn, FilterMetadata, FilterValue } from '@/components/data-table/DataTableColumn'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StaticDataSource } from '@/lib/data-sources'
import { SelectQuery } from '@jakub.knejzlik/ts-query'
import { FilterMetadataService } from '@/components/data-table/services/FilterMetadataService'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface TextFilterProps {
  column: DataTableColumn<any, any>
  datasource?: StaticDataSource
  query?: SelectQuery
  value?: FilterValue
  onChange: (value: FilterValue | null) => void
}

export const TextFilter: React.FC<TextFilterProps> = ({
  column,
  datasource,
  query,
  value,
  onChange
}) => {
  const [metadata, setMetadata] = React.useState<FilterMetadata>()
  const [loading, setLoading] = React.useState(true)
  const [mode, setMode] = React.useState<'select' | 'search'>('search')
  const [searchValue, setSearchValue] = React.useState(value?.value || '')
  const [filterType, setFilterType] = React.useState<'contains' | 'equals'>(
    value?.type === 'equals' ? 'equals' : 'contains'
  )

  // Fetch metadata
  React.useEffect(() => {
    if (!datasource || !query) {
      setLoading(false)
      return
    }

    FilterMetadataService.fetchMetadata(datasource, query, column)
      .then(data => {
        setMetadata(data)
        // Auto-switch to select mode if few distinct values
        if ((data.totalDistinct || 0) <= 10 && data.distinctValues) {
          setMode('select')
        }
      })
      .catch(error => {
        console.warn('Failed to fetch filter metadata:', error)
        setMetadata({})
      })
      .finally(() => setLoading(false))
  }, [datasource, query, column])

  // Update search value when prop changes
  React.useEffect(() => {
    setSearchValue(value?.value || '')
  }, [value])

  const handleApply = () => {
    if (!searchValue) {
      onChange(null)
    } else {
      onChange({
        type: filterType,
        value: searchValue
      })
    }
  }

  const handleSelectValue = (selectedValue: string) => {
    if (selectedValue === '__all__') {
      onChange(null)
    } else {
      onChange({
        type: 'equals',
        value: selectedValue === '__empty__' ? '' : selectedValue
      })
    }
  }

  const handleClear = () => {
    setSearchValue('')
    onChange(null)
  }

  if (loading) {
    return (
      <div className="space-y-2 p-3 min-w-[280px]">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  // If we have few distinct values, show select mode
  const showSelectMode = metadata && 
    metadata.totalDistinct !== undefined && 
    metadata.totalDistinct <= 10 &&
    metadata.distinctValues &&
    metadata.distinctValues.length > 0

  if (showSelectMode && mode === 'select') {
    return (
      <div className="space-y-3 p-3 min-w-[280px]">
        {/* Header with Clear button */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Select a value ({metadata.totalDistinct} unique)
          </div>
          {value?.value && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClear}
              className="h-7 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <Select
          value={value?.value === '' ? '__empty__' : (value?.value || '__all__')}
          onValueChange={handleSelectValue}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">
              All ({metadata.totalCount} records)
            </SelectItem>
            {metadata.distinctValues?.map((item) => (
              <SelectItem 
                key={item.value || '__empty__'} 
                value={item.value || '__empty__'}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{item.value || '(empty)'}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({item.count})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Option to switch to search mode */}
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => setMode('search')}
        >
          <Search className="mr-2 h-4 w-4" />
          Switch to search
        </Button>
      </div>
    )
  }

  // Search mode
  return (
    <div className="space-y-3 p-3 min-w-[280px]">
      {/* Header with Clear button */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {metadata?.totalDistinct !== undefined && (
            <>
              {metadata.totalDistinct} unique values
              {showSelectMode && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-2 h-auto p-0 text-xs"
                  onClick={() => setMode('select')}
                >
                  Show list
                </Button>
              )}
            </>
          )}
        </div>
        {searchValue && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="h-7 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search input */}
      <div className="space-y-2">
        <Input
          placeholder={`Search ${('id' in column && column.id) || ('accessorKey' in column && String(column.accessorKey)) || 'field'}...`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApply()
            }
          }}
          className="h-9"
        />
        
        {/* Filter type selector */}
        <div className="flex gap-1">
          <Button
            size="sm"
            variant={filterType === 'contains' ? 'default' : 'outline'}
            onClick={() => setFilterType('contains')}
            className="flex-1 h-8"
          >
            Contains
          </Button>
          <Button
            size="sm"
            variant={filterType === 'equals' ? 'default' : 'outline'}
            onClick={() => setFilterType('equals')}
            className="flex-1 h-8"
          >
            Exact match
          </Button>
        </div>
      </div>

      {/* Action button */}
      <div className="pt-2 border-t">
        <Button
          size="sm"
          onClick={handleApply}
          className="w-full font-medium min-h-[36px] md:min-h-[32px] touch:min-h-[44px]"
        >
          Apply Filter
        </Button>
      </div>
    </div>
  )
}