import * as React from 'react'
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { DataTableColumn, FilterMetadata, FilterValue } from '@/components/data-table/DataTableColumn'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { StaticDataSource } from '@/lib/data-sources'
import { SelectQuery } from '@jakub.knejzlik/ts-query'
import { FilterMetadataService } from '@/components/data-table/services/FilterMetadataService'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'

export interface DateRangeFilterProps {
  column: DataTableColumn<any, any>
  datasource?: StaticDataSource
  query?: SelectQuery
  value?: FilterValue
  onChange: (value: FilterValue | null) => void
}

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  column,
  datasource,
  query,
  value,
  onChange
}) => {
  const [metadata, setMetadata] = React.useState<FilterMetadata>()
  const [loading, setLoading] = React.useState(true)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    value?.from || value?.to
      ? {
          from: value?.from ? new Date(value.from) : undefined,
          to: value?.to ? new Date(value.to) : undefined
        }
      : undefined
  )

  // Fetch metadata when component mounts
  React.useEffect(() => {
    if (!datasource || !query) {
      setLoading(false)
      return
    }

    FilterMetadataService.fetchMetadata(datasource, query, column)
      .then(setMetadata)
      .catch(error => {
        console.warn('Failed to fetch filter metadata:', error)
        setMetadata({})
      })
      .finally(() => setLoading(false))
  }, [datasource, query, column])

  // Update local value when prop changes
  React.useEffect(() => {
    setDateRange(
      value?.from || value?.to
        ? {
            from: value?.from ? new Date(value.from) : undefined,
            to: value?.to ? new Date(value.to) : undefined
          }
        : undefined
    )
  }, [value])

  const handleApply = () => {
    if (!dateRange?.from && !dateRange?.to) {
      onChange(null)
    } else {
      onChange({
        type: 'range',
        from: dateRange?.from?.toISOString(),
        to: dateRange?.to?.toISOString()
      })
    }
  }

  const handleClear = () => {
    setDateRange(undefined)
    onChange(null)
  }

  const handlePreset = (from: Date, to: Date) => {
    setDateRange({ from, to })
    onChange({
      type: 'range',
      from: from.toISOString(),
      to: to.toISOString()
    })
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

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <div className="p-4 min-w-[320px] max-w-[640px]">
      {/* Header with Clear button */}
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

      {/* Presets */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => {
            const startOfToday = new Date(today)
            startOfToday.setHours(0, 0, 0, 0)
            const endOfToday = new Date(today)
            endOfToday.setHours(23, 59, 59, 999)
            handlePreset(startOfToday, endOfToday)
          }}
        >
          Today
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => {
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            yesterday.setHours(0, 0, 0, 0)
            const endOfYesterday = new Date(yesterday)
            endOfYesterday.setHours(23, 59, 59, 999)
            handlePreset(yesterday, endOfYesterday)
          }}
        >
          Yesterday
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => {
            const last7 = new Date(today)
            last7.setDate(last7.getDate() - 6) // 6 days ago + today = 7 days
            last7.setHours(0, 0, 0, 0)
            const endOfToday = new Date(today)
            endOfToday.setHours(23, 59, 59, 999)
            handlePreset(last7, endOfToday)
          }}
        >
          Last 7 days
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => {
            const last30 = new Date(today)
            last30.setDate(last30.getDate() - 29) // 29 days ago + today = 30 days
            last30.setHours(0, 0, 0, 0)
            const endOfToday = new Date(today)
            endOfToday.setHours(23, 59, 59, 999)
            handlePreset(last30, endOfToday)
          }}
        >
          Last 30 days
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            startOfMonth.setHours(0, 0, 0, 0)
            const endOfToday = new Date(today)
            endOfToday.setHours(23, 59, 59, 999)
            handlePreset(startOfMonth, endOfToday)
          }}
        >
          This month
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="justify-start h-8 text-xs"
          onClick={() => {
            const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
            startOfLastMonth.setHours(0, 0, 0, 0)
            const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
            endOfLastMonth.setHours(23, 59, 59, 999)
            handlePreset(startOfLastMonth, endOfLastMonth)
          }}
        >
          Last month
        </Button>
      </div>

      {/* Single date range input */}
      <div className="mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal h-10',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'MMM d, yyyy')} - {format(dateRange.to, 'MMM d, yyyy')}
                  </>
                ) : (
                  format(dateRange.from, 'MMM d, yyyy')
                )
              ) : (
                'Pick a date range'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {/* Desktop: Show 2 months side by side */}
            <div className="hidden md:block">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={(date) => {
                  if (metadata?.max && date > new Date(metadata.max)) return true
                  if (metadata?.min && date < new Date(metadata.min)) return true
                  return false
                }}
              />
            </div>
            {/* Mobile: Show single month */}
            <div className="md:hidden">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                disabled={(date) => {
                  if (metadata?.max && date > new Date(metadata.max)) return true
                  if (metadata?.min && date < new Date(metadata.min)) return true
                  return false
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>


      {/* Metadata info */}
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

      {/* Action button */}
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