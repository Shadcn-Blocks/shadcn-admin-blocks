import * as React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormFieldWrapper } from '@/components/form/FormFieldWrapper'
import { TypedFormFieldProps } from '@/lib/form/types'

interface FormFieldNumberProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends TypedFormFieldProps<TFieldValues, TName, React.ComponentProps<typeof Input>> {}

export const FormFieldNumber = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  label,
  description,
  className,
  ...inputProps
}: FormFieldNumberProps<TFieldValues, TName>) => {
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
      {(field) => <Input {...field} {...inputProps} type="number" />}
    </FormFieldWrapper>
  )
}

FormFieldNumber.displayName = 'FormFieldNumber'