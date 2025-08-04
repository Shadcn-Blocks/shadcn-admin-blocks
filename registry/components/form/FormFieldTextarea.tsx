import * as React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { FormFieldWrapper } from './FormFieldWrapper'
import { TypedFormFieldProps } from './types'

interface FormFieldTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends TypedFormFieldProps<
    TFieldValues,
    TName,
    React.ComponentProps<typeof Textarea>
  > {}

export const FormFieldTextarea = <
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
  ...textareaProps
}: FormFieldTextareaProps<TFieldValues, TName>) => {
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
      {(field) => <Textarea {...field} {...textareaProps} />}
    </FormFieldWrapper>
  )
}

FormFieldTextarea.displayName = 'FormFieldTextarea'