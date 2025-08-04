import * as React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { dateUtils } from './date-utils'
import { cn } from '@/lib/utils'
import { FormFieldWrapper } from './FormFieldWrapper'
import { BaseFormFieldProps, FieldValueType } from './types'

interface FormFieldDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string
  dateFormat?: string
  min?: Date
  max?: Date
}

// Type constraint to ensure date picker fields accept Date values
type DateFieldPath<TFieldValues extends FieldValues> = {
  [K in FieldPath<TFieldValues>]: FieldValueType<TFieldValues, K> extends Date | undefined
    ? K
    : never
}[FieldPath<TFieldValues>]

export const FormFieldDatePicker = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends DateFieldPath<TFieldValues> = DateFieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  label,
  description,
  placeholder = 'Pick a date',
  dateFormat = 'PPP',
  min,
  max,
  className,
}: FormFieldDatePickerProps<TFieldValues, TName>) => {
  return (
    <FormFieldWrapper
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={rules}
      shouldUnregister={shouldUnregister}
      disabled={disabled}
      label={label}
      description={description}
      className={className}
    >
      {(field) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !field.value && 'text-muted-foreground'
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? dateUtils.formatForDisplay(field.value, dateFormat) : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={field.value}
              onSelect={field.onChange}
              disabled={(date) => {
                if (disabled) return true
                if (min && date < min) return true
                if (max && date > max) return true
                return false
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      )}
    </FormFieldWrapper>
  )
}

FormFieldDatePicker.displayName = 'FormFieldDatePicker'