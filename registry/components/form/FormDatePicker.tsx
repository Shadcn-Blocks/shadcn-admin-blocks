import * as React from 'react'
import { format, isValid } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

// Simple DatePicker component
export interface FormDatePickerProps {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  min?: Date
  max?: Date
}

export const FormDatePicker = React.forwardRef<HTMLButtonElement, FormDatePickerProps>(
  (
    { value, onValueChange, placeholder = 'Pick a date', disabled, className, min, max, ...props },
    ref
  ) => {
    const disabledDates = React.useCallback(
      (date: Date) => {
        if (min && date < min) return true
        if (max && date > max) return true
        return false
      },
      [min, max]
    )

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              className
            )}
            disabled={disabled}
            {...props}
          >
            {value && isValid(value) ? format(value, 'PPP') : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onValueChange}
            disabled={disabledDates}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    )
  }
)

FormDatePicker.displayName = 'FormDatePicker'
