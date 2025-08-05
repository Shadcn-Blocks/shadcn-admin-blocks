import * as React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form'
import { FormControl, FormDescription, FormLabel } from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { FormFieldWrapper } from '@/components/form/FormFieldWrapper'
import { BaseFormFieldProps, FieldValueType } from '@/lib/form/types'

interface FormFieldCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends BaseFormFieldProps<TFieldValues, TName> {
  children?: React.ReactNode
}

// Type constraint to ensure checkbox fields are boolean-compatible
type CheckboxFieldPath<TFieldValues extends FieldValues> = {
  [K in FieldPath<TFieldValues>]: FieldValueType<TFieldValues, K> extends boolean | undefined
    ? K
    : never
}[FieldPath<TFieldValues>]

export const FormFieldCheckbox = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends CheckboxFieldPath<TFieldValues> = CheckboxFieldPath<TFieldValues>,
>({
  name,
  control,
  defaultValue,
  rules,
  shouldUnregister,
  disabled,
  label,
  description,
  children,
  className,
}: FormFieldCheckboxProps<TFieldValues, TName>) => {
  // If children or label are provided, use the integrated checkbox+label style
  if (children || label) {
    return (
      <FormFieldWrapper
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        shouldUnregister={shouldUnregister}
        disabled={disabled}
        className={className}
        renderLayout={({ children: checkbox }) => {
          const checkboxId = `${name}-checkbox`
          return (
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>{React.cloneElement(checkbox, { id: checkboxId })}</FormControl>
              <div className="space-y-1 leading-none">
                {(children || label) && (
                  <FormLabel htmlFor={checkboxId} className="cursor-pointer font-normal leading-5">
                    {children || label}
                  </FormLabel>
                )}
                {description && <FormDescription>{description}</FormDescription>}
              </div>
            </div>
          )
        }}
      >
        {(field) => (
          <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
        )}
      </FormFieldWrapper>
    )
  }

  // Simple checkbox without integrated label
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
        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
      )}
    </FormFieldWrapper>
  )
}

FormFieldCheckbox.displayName = 'FormFieldCheckbox'
