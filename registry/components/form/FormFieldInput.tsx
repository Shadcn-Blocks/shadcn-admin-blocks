import * as React from 'react'
import { FieldPath, FieldValues, ControllerRenderProps } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormFieldWrapper } from './FormFieldWrapper'
import { TypedFormFieldProps } from './types'

interface FormFieldInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends TypedFormFieldProps<
    TFieldValues,
    TName,
    React.ComponentProps<typeof Input>
  > {}

export const FormFieldInput = React.memo(<
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
}: FormFieldInputProps<TFieldValues, TName>) => {
  // Memoize the input render function
  const renderInput = React.useCallback((field: ControllerRenderProps<TFieldValues, TName>) => (
    <Input {...field} {...inputProps} />
  ), [inputProps])

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
      {renderInput}
    </FormFieldWrapper>
  )
}) as <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  props: FormFieldInputProps<TFieldValues, TName>
) => React.ReactElement

FormFieldInput.displayName = 'FormFieldInput'
