import * as React from 'react'
import { X } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { DataTableColumn, FilterValue, FilterMetadata } from '@/components/data-table/DataTableColumn'
import { DateRangePicker } from '@/components/form/DateRangePicker'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StaticDataSource } from '@/lib/data-sources'
import { SelectQuery } from '@jakub.knejzlik/ts-query'
import { FilterMetadataService } from '@/components/data-table/services/FilterMetadataService'
import { parseFilterValue, toFilterValue, DATE_PRESETS } from '@/lib/date-range-utils'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

export interface DateRangeFilterProps {
  column: DataTableColumn<any, any>
  datasource?: StaticDataSource
  query?: SelectQuery
  value?: FilterValue
  onChange: (value: FilterValue | null) => void
  isOpen?: boolean
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  column,
  datasource,
  query,
  value,
  onChange,
  isOpen = false
}) => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    parseFilterValue(value)
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
    enabled: !!datasource && !!query && (isOpen || (!!value && (!!value.from || !!value.to))),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  })

  React.useEffect(() => {
    setDateRange(parseFilterValue(value))
  }, [value])

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
  }

  const handleApply = () => {
    onChange(toFilterValue(dateRange))
  }

  const handleClear = () => {
    setDateRange(undefined)
    onChange(null)
  }

  const handlePreset = (preset: () => DateRange) => {
    const range = preset()
    setDateRange(range)
    onChange(toFilterValue(range))
  }

  if (loading) {
    return (
      <div className="space-y-2 p-4 min-w-[320px]">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[280px] w-full" />
      </div>
    )
  }

  return (
    <div className="p-4 min-w-[320px] max-w-[640px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Select date range</div>
        {dateRange && (dateRange.from || dateRange.to) && (
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

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => handlePreset(DATE_PRESETS.today)}
        >
          Today
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => handlePreset(DATE_PRESETS.yesterday)}
        >
          Yesterday
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => handlePreset(DATE_PRESETS.last7Days)}
        >
          Last 7 days
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => handlePreset(DATE_PRESETS.last30Days)}
        >
          Last 30 days
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => handlePreset(DATE_PRESETS.thisMonth)}
        >
          This month
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => handlePreset(DATE_PRESETS.lastMonth)}
        >
          Last month
        </Button>
      </div>

      <DateRangePicker
        value={dateRange}
        onChange={handleDateRangeChange}
        className="w-full h-10 mb-3"
        minDate={metadata?.min ? dayjs(metadata.min).startOf('day').toDate() : undefined}
        maxDate={metadata?.max ? dayjs(metadata.max).endOf('day').toDate() : undefined}
        placeholder="Pick a date range"
      />

      {metadata && (metadata.min !== undefined || metadata.max !== undefined) && (
        <div className="text-xs text-muted-foreground mb-3">
          Data range: {metadata.min ? dayjs(metadata.min).format('MMM D, YYYY') : '...'} 
          {' - '}
          {metadata.max ? dayjs(metadata.max).format('MMM D, YYYY') : '...'}
          {metadata.nullCount && metadata.nullCount > 0 && (
            <span className="ml-1">({metadata.nullCount} empty values)</span>
          )}
        </div>
      )}

      <Button
        onClick={handleApply}
        className="w-full"
        disabled={!dateRange?.from && !dateRange?.to}
      >
        Apply Date Range
      </Button>
    </div>
  )
}