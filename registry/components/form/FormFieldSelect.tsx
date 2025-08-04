import * as React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormFieldWrapper } from './FormFieldWrapper'
import { BaseFormFieldProps, FieldValueType } from './types'

interface FormFieldSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  placeholder?: string
  children: React.ReactNode
}

// Type constraint to ensure select fields accept string values
type SelectFieldPath<TFieldValues extends FieldValues> = {
  [K in FieldPath<TFieldValues>]: FieldValueType<TFieldValues, K> extends string | undefined
    ? K
    : never
}[FieldPath<TFieldValues>]

export const FormFieldSelect = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends SelectFieldPath<TFieldValues> = SelectFieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  label,
  description,
  placeholder,
  children,
  className,
}: FormFieldSelectProps<TFieldValues, TName>) => {
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
        <Select onValueChange={field.onChange} value={field.value} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {children}
          </SelectContent>
        </Select>
      )}
    </FormFieldWrapper>
  )
}

FormFieldSelect.displayName = 'FormFieldSelect'