import * as React from 'react'
import { X } from 'lucide-react'
import { DataTableColumn, FilterValue, FilterMetadata } from '@/components/data-table/DataTableColumn'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StaticDataSource } from '@/lib/data-sources'
import { SelectQuery } from '@jakub.knejzlik/ts-query'
import { FilterMetadataService } from '@/components/data-table/services/FilterMetadataService'
import numeral from 'numeral'
import { useQuery } from '@tanstack/react-query'

export interface RangeFilterProps {
  column: DataTableColumn<any, any>
  datasource?: StaticDataSource
  query?: SelectQuery
  value?: FilterValue
  onChange: (value: FilterValue | null) => void
  isOpen?: boolean
}

export const RangeFilter: React.FC<RangeFilterProps> = ({
  column,
  datasource,
  query,
  value,
  onChange,
  isOpen = false
}) => {
  const [localValue, setLocalValue] = React.useState<{ from?: any; to?: any }>({
    from: value?.from,
    to: value?.to
  })

  // This component now only handles number ranges
  // Date ranges are handled by DateRangeFilter
  const isNumber = 'type' in column && column.type === 'number'

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
    enabled: !!datasource && !!query && (isOpen || (!!value && (value.from !== undefined || value.to !== undefined))),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })

  // Update local value when prop changes
  React.useEffect(() => {
    setLocalValue({
      from: value?.from,
      to: value?.to
    })
  }, [value])

  const handleApply = () => {
    if (!localValue.from && !localValue.to) {
      onChange(null)
    } else {
      onChange({
        type: 'range',
        from: localValue.from,
        to: localValue.to
      })
    }
  }

  const handleClear = () => {
    setLocalValue({ from: undefined, to: undefined })
    onChange(null)
  }

  const formatValue = (val: any) => {
    if (val === null || val === undefined) return ''
    if (isNumber && column.type === 'number' && column.format) {
      return numeral(val).format(column.format)
    }
    return String(val)
  }

  if (loading) {
    return (
      <div className="space-y-2 p-3 min-w-[280px]">
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-3 p-3 min-w-[280px]">
      {/* Header with Clear button */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Set range</div>
        {(localValue.from !== undefined || localValue.to !== undefined) && (
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

      {/* Range info */}
      {metadata && (metadata.min !== undefined || metadata.max !== undefined) && (
        <div className="text-xs text-muted-foreground">
          Data range: {formatValue(metadata.min)} - {formatValue(metadata.max)}
          {metadata.totalCount && (
            <span className="ml-1">({metadata.totalCount} records)</span>
          )}
        </div>
      )}

      {/* Range inputs */}
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder={`Min${metadata?.min !== undefined ? ` (${formatValue(metadata.min)})` : ''}`}
          value={localValue.from ?? ''}
          onChange={(e) => setLocalValue({ 
            ...localValue, 
            from: e.target.value ? Number(e.target.value) : undefined 
          })}
          min={metadata?.min as number}
          max={metadata?.max as number}
          step={'filterOptions' in column && column.filterOptions ? column.filterOptions.step : undefined}
          className="flex-1"
        />
        <Input
          type="number"
          placeholder={`Max${metadata?.max !== undefined ? ` (${formatValue(metadata.max)})` : ''}`}
          value={localValue.to ?? ''}
          onChange={(e) => setLocalValue({ 
            ...localValue, 
            to: e.target.value ? Number(e.target.value) : undefined 
          })}
          min={localValue.from || (metadata?.min as number)}
          max={metadata?.max as number}
          step={'filterOptions' in column && column.filterOptions ? column.filterOptions.step : undefined}
          className="flex-1"
        />
      </div>



      {/* Custom presets from column options */}
      {'filterOptions' in column && column.filterOptions?.presets && (
        <div className="flex gap-1 flex-wrap">
          {column.filterOptions.presets.map((preset: any, index: number) => (
            <Button
              key={index}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => {
                if (preset.value && typeof preset.value === 'object') {
                  setLocalValue(preset.value)
                }
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      )}

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