import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface DateRangePickerProps {
  value?: DateRange
  onChange?: (value: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  numberOfMonths?: number
  disabledDates?: (date: Date) => boolean
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(({
  value,
  onChange,
  placeholder = 'Pick a date range',
  className,
  disabled,
  minDate,
  maxDate,
  numberOfMonths = 2,
  disabledDates
}, ref) => {
  const [open, setOpen] = React.useState(false)
  const [localRange, setLocalRange] = React.useState<DateRange | undefined>(value)
  const [isSelectingNewRange, setIsSelectingNewRange] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  React.useEffect(() => {
    setLocalRange(value)
  }, [value])

  React.useEffect(() => {
    if (!open) {
      setIsSelectingNewRange(false)
    }
  }, [open])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        setLocalRange(value)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, value])

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      setLocalRange(undefined)
      onChange?.(undefined)
      setIsSelectingNewRange(false)
      return
    }
    
    if (range.from && !range.to) {
      setLocalRange(range)
      setIsSelectingNewRange(true)
      return
    }
    
    if (range.from && range.to) {
      if (isSelectingNewRange) {
        setLocalRange(range)
        onChange?.(range)
        setOpen(false)
        setIsSelectingNewRange(false)
      } else {
        setLocalRange({ from: range.from, to: undefined })
        setIsSelectingNewRange(true)
      }
    }
  }

  const isDateDisabled = (date: Date) => {
    if (disabledDates) {
      return disabledDates(date)
    }
    
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    
    return false
  }

  const getAriaLabel = () => {
    if (localRange?.from && localRange?.to) {
      return `Date range: ${format(localRange.from, 'MMMM d, yyyy')} to ${format(localRange.to, 'MMMM d, yyyy')}`
    }
    if (localRange?.from) {
      return `Date range starting ${format(localRange.from, 'MMMM d, yyyy')}`
    }
    return 'Select date range'
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={ref}
          variant="outline"
          disabled={disabled}
          className={cn(
            'justify-start text-left font-normal',
            !localRange && 'text-muted-foreground',
            className
          )}
          aria-label={getAriaLabel()}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {localRange?.from ? (
            localRange.to ? (
              <>
                {format(localRange.from, 'MMM d, yyyy')} - {format(localRange.to, 'MMM d, yyyy')}
              </>
            ) : (
              format(localRange.from, 'MMM d, yyyy')
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={localRange?.from || minDate}
          selected={localRange}
          onSelect={handleSelect}
          numberOfMonths={isDesktop ? numberOfMonths : 1}
          disabled={isDateDisabled}
        />
      </PopoverContent>
    </Popover>
  )
})

DateRangePicker.displayName = 'DateRangePicker'