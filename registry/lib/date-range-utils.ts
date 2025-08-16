import { DateRange } from 'react-day-picker'
import { FilterValue } from '@/components/data-table/DataTableColumn'
import dayjs from 'dayjs'

export const parseFilterValue = (filterValue?: FilterValue): DateRange | undefined => {
  if (!filterValue?.from && !filterValue?.to) return undefined
  return {
    from: filterValue.from ? new Date(filterValue.from) : undefined,
    to: filterValue.to ? new Date(filterValue.to) : undefined
  }
}

export const toFilterValue = (dateRange?: DateRange): FilterValue | null => {
  if (!dateRange?.from && !dateRange?.to) return null
  return {
    type: 'range',
    from: dateRange?.from?.toISOString(),
    to: dateRange?.to?.toISOString()
  }
}

export const formatDateRange = (range?: DateRange): string => {
  if (!range?.from) return ''
  if (!range.to) return dayjs(range.from).format('MMM D, YYYY')
  return `${dayjs(range.from).format('MMM D, YYYY')} - ${dayjs(range.to).format('MMM D, YYYY')}`
}

export const DATE_PRESETS = {
  today: () => ({
    from: dayjs().startOf('day').toDate(),
    to: dayjs().endOf('day').toDate()
  }),
  yesterday: () => ({
    from: dayjs().subtract(1, 'day').startOf('day').toDate(),
    to: dayjs().subtract(1, 'day').endOf('day').toDate()
  }),
  last7Days: () => ({
    from: dayjs().subtract(6, 'days').startOf('day').toDate(),
    to: dayjs().endOf('day').toDate()
  }),
  last30Days: () => ({
    from: dayjs().subtract(29, 'days').startOf('day').toDate(),
    to: dayjs().endOf('day').toDate()
  }),
  thisMonth: () => ({
    from: dayjs().startOf('month').toDate(),
    to: dayjs().endOf('day').toDate()
  }),
  lastMonth: () => ({
    from: dayjs().subtract(1, 'month').startOf('month').toDate(),
    to: dayjs().subtract(1, 'month').endOf('month').toDate()
  })
} as const

export const validateDateRange = (range?: DateRange): boolean => {
  if (!range?.from || !range?.to) return true
  return range.from <= range.to
}